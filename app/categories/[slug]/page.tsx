import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AppCard } from "@/components/apps/app-card"
import { 
  Zap, 
  Palette, 
  Code, 
  Brain, 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  DollarSign,
  LucideIcon
} from "lucide-react"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Palette,
  Code,
  Brain,
  TrendingUp,
  BarChart3,
  MessageSquare,
  DollarSign,
}

async function getCategory(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()
  return data
}

async function getCategoryApps(categoryId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("apps")
    .select("*, category:categories(*)")
    .eq("category_id", categoryId)
    .order("featured", { ascending: false })
    .order("average_rating", { ascending: false })
  return data || []
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return { title: "Category Not Found" }
  }

  return {
    title: category.name,
    description: category.description || `Browse ${category.name} apps`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    notFound()
  }

  const apps = await getCategoryApps(category.id)
  const IconComponent = category.icon ? iconMap[category.icon] || Zap : Zap

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary">
              <IconComponent className="size-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground mt-1">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {apps.length} {apps.length === 1 ? "app" : "apps"}
              </p>
            </div>
          </div>

          {/* Apps Grid */}
          {apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No apps in this category yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
