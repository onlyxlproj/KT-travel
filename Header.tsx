'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { Menu, X, User, LogOut, ShoppingCart } from 'lucide-react'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, profile, signOut, isDemo } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const openSignIn = () => {
    setAuthMode('signin')
    setAuthModalOpen(true)
  }

  const openSignUp = () => {
    setAuthMode('signup')
    setAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="Kanakoo Travels" width={36} height={22} className="object-contain" priority />
                <span className="text-xl font-bold text-gray-900">Kanakoo Travels</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/tours" className="nav-link">Tours</Link>
              <Link href="/news" className="nav-link">News</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/contact" className="nav-link">Contact</Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/cart" className="nav-link relative">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 nav-link">
                      <User className="h-5 w-5" />
                      <span>{profile?.first_name || 'Account'}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Profile Settings
                      </Link>
                      {profile?.user_type === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button onClick={openSignIn} className="nav-link">Sign In</button>
                  <button onClick={openSignUp} className="btn-primary">Sign Up</button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="/tours" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Tours</Link>
                <Link href="/news" className="nav-link" onClick={() => setMobileMenuOpen(false)}>News</Link>
                <Link href="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link href="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

                {user ? (
                  <>
                    <Link href="/cart" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
                    <Link href="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Dashboard</Link>
                    <Link href="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                    {profile?.user_type === 'admin' && (
                      <Link href="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                    )}
                    <button onClick={handleSignOut} className="nav-link text-left flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <button onClick={openSignIn} className="btn-secondary">Sign In</button>
                    <button onClick={openSignUp} className="btn-primary">Sign Up</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  )
}
