import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AppCard } from "@/components/apps/app-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

async function searchApps(query: string) {
  if (!query) return []
  
  const supabase = await createClient()
  const { data } = await supabase
    .from("apps")
    .select("*, category:categories(*)")
    .or(`name.ilike.%${query}%,tagline.ilike.%${query}%,description.ilike.%${query}%`)
    .order("average_rating", { ascending: false })
    .limit(20)
  
  return data || []
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const apps = await searchApps(q || "")

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-center mb-6">
              Search Apps
            </h1>
            <form action="/search" method="GET" className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <Input
                  type="text"
                  name="q"
                  placeholder="Search for apps, tools, software..."
                  defaultValue={q}
                  className="pl-10 h-12"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </div>

          {/* Results */}
          {q ? (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {apps.length} {apps.length === 1 ? "result" : "results"} for &quot;{q}&quot;
                </p>
              </div>

              {apps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {apps.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Search className="size-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or browse our categories
                  </p>
                  <Button asChild>
                    <Link href="/categories">Browse Categories</Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Search className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Start your search</h3>
              <p className="text-muted-foreground">
                Type in the search box above to find apps
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
