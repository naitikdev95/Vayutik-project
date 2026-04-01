"use client"

import { AppCard } from "@/components/apps/app-card"
import type { App } from "@/lib/types"
import { motion } from "framer-motion"

interface FeaturedAppsProps {
  apps: App[]
}

export function FeaturedApps({ apps }: FeaturedAppsProps) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured apps yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app, index) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <AppCard app={app} featured />
        </motion.div>
      ))}
    </div>
  )
}
