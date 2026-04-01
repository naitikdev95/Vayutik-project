import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AppCard } from "@/components/apps/app-card"
import { Sparkles } from "lucide-react"

async function getFeaturedApps() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("apps")
    .select("*, category:categories(*)")
    .eq("featured", true)
    .order("average_rating", { ascending: false })
  return data || []
}

export default async function FeaturedPage() {
  const apps = await getFeaturedApps()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4 glow">
              <Sparkles className="size-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Featured Apps</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hand-picked apps loved by thousands of users. These are the best of the best, 
              selected by our team for exceptional quality and value.
            </p>
          </div>

          {/* Apps Grid */}
          {apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No featured apps yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
