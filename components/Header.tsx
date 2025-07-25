'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="relative z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="text-gradient">Job Board</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/jobs" className="text-white/80 hover:text-white transition-colors font-medium">
              Jobs
            </Link>
            <Link href="/companies" className="text-white/80 hover:text-white transition-colors font-medium">
              Companies
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}