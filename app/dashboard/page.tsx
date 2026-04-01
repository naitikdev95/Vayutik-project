import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppCard } from "@/components/apps/app-card"
import { 
  Package, 
  Star, 
  Download,
  ArrowRight,
  Sparkles
} from "lucide-react"

async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get saved apps
  const { data: savedApps } = await supabase
    .from("saved_apps")
    .select("*, app:apps(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("installed_at", { ascending: false })
    .limit(6)

  // Get user's reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, app:apps(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return {
    user,
    savedApps: savedApps || [],
    reviews: reviews || [],
    profile,
    stats: {
      savedCount: savedApps?.length || 0,
      reviewCount: reviews?.length || 0,
    }
  }
}

export default async function DashboardPage() {
  const { user, savedApps, reviews, profile, stats } = await getDashboardData()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {profile?.full_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your installed apps and reviews
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary">
                    <Package className="size-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.savedCount}</p>
                    <p className="text-sm text-muted-foreground">Installed Apps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-amber-500/10 text-amber-500">
                    <Star className="size-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.reviewCount}</p>
                    <p className="text-sm text-muted-foreground">Reviews Written</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-green-500/10 text-green-500">
                    <Sparkles className="size-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Pro</p>
                    <p className="text-sm text-muted-foreground">Account Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Apps */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Installed Apps</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/apps">
                  View all
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>

            {savedApps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedApps.map((saved: { id: string; app: unknown }) => (
                  <AppCard key={saved.id} app={saved.app as import("@/lib/types").App} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Download className="size-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No apps installed yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring and install apps to see them here
                  </p>
                  <Button asChild>
                    <Link href="/apps">Browse Apps</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Recent Reviews */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Recent Reviews</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/reviews">
                  View all
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: { id: string; rating: number; title: string | null; content: string | null; created_at: string; app: { name: string; slug: string } }) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link 
                            href={`/apps/${review.app.slug}`}
                            className="font-medium hover:text-primary"
                          >
                            {review.app.name}
                          </Link>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`size-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <p className="font-medium mt-2">{review.title}</p>
                      )}
                      {review.content && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {review.content}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="size-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your experience with apps you&apos;ve used
                  </p>
                  <Button asChild>
                    <Link href="/apps">Find Apps to Review</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
