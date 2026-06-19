import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image src="/logo.png" alt="Kanakoo Travels" width={36} height={22} className="object-contain" />
              <span className="text-xl font-bold">Kanakoo Travels</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              An AI-powered travel hub. We help travelers find the best affordable tours and experiences, then connect them with trusted vendors to book.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tours" className="text-gray-400 hover:text-white transition-colors">
                  All Tours
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  Travel News
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Tour Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tour Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tours?type=beach" className="text-gray-400 hover:text-white transition-colors">
                  Beach & Resort
                </Link>
              </li>
              <li>
                <Link href="/tours?type=adventure" className="text-gray-400 hover:text-white transition-colors">
                  Adventure
                </Link>
              </li>
              <li>
                <Link href="/tours?type=cultural" className="text-gray-400 hover:text-white transition-colors">
                  Cultural
                </Link>
              </li>
              <li>
                <Link href="/tours?type=cruise" className="text-gray-400 hover:text-white transition-colors">
                  Cruise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+91 9307 996 449</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>kanakootravels@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <span>9 AM - 9 PM, Daily</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Kanakoo Travels. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
