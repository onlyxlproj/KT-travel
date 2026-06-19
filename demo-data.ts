import type { Tour, TourType, NewsArticle, Booking, Profile } from './types'

export const isDemoMode = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !supabaseUrl || supabaseUrl === '' || supabaseUrl.includes('placeholder')
}

export const demoUser = {
  id: 'demo-user-id',
  email: 'demo@kanakootravels.com',
  created_at: new Date().toISOString(),
}

export const demoProfile: Profile = {
  id: 'demo-user-id',
  created_at: new Date().toISOString(),
  email: 'demo@kanakootravels.com',
  first_name: 'Demo',
  last_name: 'Traveler',
  avatar_url: null,
  phone: '+91 9307 996 449',
  user_type: 'user',
}

export const demoTourTypes: TourType[] = [
  { id: '1', name: 'Beach & Resort', image_url: null, icon: 'umbrella-beach' },
  { id: '2', name: 'Adventure', image_url: null, icon: 'mountain' },
  { id: '3', name: 'Cultural', image_url: null, icon: 'landmark' },
  { id: '4', name: 'City Break', image_url: null, icon: 'building' },
  { id: '5', name: 'Cruise', image_url: null, icon: 'ship' },
  { id: '6', name: 'Safari', image_url: null, icon: 'binoculars' },
]

export const demoTours: Tour[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'Tropical Paradise Bali',
    description: 'Experience the magic of Bali with pristine beaches, ancient temples, and lush rice terraces. This 7-day tour includes visits to Ubud, Seminyak, and the famous Tanah Lot temple.',
    country: 'Indonesia',
    price: 1299,
    start_date: '2024-04-15',
    end_date: '2024-04-22',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    gallery: [],
    rating: 4.8,
    tour_type_id: '1',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'Swiss Alps Adventure',
    description: 'Conquer the majestic Swiss Alps with guided hikes, cable car rides, and breathtaking mountain views. Perfect for adventure seekers and nature lovers.',
    country: 'Switzerland',
    price: 2499,
    start_date: '2024-05-01',
    end_date: '2024-05-08',
    image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    gallery: [],
    rating: 4.9,
    tour_type_id: '2',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    name: 'Ancient Rome Explorer',
    description: 'Walk through history in the Eternal City. Visit the Colosseum, Vatican City, and enjoy authentic Italian cuisine on this cultural journey.',
    country: 'Italy',
    price: 1899,
    start_date: '2024-04-20',
    end_date: '2024-04-27',
    image_url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    gallery: [],
    rating: 4.7,
    tour_type_id: '3',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    name: 'Tokyo City Lights',
    description: 'Discover the perfect blend of tradition and innovation in Tokyo. From ancient shrines to neon-lit streets, experience Japan like never before.',
    country: 'Japan',
    price: 2199,
    start_date: '2024-05-10',
    end_date: '2024-05-17',
    image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    gallery: [],
    rating: 4.8,
    tour_type_id: '4',
    creator_id: 'admin',
    featured: false,
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    name: 'Caribbean Dream Cruise',
    description: 'Sail through crystal-clear waters visiting multiple Caribbean islands. All-inclusive dining, entertainment, and island excursions included.',
    country: 'Caribbean',
    price: 3499,
    start_date: '2024-06-01',
    end_date: '2024-06-10',
    image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800',
    gallery: [],
    rating: 4.6,
    tour_type_id: '5',
    creator_id: 'admin',
    featured: false,
  },
  {
    id: '6',
    created_at: new Date().toISOString(),
    name: 'African Safari Experience',
    description: 'Witness the Big Five in their natural habitat. This luxury safari includes game drives, bush walks, and stays in premium lodges.',
    country: 'Kenya',
    price: 4299,
    start_date: '2024-07-15',
    end_date: '2024-07-24',
    image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    gallery: [],
    rating: 4.9,
    tour_type_id: '6',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '7',
    created_at: new Date().toISOString(),
    name: 'Maldives Luxury Escape',
    description: 'Indulge in paradise with overwater villas, private beaches, and world-class spa treatments in the Maldives.',
    country: 'Maldives',
    price: 5999,
    start_date: '2024-05-20',
    end_date: '2024-05-27',
    image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    gallery: [],
    rating: 5.0,
    tour_type_id: '1',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '8',
    created_at: new Date().toISOString(),
    name: 'Patagonia Trekking',
    description: 'Challenge yourself with world-class trekking in Patagonia. Witness glaciers, mountains, and untouched wilderness.',
    country: 'Argentina',
    price: 2899,
    start_date: '2024-08-01',
    end_date: '2024-08-10',
    image_url: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800',
    gallery: [],
    rating: 4.7,
    tour_type_id: '2',
    creator_id: 'admin',
    featured: false,
  },
  // Real, affordable, currently bookable tours (researched market pricing, 2026)
  {
    id: '9',
    created_at: new Date().toISOString(),
    name: 'Bali Budget Explorer',
    description: 'An affordable Bali group tour covering Ubud rice terraces, Tanah Lot temple, and Seminyak beach clubs. Great value with shared transport and handpicked stays, ideal for first-time visitors to Indonesia.',
    country: 'Indonesia',
    price: 650,
    start_date: '2026-09-10',
    end_date: '2026-09-16',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    gallery: [],
    rating: 4.6,
    tour_type_id: '1',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '10',
    created_at: new Date().toISOString(),
    name: 'Vietnam Discovery: Hanoi to Ho Chi Minh',
    description: 'A budget-friendly 7-day journey through Vietnam covering Hanoi\'s old quarter, Halong Bay, and Ho Chi Minh City. Vietnam consistently ranks as one of the most affordable Southeast Asia destinations.',
    country: 'Vietnam',
    price: 600,
    start_date: '2026-11-05',
    end_date: '2026-11-12',
    image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    gallery: [],
    rating: 4.5,
    tour_type_id: '3',
    creator_id: 'admin',
    featured: true,
  },
  {
    id: '11',
    created_at: new Date().toISOString(),
    name: 'Thailand Highlights: Bangkok & Islands',
    description: 'Explore Bangkok\'s temples and markets before island-hopping with snorkeling stops around Phi Phi. A well-rounded, affordable introduction to Thailand.',
    country: 'Thailand',
    price: 720,
    start_date: '2026-10-20',
    end_date: '2026-10-28',
    image_url: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    gallery: [],
    rating: 4.6,
    tour_type_id: '1',
    creator_id: 'admin',
    featured: false,
  },
]

export const demoNews: NewsArticle[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    title: 'Top 10 Destinations for 2026',
    content: 'Discover the most exciting travel destinations for 2026. From hidden gems to classic favorites, we have curated a list that will inspire your next adventure.',
    excerpt: 'Discover the most exciting travel destinations for 2026.',
    image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    author_id: 'admin',
    published: true,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    title: 'Travel Tips: How to Pack Light',
    content: 'Master the art of minimalist travel with our expert packing tips. Learn how to fit everything you need in a carry-on bag.',
    excerpt: 'Master the art of minimalist travel with our expert packing tips.',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    author_id: 'admin',
    published: true,
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    title: 'Best Budget-Friendly Beach Destinations',
    content: 'You do not need to break the bank for a beach vacation. Here are our top picks for affordable beach destinations around the world.',
    excerpt: 'Affordable beach destinations that will not break the bank.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    author_id: 'admin',
    published: true,
  },
]

export const demoBookings: Booking[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    user_id: 'demo-user-id',
    tour_id: '1',
    tour: demoTours[0],
    start_date: '2024-04-15',
    end_date: '2024-04-22',
    travelers: 2,
    total_price: 2598,
    status: 'confirmed',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    user_id: 'demo-user-id',
    tour_id: '3',
    tour: demoTours[2],
    start_date: '2024-03-10',
    end_date: '2024-03-17',
    travelers: 1,
    total_price: 1899,
    status: 'completed',
  },
]

export const getDemoClaudeResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('where')) {
    return `**Travel Recommendations**

Based on popular trends, here are my top suggestions:

1. **Bali, Indonesia** - Perfect for beach lovers and culture enthusiasts, and very affordable
2. **Vietnam** - Budget-friendly with incredible food and scenery
3. **Thailand** - Best mix of culture, beaches, and value for money

Would you like more details about any of these destinations?

*This is a demo response. Connect your Anthropic API key for personalized AI recommendations.*`
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('afford')) {
    return `**Budget Travel Tips**

Here are ways to save on your next trip:

- Travel during shoulder season (April-May, September-October)
- Book flights on Tuesdays for better deals
- Consider all-inclusive packages for predictable costs
- Look for tours that include meals and transfers

Our Bali, Vietnam, and Thailand tours offer the best value right now!

*This is a demo response. Connect your Anthropic API key for personalized advice.*`
  }

  if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
    return `**Family-Friendly Destinations**

Great options for traveling with family:

- **Beach Resorts** - Kids-friendly activities and safe swimming
- **City Tours** - Educational experiences for all ages
- **Cruises** - Entertainment for everyone on board

I recommend our Bali Budget Explorer tour - it is perfect for families!

*This is a demo response. Connect your Anthropic API key for personalized recommendations.*`
  }

  return `Hello! I'm your AI travel assistant. I can help you with:

- **Destination recommendations** based on your interests
- **Trip planning** and itinerary suggestions
- **Budget optimization** tips
- **Travel advice** for any destination

Try asking me "Where should I travel for adventure?" or "Suggest a budget-friendly beach destination!"

*Currently in demo mode. Add your ANTHROPIC_API_KEY in Vercel to enable full AI capabilities.*`
}
