'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { useAuth } from '@/lib/auth-context'
import { isDemoMode, demoTours } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'
import type { Tour } from '@/lib/types'
import {
  MapPin, Star, Calendar, Users, Clock, Check,
  ChevronLeft, ShoppingCart, Heart, Share2, Loader2
} from 'lucide-react'

export default function TourDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isDemo } = useAuth()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [travelers, setTravelers] = useState(2)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (isDemoMode()) {
      const found = demoTours.find(t => t.id === params.id)
      setTour(found || null)
      setLoading(false)
      return
    }

    const fetchTour = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*, tour_type:tour_types(*)')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setTour(data)
      }
      setLoading(false)
    }

    fetchTour()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to cart')
      return
    }

    setAddingToCart(true)

    if (isDemo) {
      setTimeout(() => {
        setAddingToCart(false)
        router.push('/cart')
      }, 1000)
      return
    }

    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      tour_id: tour!.id,
      travelers,
      start_date: tour!.start_date,
      end_date: tour!.end_date,
    })

    setAddingToCart(false)

    if (error) {
      alert('Failed to add to cart')
    } else {
      router.push('/cart')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return `${days} days / ${days - 1} nights`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <Link href="/tours" className="btn-primary">
            Browse Tours
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const totalPrice = tour.price * travelers

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/tours" className="flex items-center text-primary-600 hover:text-primary-700">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Tours
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-[400px] md:h-[500px]">
          <Image
            src={tour.image_url}
            alt={tour.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-3 mb-3">
                {tour.featured && (
                  <span className="bg-accent-500 text-white text-sm font-medium px-3 py-1 rounded">
                    Featured
                  </span>
                )}
                <span className="bg-white/90 text-gray-900 text-sm font-medium px-3 py-1 rounded flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                  {tour.rating.toFixed(1)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tour.name}</h1>
              <div className="flex items-center text-white/90">
                <MapPin className="h-5 w-5 mr-2" />
                {tour.country}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="card p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold text-gray-900">{new Date(tour.start_date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold text-gray-900">{new Date(tour.end_date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">{getDuration(tour.start_date, tour.end_date)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto text-primary-600 mb-2" />
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-semibold text-gray-900">Max 20</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </div>

              {/* Highlights */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Expert local guides</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">All transportation included</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Handpicked accommodations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Daily breakfast included</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Small group experience</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">24/7 support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm">Starting from</p>
                  <p className="text-3xl font-bold text-gray-900">₹{tour.price.toLocaleString('en-IN')}</p>
                  <p className="text-gray-500 text-sm">per person</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Travelers
                    </label>
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-gray-600 mb-2">
                      <span>₹{tour.price.toLocaleString('en-IN')} x {travelers}</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
                  >
                    {addingToCart ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <div className="flex space-x-2">
                    <button className="flex-1 btn-outline py-2 flex items-center justify-center space-x-2">
                      <Heart className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button className="flex-1 btn-outline py-2 flex items-center justify-center space-x-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Talk to our AI travel assistant for personalized recommendations.
                  </p>
                  <Link href="/assistant" className="btn-accent w-full py-2 flex items-center justify-center">
                    Ask Gemini AI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}