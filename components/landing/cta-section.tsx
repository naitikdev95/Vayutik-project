"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-6 glow">
            <Rocket className="size-8" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-balance">
              Ready to Discover Your Next{" "}
              <span className="gradient-text">Favorite Tool?</span>
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Join thousands of professionals who use Vayutik to find, compare, and 
            manage the best software for their workflow. Create your free account today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="glow min-w-[200px]">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[200px]">
              <Link href="/apps">
                Explore Apps
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Free forever for individuals.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
