'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { useAuth } from '@/lib/auth-context'
import { isDemoMode, demoBookings, demoTours } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'
import type { Booking, Tour } from '@/lib/types'
import {
  Calendar, MapPin, Users, CreditCard,
  Clock, CheckCircle, XCircle, Loader2
} from 'lucide-react'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, loading: authLoading, isDemo } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [wishlist, setWishlist] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bookings')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/')
      return
    }

    if (isDemoMode()) {
      setBookings(demoBookings)
      setWishlist(demoTours.slice(0, 3))
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const [bookingsRes, wishlistRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, tour:tours(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('wishlist')
          .select('*, tour:tours(*)')
          .eq('user_id', user.id),
      ])

      if (bookingsRes.data) setBookings(bookingsRes.data)
      if (wishlistRes.data) setWishlist(wishlistRes.data.map((w: { tour: Tour }) => w.tour))
      setLoading(false)
    }

    fetchData()
  }, [user, authLoading, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  if (authLoading || loading) {
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

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.first_name || 'Traveler'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your bookings and plan your next adventure.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                  <p className="text-gray-500 text-sm">Upcoming Trips</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pastBookings.length}</p>
                  <p className="text-gray-500 text-sm">Past Trips</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                  <p className="text-gray-500 text-sm">Saved Tours</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{bookings.reduce((sum, b) => sum + b.total_price, 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`pb-4 px-1 font-medium ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`pb-4 px-1 font-medium ${
                  activeTab === 'wishlist'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Saved Tours
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'bookings' ? (
            <div className="space-y-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
                  <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
                  <Link href="/tours" className="btn-primary">
                    Browse Tours
                  </Link>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="card p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={booking.tour?.image_url || ''}
                        alt={booking.tour?.name || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            href={`/tours/${booking.tour_id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {booking.tour?.name}
                          </Link>
                          <p className="text-gray-500 text-sm flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.tour?.country}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {booking.travelers} {booking.travelers === 1 ? 'traveler' : 'travelers'}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">
                          Booked on {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{booking.total_price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No saved tours</h2>
                  <p className="text-gray-600 mb-6">Save tours you are interested in for later!</p>
                  <Link href="/tours" className="btn-primary">
                    Browse Tours
                  </Link>
                </div>
              ) : (
                wishlist.map((tour) => (
                  <Link key={tour.id} href={`/tours/${tour.id}`} className="card group hover:shadow-lg transition-shadow">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={tour.image_url}
                        alt={tour.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                        {tour.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{tour.country}</p>
                      <p className="text-lg font-bold text-primary-600 mt-2">
                        ₹{tour.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}
