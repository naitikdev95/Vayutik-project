"use client"

import { motion } from "framer-motion"
import { Package, Download, MessageSquare, FolderOpen } from "lucide-react"

interface StatsSectionProps {
  stats: {
    totalApps: number
    totalInstalls: number
    totalReviews: number
    totalCategories: number
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`
  return num.toString()
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    { 
      label: "Apps Listed", 
      value: formatNumber(stats.totalApps),
      icon: Package,
      description: "Curated software"
    },
    { 
      label: "Total Installs", 
      value: formatNumber(stats.totalInstalls),
      icon: Download,
      description: "Downloads this year"
    },
    { 
      label: "User Reviews", 
      value: formatNumber(stats.totalReviews),
      icon: MessageSquare,
      description: "Honest feedback"
    },
    { 
      label: "Categories", 
      value: stats.totalCategories.toString(),
      icon: FolderOpen,
      description: "Different niches"
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-card/20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                <stat.icon className="size-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
