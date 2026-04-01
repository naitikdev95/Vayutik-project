import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-card">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 glow-sm">
            <Sparkles className="size-6 text-primary" />
          </div>
          <span className="text-2xl font-bold gradient-text">Vayutik</span>
        </Link>

        <Card className="border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center size-16 rounded-full bg-destructive/10 mx-auto mb-4">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-muted-foreground mb-6">
              Something went wrong during authentication. This could be due to an 
              expired link or an invalid session.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/auth/login">Try again</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
