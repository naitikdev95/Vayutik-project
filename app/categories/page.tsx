import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CategoryCard } from "@/components/categories/category-card"

async function getCategoriesWithCounts() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (!categories) return []

  // Get app counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from("apps")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      
      return { ...category, appCount: count || 0 }
    })
  )

  return categoriesWithCounts
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-2">
              Browse apps by category to find exactly what you need
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                appCount={category.appCount}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
