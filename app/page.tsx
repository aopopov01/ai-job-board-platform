import Link from 'next/link'
import { Button } from '@/components/ui/button'
import NeuronicBackground from '@/components/NeuronicBackground'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen">
      <NeuronicBackground />
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none mb-6">
              <span className="text-gradient block pb-2">
                career lightning
              </span>
              <span className="text-white">
                strikes here
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              AI-powered job board connecting Cyprus&apos;s brightest talent with Tech Island&apos;s most innovative companies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs">
                <Button size="lg" className="text-lg px-8 py-4">
                  Find Jobs
                </Button>
              </Link>
              <Link href="/companies">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Browse Companies
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Featured <span className="text-gradient">Tech Island</span> Companies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Prognosys Solutions",
                industry: "RegTech",
                location: "Nicosia, Cyprus",
                description: "Regulatory Technology Solutions"
              },
              {
                name: "AdTech Holding",
                industry: "Digital Advertising",
                location: "Limassol, Cyprus",
                description: "Digital Advertising Technology"
              },
              {
                name: "3CX Ltd",
                industry: "Unified Communications",
                location: "Nicosia, Cyprus",
                description: "VoIP and Communication Solutions"
              },
              {
                name: "ACHELEC",
                industry: "Audio Visual Technology",
                location: "Limassol, Cyprus",
                description: "Audio Visual Solutions & Marine Audio"
              }
            ].map((company, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                <p className="text-blue-400 mb-2">{company.industry}</p>
                <p className="text-slate-400 mb-3">{company.location}</p>
                <p className="text-sm text-slate-300">{company.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Jobs */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Recent <span className="text-gradient">Opportunities</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Implementation Engineer",
                company: "Prognosys Solutions",
                location: "Nicosia, Cyprus",
                salary: "€35k - €45k",
                type: "Full-time"
              },
              {
                title: "Software Developer",
                company: "3CX Ltd",
                location: "Nicosia, Cyprus",
                salary: "€40k - €55k",
                type: "Full-time"
              },
              {
                title: "Audio Visual Systems Engineer",
                company: "ACHELEC",
                location: "Limassol, Cyprus",
                salary: "€32k - €42k",
                type: "Full-time"
              }
            ].map((job, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                <p className="text-blue-400 mb-2">{job.company}</p>
                <p className="text-slate-400 mb-2">{job.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-semibold">{job.salary}</span>
                  <span className="text-sm text-slate-300">{job.type}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/jobs">
              <Button size="lg">
                View All Jobs
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}