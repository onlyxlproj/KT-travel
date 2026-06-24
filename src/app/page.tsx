'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoBanner from '@/components/DemoBanner'
import TourCard from '@/components/TourCard'
import SearchForm from '@/components/SearchForm'
import { isDemoMode, demoTours, demoTourTypes, demoNews } from '@/lib/demo-data'
import { supabase } from '@/lib/supabase'
import type { Tour, TourType, NewsArticle } from '@/lib/types'
import { Sparkles, Shield, HeartHandshake, ArrowRight, MessageSquare } from 'lucide-react'

export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([])
  const [tourTypes, setTourTypes] = useState<TourType[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode()) {
      setFeaturedTours(demoTours.filter(t => t.featured))
      setTourTypes(demoTourTypes)
      setNews(demoNews.slice(0, 3))
      setLoading(false)
      return
    }

    const fetchData = async () => {
      const [toursRes, typesRes, newsRes] = await Promise.all([
        supabase.from('tours').select('*').eq('featured', true).limit(6),
        supabase.from('tour_types').select('*'),
        supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false }).limit(3),
      ])

      if (toursRes.data) setFeaturedTours(toursRes.data)
      if (typesRes.data) setTourTypes(typesRes.data)
      if (newsRes.data) setNews(newsRes.data)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920"
              alt="Travel hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
                Discover Your Next Adventure
              </h1>
              <p className="text-xl text-gray-200 mb-6 animate-slideUp">
                Explore amazing destinations worldwide with AI-powered recommendations tailored just for you.
              </p>
              <Link
                href="/assistant"
                className="inline-flex items-center space-x-2 btn-accent animate-slideUp"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Ask Gemini for Recommendations</span>
              </Link>
            </div>

            <div className="animate-slideUp">
              <SearchForm variant="hero" />
            </div>
          </div>
        </section>

        {/* Tour Types */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
              Explore by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {tourTypes.map((type) => (
                <Link
                  key={type.id}
                  href={`/tours?type=${type.id}`}
                  className="card p-6 text-center hover:shadow-lg transition-shadow group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <span className="text-2xl">
                      {type.icon === 'umbrella-beach' && '🏖️'}
                      {type.icon === 'mountain' && '🏔️'}
                      {type.icon === 'landmark' && '🏛️'}
                      {type.icon === 'building' && '🏙️'}
                      {type.icon === 'ship' && '🚢'}
                      {type.icon === 'binoculars' && '🦁'}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900">{type.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tours */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Featured Tours</h2>
              <Link href="/tours" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))
              ) : (
                featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-10">
              Why Choose Kanakoo Travels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Recommendations</h3>
                <p className="text-primary-100">
                  Get personalized tour suggestions based on your preferences with our Gemini AI assistant.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Best Price Guarantee</h3>
                <p className="text-primary-100">
                  We match any lower price you find, ensuring you always get the best deal.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <HeartHandshake className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-primary-100">
                  Our dedicated team is available around the clock to assist with your travel needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Travel News</h2>
              <Link href="/news" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                All Articles <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`} className="card group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of happy travelers who found their perfect trip with Kanakoo Travels.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/tours" className="btn-primary py-3 px-8">
                Browse Tours
              </Link>
              <Link href="/assistant" className="btn-outline py-3 px-8">
                Talk to Gemini AI
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
