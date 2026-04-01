import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InstallButton } from "@/components/apps/install-button"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { WriteReviewButton } from "@/components/reviews/write-review-button"
import { 
  Star, 
  Download, 
  ExternalLink, 
  CheckCircle2,
  Calendar,
  Building2
} from "lucide-react"
import type { App, Review } from "@/lib/types"

interface AppPageProps {
  params: Promise<{ slug: string }>
}

async function getApp(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("apps")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single()
  return data as App | null
}

async function getReviews(appId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("reviews")
    .select("*, profile:profiles(*)")
    .eq("app_id", appId)
    .order("created_at", { ascending: false })
    .limit(10)
  return (data || []) as Review[]
}

async function checkIfSaved(appId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  
  const { data } = await supabase
    .from("saved_apps")
    .select("id")
    .eq("app_id", appId)
    .eq("user_id", user.id)
    .single()
  
  return !!data
}

function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

function getPricingLabel(app: App) {
  switch (app.pricing_type) {
    case "free":
      return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Free</Badge>
    case "freemium":
      return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Freemium</Badge>
    case "paid":
      return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">${app.price}</Badge>
    case "subscription":
      return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">${app.price}/mo</Badge>
    default:
      return null
  }
}

export async function generateMetadata({ params }: AppPageProps) {
  const { slug } = await params
  const app = await getApp(slug)
  
  if (!app) {
    return { title: "App Not Found" }
  }

  return {
    title: app.name,
    description: app.tagline,
  }
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = await params
  const app = await getApp(slug)
  
  if (!app) {
    notFound()
  }

  const [reviews, isSaved] = await Promise.all([
    getReviews(app.id),
    checkIfSaved(app.id),
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero section */}
          {app.cover_url && (
            <div className="relative h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              <Image
                src={app.cover_url}
                alt={`${app.name} cover`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* App header */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="size-20 sm:size-24 rounded-2xl overflow-hidden bg-card ring-2 ring-border">
                    {app.icon_url ? (
                      <Image
                        src={app.icon_url}
                        alt={`${app.name} icon`}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-3xl font-bold text-primary bg-primary/10">
                        {app.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {app.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      <CheckCircle2 className="size-6 text-primary fill-primary/20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">{app.name}</h1>
                    {getPricingLabel(app)}
                  </div>
                  <p className="text-lg text-muted-foreground mb-3">{app.tagline}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{app.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({app.review_count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="size-4" />
                      <span>{formatNumber(app.total_installs)} installs</span>
                    </div>
                    {app.category && (
                      <Link 
                        href={`/categories/${app.category.slug}`}
                        className="text-primary hover:underline"
                      >
                        {app.category.name}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div className="prose prose-invert max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{app.description}</p>
              </div>

              {/* Screenshots */}
              {app.screenshots && app.screenshots.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {app.screenshots.map((screenshot, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 relative w-72 h-44 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={screenshot}
                          alt={`${app.name} screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <WriteReviewButton appId={app.id} appName={app.name} />
                </div>
                <ReviewsList reviews={reviews} appId={app.id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6">
                    <InstallButton appId={app.id} isSaved={isSaved} />
                    
                    {app.website_url && (
                      <Button variant="outline" className="w-full mt-3" asChild>
                        <a href={app.website_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-base">Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <dl className="space-y-4 text-sm">
                      {app.developer_name && (
                        <div className="flex items-center gap-3">
                          <Building2 className="size-4 text-muted-foreground" />
                          <div>
                            <dt className="text-muted-foreground">Developer</dt>
                            <dd className="font-medium">{app.developer_name}</dd>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Calendar className="size-4 text-muted-foreground" />
                        <div>
                          <dt className="text-muted-foreground">Added</dt>
                          <dd className="font-medium">
                            {new Date(app.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
