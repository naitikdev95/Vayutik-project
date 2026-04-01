import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedApps } from "@/components/landing/featured-apps"
import { CategoriesSection } from "@/components/landing/categories-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CTASection } from "@/components/landing/cta-section"
import { Skeleton } from "@/components/ui/skeleton"

async function getFeaturedApps() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("apps")
    .select("*, category:categories(*)")
    .eq("featured", true)
    .order("average_rating", { ascending: false })
    .limit(6)
  return data || []
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name")
  return data || []
}

async function getStats() {
  const supabase = await createClient()
  
  const [appsResult, categoriesResult] = await Promise.all([
    supabase.from("apps").select("total_installs, review_count"),
    supabase.from("categories").select("id"),
  ])

  const apps = appsResult.data || []
  const totalApps = apps.length
  const totalInstalls = apps.reduce((sum, app) => sum + (app.total_installs || 0), 0)
  const totalReviews = apps.reduce((sum, app) => sum + (app.review_count || 0), 0)
  const totalCategories = categoriesResult.data?.length || 0

  return { totalApps, totalInstalls, totalReviews, totalCategories }
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  )
}

export default async function HomePage() {
  const [featuredApps, categories, stats] = await Promise.all([
    getFeaturedApps(),
    getCategories(),
    getStats(),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with 3D */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Featured Apps */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Apps</h2>
                <p className="text-muted-foreground mt-2">
                  Hand-picked apps loved by thousands of users
                </p>
              </div>
              <Link 
                href="/featured" 
                className="text-sm font-medium text-primary hover:underline hidden sm:block"
              >
                View all
              </Link>
            </div>
            <Suspense fallback={<LoadingSkeleton />}>
              <FeaturedApps apps={featuredApps} />
            </Suspense>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
                <p className="text-muted-foreground mt-2">
                  Find the perfect tool for your needs
                </p>
              </div>
              <Link 
                href="/categories" 
                className="text-sm font-medium text-primary hover:underline hidden sm:block"
              >
                View all categories
              </Link>
            </div>
            <CategoriesSection categories={categories} />
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
