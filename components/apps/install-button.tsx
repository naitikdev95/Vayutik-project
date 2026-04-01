"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Download, Check, Loader2 } from "lucide-react"

interface InstallButtonProps {
  appId: string
  isSaved: boolean
}

export function InstallButton({ appId, isSaved: initialSaved }: InstallButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleInstall = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to save apps")
        router.push("/auth/login")
        return
      }

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from("saved_apps")
          .delete()
          .eq("app_id", appId)
          .eq("user_id", user.id)

        if (error) throw error

        setIsSaved(false)
        toast.success("App removed from your collection")
      } else {
        // Add to saved
        const { error } = await supabase
          .from("saved_apps")
          .insert({
            app_id: appId,
            user_id: user.id,
          })

        if (error) throw error

        setIsSaved(true)
        toast.success("App added to your collection!")
      }

      router.refresh()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleInstall} 
      disabled={loading}
      className={`w-full ${isSaved ? "" : "glow-sm"}`}
      variant={isSaved ? "outline" : "default"}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 mr-2 animate-spin" />
          {isSaved ? "Removing..." : "Installing..."}
        </>
      ) : isSaved ? (
        <>
          <Check className="size-4 mr-2" />
          Installed
        </>
      ) : (
        <>
          <Download className="size-4 mr-2" />
          Install App
        </>
      )}
    </Button>
  )
}
