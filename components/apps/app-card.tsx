"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Download, CheckCircle2 } from "lucide-react"
import type { App } from "@/lib/types"

interface AppCardProps {
  app: App
  featured?: boolean
}

export function AppCard({ app, featured = false }: AppCardProps) {
  const formatInstalls = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getPricingLabel = () => {
    switch (app.pricing_type) {
      case "free":
        return <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Free</Badge>
      case "freemium":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Freemium</Badge>
      case "paid":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">${app.price}</Badge>
      case "subscription":
        return <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">${app.price}/mo</Badge>
      default:
        return null
    }
  }

  return (
    <Link href={`/apps/${app.slug}`}>
      <Card className={`group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${featured ? "glow" : ""}`}>
        {/* Cover image */}
        {featured && app.cover_url && (
          <div className="relative h-32 overflow-hidden">
            <Image
              src={app.cover_url}
              alt={`${app.name} cover`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>
        )}
        
        <CardContent className={`p-4 ${featured ? "-mt-8 relative" : ""}`}>
          <div className="flex gap-3">
            {/* App icon */}
            <div className="relative flex-shrink-0">
              <div className="size-14 rounded-xl overflow-hidden bg-secondary ring-2 ring-background">
                {app.icon_url ? (
                  <Image
                    src={app.icon_url}
                    alt={`${app.name} icon`}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-2xl font-bold text-primary">
                    {app.name.charAt(0)}
                  </div>
                )}
              </div>
              {app.verified && (
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full">
                  <CheckCircle2 className="size-5 text-primary fill-primary/20" />
                </div>
              )}
            </div>

            {/* App info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                {getPricingLabel()}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {app.tagline}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{app.average_rating.toFixed(1)}</span>
                  <span>({app.review_count})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="size-4" />
                  <span>{formatInstalls(app.total_installs)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
