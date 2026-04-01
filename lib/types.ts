export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  created_at: string
}

export interface App {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  category_id: string | null
  icon_url: string | null
  cover_url: string | null
  screenshots: string[]
  website_url: string | null
  pricing_type: 'free' | 'freemium' | 'paid' | 'subscription'
  price: number | null
  developer_name: string | null
  developer_url: string | null
  featured: boolean
  verified: boolean
  total_installs: number
  average_rating: number
  review_count: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  is_developer: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  app_id: string
  user_id: string
  rating: number
  title: string | null
  content: string | null
  helpful_count: number
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface SavedApp {
  id: string
  user_id: string
  app_id: string
  installed_at: string
  app?: App
}
