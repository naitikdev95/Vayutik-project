"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp } from "lucide-react"
import type { Review } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ReviewsListProps {
  reviews: Review[]
  appId: string
}

function ReviewCard({ review }: { review: Review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)
  const [hasVoted, setHasVoted] = useState(false)
  const supabase = createClient()

  const handleHelpful = async () => {
    if (hasVoted) return

    const { error } = await supabase
      .from("reviews")
      .update({ helpful_count: helpfulCount + 1 })
      .eq("id", review.id)

    if (error) {
      toast.error("Failed to mark as helpful")
      return
    }

    setHelpfulCount(prev => prev + 1)
    setHasVoted(true)
    toast.success("Thanks for your feedback!")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="size-10">
            <AvatarImage src={review.profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {review.profile?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">
                  {review.profile?.full_name || "Anonymous"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {review.title && (
              <h4 className="font-semibold mb-1">{review.title}</h4>
            )}
            {review.content && (
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                {review.content}
              </p>
            )}

            <Button
              variant="ghost"
              size="sm"
              className={`mt-3 text-muted-foreground ${hasVoted ? "text-primary" : ""}`}
              onClick={handleHelpful}
              disabled={hasVoted}
            >
              <ThumbsUp className="size-4 mr-1" />
              Helpful ({helpfulCount})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReviewsList({ reviews, appId }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Star className="size-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            Be the first to share your experience with this app
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
