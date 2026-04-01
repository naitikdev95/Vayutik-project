import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AppCard } from "@/components/apps/app-card"
import { AppsFilter } from "@/components/apps/apps-filter"
import { Skeleton } from "@/components/ui/skeleton"
import type { App } from "@/lib/types"

interface AppsPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    pricing?: string
    q?: string
  }>
}

async function getApps(params: {
  category?: string
  sort?: string
  pricing?: string
  q?: string
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from("apps")
    .select("*, category:categories(*)")

  // Filter by category
  if (params.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single()
    
    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  // Filter by pricing
  if (params.pricing && params.pricing !== "all") {
    query = query.eq("pricing_type", params.pricing)
  }

  // Search
  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,tagline.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  // Sort
  switch (params.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "rating":
      query = query.order("average_rating", { ascending: false })
      break
    case "installs":
      query = query.order("total_installs", { ascending: false })
      break
    default:
      query = query.order("featured", { ascending: false }).order("average_rating", { ascending: false })
  }

  const { data } = await query.limit(50)
  return (data || []) as App[]
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data || []
}

function AppsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  )
}

async function AppsGrid({ params }: { params: AppsPageProps["searchParams"] }) {
  const resolvedParams = await params
  const apps = await getApps(resolvedParams)

  if (apps.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium mb-2">No apps found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  )
}

export default async function AppsPage({ searchParams }: AppsPageProps) {
  const categories = await getCategories()
  const resolvedParams = await searchParams

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Browse Apps</h1>
            <p className="text-muted-foreground mt-2">
              Discover the best software, SaaS products, and web tools
            </p>
          </div>

          {/* Filters */}
          <AppsFilter categories={categories} currentParams={resolvedParams} />

          {/* Apps Grid */}
          <Suspense fallback={<AppsGridSkeleton />}>
            <AppsGrid params={searchParams} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
