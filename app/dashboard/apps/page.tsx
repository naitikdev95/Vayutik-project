import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AppCard } from "@/components/apps/app-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download } from "lucide-react"
import type { App } from "@/lib/types"

async function getSavedApps() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data } = await supabase
    .from("saved_apps")
    .select("*, app:apps(*, category:categories(*))")
    .eq("user_id", user.id)
    .order("installed_at", { ascending: false })

  return data || []
}

export default async function DashboardAppsPage() {
  const savedApps = await getSavedApps()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Your Installed Apps</h1>
            <p className="text-muted-foreground mt-2">
              Manage all the apps you&apos;ve installed
            </p>
          </div>

          {/* Apps Grid */}
          {savedApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedApps.map((saved: { id: string; app: App }) => (
                <AppCard key={saved.id} app={saved.app} />
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
