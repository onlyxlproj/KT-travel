export interface Profile {
  id: string
  created_at: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  phone: string | null
  user_type: 'user' | 'admin'
}

export interface TourType {
  id: string
  name: string
  image_url: string | null
  icon: string | null
}

export interface Tour {
  id: string
  created_at: string
  name: string
  description: string
  country: string
  price: number
  start_date: string
  end_date: string
  image_url: string
  gallery: string[]
  rating: number
  tour_type_id: string
  tour_type?: TourType
  creator_id: string
  featured: boolean
  provider_name: string | null
  provider_link: string | null
}

export interface Booking {
  id: string
  created_at: string
  user_id: string
  tour_id: string
  tour?: Tour
  start_date: string
  end_date: string
  travelers: number
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

export interface CartItem {
  id: string
  created_at: string
  user_id: string
  tour_id: string
  tour?: Tour
  start_date: string
  end_date: string
  travelers: number
}

export interface NewsArticle {
  id: string
  created_at: string
  title: string
  content: string
  excerpt: string
  image_url: string
  author_id: string
  published: boolean
}

export interface Feedback {
  id: string
  created_at: string
  name: string
  email: string
  message: string
  read: boolean
}
