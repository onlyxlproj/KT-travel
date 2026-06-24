'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import { useAuth } from '@/lib/auth-context'
import { isDemoMode, demoTours } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'
import type { CartItem } from '@/lib/types'
import { Trash2, Calendar, Users, Loader2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { user, isDemo } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    if (isDemoMode()) {
      // Demo cart items
      setCartItems([
        {
          id: '1',
          created_at: new Date().toISOString(),
          user_id: 'demo-user-id',
          tour_id: '1',
          tour: demoTours[0],
          start_date: demoTours[0].start_date,
          end_date: demoTours[0].end_date,
          travelers: 2,
        },
      ])
      setLoading(false)
      return
    }

    const fetchCart = async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, tour:tours(*)')
        .eq('user_id', user.id)

      if (!error && data) {
        setCartItems(data)
      }
      setLoading(false)
    }

    fetchCart()
  }, [user])

  const removeItem = async (itemId: string) => {
    if (isDemo) {
      setCartItems(cartItems.filter(item => item.id !== itemId))
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (!error) {
      setCartItems(cartItems.filter(item => item.id !== itemId))
    }
  }

  const updateTravelers = async (itemId: string, travelers: number) => {
    if (isDemo) {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, travelers } : item
      ))
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ travelers })
      .eq('id', itemId)

    if (!error) {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, travelers } : item
      ))
    }
  }

  const handleCheckout = async () => {
    setCheckingOut(true)

    if (isDemo) {
      setTimeout(() => {
        setCheckingOut(false)
        router.push('/dashboard')
      }, 2000)
      return
    }

    // Create bookings from cart items
    const bookings = cartItems.map(item => ({
      user_id: user!.id,
      tour_id: item.tour_id,
      start_date: item.start_date,
      end_date: item.end_date,
      travelers: item.travelers,
      total_price: item.tour!.price * item.travelers,
      status: 'confirmed' as const,
    }))

    const { error: bookingError } = await supabase
      .from('bookings')
      .insert(bookings)

    if (bookingError) {
      alert('Failed to complete checkout')
      setCheckingOut(false)
      return
    }

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user!.id)

    setCheckingOut(false)
    router.push('/dashboard?tab=bookings')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.tour?.price || 0) * item.travelers, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <DemoBanner />
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your cart.</p>
          <Link href="/tours" className="btn-primary">
            Browse Tours
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
              <Link href="/tours" className="btn-primary">
                Browse Tours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="card p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.tour?.image_url || ''}
                        alt={item.tour?.name || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            href={`/tours/${item.tour_id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {item.tour?.name}
                          </Link>
                          <p className="text-gray-500 text-sm">{item.tour?.country}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <select
                            value={item.travelers}
                            onChange={(e) => updateTravelers(item.id, Number(e.target.value))}
                            className="border-none bg-transparent p-0 pr-6 focus:ring-0"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                              <option key={n} value={n}>{n} {n === 1 ? 'traveler' : 'travelers'}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">
                          ₹{item.tour?.price.toLocaleString('en-IN')} x {item.travelers}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{((item.tour?.price || 0) * item.travelers).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxes & Fees (10%)</span>
                      <span>₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg text-gray-900">
                        <span>Total</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
                  >
                    {checkingOut ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By checking out, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
