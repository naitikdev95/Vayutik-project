import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
import type { Category } from "@/lib/types"

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

interface CategoryCardProps {
  category: Category
  appCount?: number
}

export function CategoryCard({ category, appCount }: CategoryCardProps) {
  const IconComponent = category.icon ? iconMap[category.icon] || Zap : Zap

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <IconComponent className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {appCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {appCount} {appCount === 1 ? "app" : "apps"}
                </p>
              )}
            </div>
          </div>
          {category.description && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
