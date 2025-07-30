export interface JobOpening {
  jobTitle: string
  department: string
  location: string
  employmentType: string
  workArrangement: string
  experienceLevel: string
  keyRequirements: string[]
  jobDescriptionSummary: string
  salaryRange?: string
  applicationDeadline?: string
}

export interface CompanyStats {
  totalEmployees: string
  foundedYear: number
  globalOffices: number
  marketPresence: string
  keyMetrics?: string[]
}

export interface CompanyBenefits {
  workLifeBalance: string[]
  compensation: string[]
  development: string[]
  health: string[]
  culture: string[]
}

export interface PremiumCompany {
  name: string
  industry: string
  description: string
  website: string
  headquarters: string
  founded: number
  employees: string
  specialties: string[]
  cyprusPresence?: string
  companyStats: CompanyStats
  benefits?: CompanyBenefits
  jobOpenings: JobOpening[]
  totalOpenRoles: number
}

export const premiumCompanies: PremiumCompany[] = [
  {
    name: "Mastercard",
    industry: "Financial Services",
    description: "Global technology company in the payments industry connecting consumers, financial institutions, merchants, governments, digital partners, businesses and other organizations worldwide.",
    website: "https://www.mastercard.com",
    headquarters: "Purchase, New York, USA",
    founded: 1966,
    employees: "25,000+",
    specialties: ["Digital Payments", "Financial Technology", "Data Analytics", "Cybersecurity", "AI/ML"],
    cyprusPresence: "Operations in Cyprus supporting European markets",
    companyStats: {
      totalEmployees: "25,000+",
      foundedYear: 1966,
      globalOffices: 200,
      marketPresence: "Global presence in 210+ countries and territories",
      keyMetrics: ["$18+ billion revenue", "2.9 billion cards issued", "190+ currencies supported"]
    },
    benefits: {
      workLifeBalance: ["Flexible work arrangements", "Remote/Hybrid options", "Paid time off"],
      compensation: ["Competitive salary", "Performance bonuses", "Stock options", "Relocation support"],
      development: ["Learning stipend", "Career development programs", "Mentorship", "Conference attendance"],
      health: ["Comprehensive health insurance", "Mental health support", "Wellness programs"],
      culture: ["Inclusive environment", "Innovation-driven", "Global collaboration", "Social impact initiatives"]
    },
    totalOpenRoles: 4,
    jobOpenings: [
      {
        jobTitle: "Software Engineer II",
        department: "Technology",
        location: "Multiple locations (including remote)",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Software development", "Technical solutions", "Incident management", "Cloud technologies", "DevOps"],
        jobDescriptionSummary: "Design, build, and optimize high-performing, highly scalable software solutions using advanced cloud platforms and AI frameworks"
      },
      {
        jobTitle: "Senior Software Engineer",
        department: "Technology",
        location: "Multiple locations (including remote)",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["DevOps", "Microservices", "Full-stack development", "Angular", "Java", "Secure blockchain technologies"],
        jobDescriptionSummary: "Full-stack development with microservices architecture and DevOps practices"
      },
      {
        jobTitle: "Data Scientist - Engineering Focused",
        department: "Analytics & Data Science",
        location: "Multiple locations (including remote)",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Data science", "Machine learning", "Engineering", "Statistical analysis", "Python/R"],
        jobDescriptionSummary: "Engineering-focused data science role working on payments industry solutions"
      },
      {
        jobTitle: "Mastercard Launch Program Graduate",
        department: "Multiple Departments",
        location: "Global (including Cyprus eligible)",
        employmentType: "Full-time",
        workArrangement: "Hybrid",
        experienceLevel: "Entry Level",
        keyRequirements: ["Bachelor's or Master's degree", "Leadership potential", "Cross-functional collaboration"],
        jobDescriptionSummary: "18-month global development program for recent graduates to drive transformative change"
      }
    ]
  },
  {
    name: "JetBrains",
    industry: "Software Development Tools",
    description: "Leading vendor of professional software development tools and integrated development environments (IDEs) for various programming languages and technologies.",
    website: "https://www.jetbrains.com",
    headquarters: "Prague, Czech Republic",
    founded: 2000,
    employees: "2,000+",
    specialties: ["IDEs", "Development Tools", "Code Quality", "Team Collaboration", "Programming Languages"],
    cyprusPresence: "Operations in Cyprus with European development teams",
    companyStats: {
      totalEmployees: "2,000+",
      foundedYear: 2000,
      globalOffices: 10,
      marketPresence: "Used by 15+ million developers worldwide",
      keyMetrics: ["15+ development tools", "300+ programming languages supported", "Fortune 500 companies served"]
    },
    benefits: {
      workLifeBalance: ["Flexible hours", "Remote work options", "Unlimited vacation"],
      compensation: ["Competitive salary", "Stock options", "Performance bonuses"],
      development: ["Learning budget", "Conference attendance", "Internal tech talks", "Open source contributions"],
      health: ["Health insurance", "Gym membership", "Mental health support"],
      culture: ["Developer-centric", "Innovation focus", "Open source friendly", "Technical excellence"]
    },
    totalOpenRoles: 7,
    jobOpenings: [
      {
        jobTitle: "Research Engineer - JetBrains AI",
        department: "AI/Research",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["ML", "PyTorch", "NLP", "distributed training"],
        jobDescriptionSummary: "Training foundation models for coding tasks"
      },
      {
        jobTitle: "Senior Software Developer (DataGrip)",
        department: "Product Development",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Java", "Kotlin", "Database IDE development", "AI integration"],
        jobDescriptionSummary: "Database IDE development with AI integration"
      },
      {
        jobTitle: "Senior QA Engineer (Web Development)",
        department: "Quality Assurance",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["JavaScript", "test automation", "API testing"],
        jobDescriptionSummary: "Quality assurance for web development tools"
      },
      {
        jobTitle: "Kotlin Libraries Senior Developer",
        department: "Product Development",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Kotlin", "Library development"],
        jobDescriptionSummary: "Creating foundational Kotlin libraries"
      },
      {
        jobTitle: "Product Marketing Manager (Data Science)",
        department: "Marketing",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Product marketing", "Data science domain knowledge", "PyCharm"],
        jobDescriptionSummary: "Marketing PyCharm for data science community"
      },
      {
        jobTitle: "Technical Account Manager",
        department: "Customer Success",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Enterprise support", "Client relationship management"],
        jobDescriptionSummary: "Enterprise support and client relationship management"
      },
      {
        jobTitle: "Product Manager (Qodana)",
        department: "Product Management",
        location: "Multiple European cities",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Product management", "Code quality tools"],
        jobDescriptionSummary: "Code quality platform product management"
      }
    ]
  },
  {
    name: "MY.GAMES",
    industry: "Gaming & Entertainment",
    description: "Leading European developer and publisher of mobile, PC and console games with a diverse portfolio of gaming brands and entertainment products.",
    website: "https://my.games",
    headquarters: "Amsterdam, Netherlands",
    founded: 2019,
    employees: "3,000+",
    specialties: ["Game Development", "Mobile Gaming", "PC Gaming", "Game Publishing", "Entertainment Technology"],
    cyprusPresence: "Key operational hub in Cyprus with development teams",
    companyStats: {
      totalEmployees: "3,000+",
      foundedYear: 2019,
      globalOffices: 8,
      marketPresence: "1+ billion registered players worldwide",
      keyMetrics: ["50+ games published", "Global mobile gaming leader", "Multi-platform development"]
    },
    benefits: {
      workLifeBalance: ["Remote work options", "Flexible schedules", "Work-life balance"],
      compensation: ["Competitive salaries", "Performance bonuses", "Equity participation", "Relocation packages"],
      development: ["Game development training", "Tech conferences", "Career growth programs", "Internal mobility"],
      health: ["Health insurance", "Wellness programs", "Mental health support"],
      culture: ["Gaming passionate teams", "Creative freedom", "Innovation-driven", "International environment"]
    },
    totalOpenRoles: 4,
    jobOpenings: [
      {
        jobTitle: "Game Developer (Mobile/PC)",
        department: "Game Development",
        location: "Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["C++", "Unity", "Unreal Engine", "Game Physics", "Mobile Gaming"],
        jobDescriptionSummary: "Develop and support large-scale projects for PC, consoles, or mobile devices using modern technologies",
        salaryRange: "€45,000 - €85,000 (Cyprus market estimate)"
      },
      {
        jobTitle: "Product Manager (Games)",
        department: "Product Management",
        location: "Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Senior",
        keyRequirements: ["Product management", "Gaming industry experience", "Monetization features", "Analytics", "A/B testing"],
        jobDescriptionSummary: "Oversee game development, implement and optimize monetization features for existing and new games",
        salaryRange: "€60,000 - €95,000 (Cyprus market estimate)"
      },
      {
        jobTitle: "Software Engineer (Backend)",
        department: "Engineering",
        location: "Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Backend development", "Distributed systems", "Game server architecture", "Cloud platforms", "Scalability"],
        jobDescriptionSummary: "Build backend infrastructure for games supporting millions of players worldwide",
        salaryRange: "€50,000 - €80,000 (Cyprus market estimate)"
      },
      {
        jobTitle: "Data Analyst (Gaming)",
        department: "Analytics",
        location: "Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Mid",
        keyRequirements: ["Data analysis", "SQL", "Python", "Gaming metrics", "Player behavior analysis", "BI tools"],
        jobDescriptionSummary: "Analyze player behavior, game performance metrics, and monetization data",
        salaryRange: "€40,000 - €65,000 (Cyprus market estimate)"
      }
    ]
  },
  {
    name: "Iron Mountain",
    industry: "Information Management",
    description: "Global leader in innovative storage and information management services, helping organizations lower costs, reduce risks, comply with regulations, and better use their information.",
    website: "https://www.ironmountain.com",
    headquarters: "Boston, Massachusetts, USA",
    founded: 1951,
    employees: "26,000+",
    specialties: ["Data Management", "Cloud Storage", "Information Governance", "Digital Transformation", "Records Management"],
    cyprusPresence: "European operations and data center services",
    companyStats: {
      totalEmployees: "26,000+",
      foundedYear: 1951,
      globalOffices: 220,
      marketPresence: "Operating in 58+ countries worldwide",
      keyMetrics: ["Fortune 500 company", "95% of Fortune 1000 served", "1.7 billion assets under management"]
    },
    benefits: {
      workLifeBalance: ["Flexible work arrangements", "Remote opportunities", "Paid time off"],
      compensation: ["Competitive salary", "Performance incentives", "Retirement plans", "Employee stock purchase"],
      development: ["Career development programs", "Training opportunities", "Tuition reimbursement", "Leadership development"],
      health: ["Comprehensive health coverage", "Dental and vision", "Life insurance", "Employee assistance programs"],
      culture: ["Inclusive workplace", "Environmental stewardship", "Community involvement", "Innovation focus"]
    },
    totalOpenRoles: 5,
    jobOpenings: [
      {
        jobTitle: "Transportation Roles",
        department: "Transportation",
        location: "Multiple US cities (Boston, Dallas, Brooklyn, Edison, Phoenix, Los Angeles)",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Various levels",
        keyRequirements: ["Transportation", "Customer service"],
        jobDescriptionSummary: "Support customer needs by transporting materials"
      },
      {
        jobTitle: "Operations Roles",
        department: "Operations",
        location: "Multiple US cities",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Various levels",
        keyRequirements: ["Operations management", "Process optimization"],
        jobDescriptionSummary: "Operational support and process management"
      },
      {
        jobTitle: "Sales Positions",
        department: "Sales",
        location: "Multiple locations globally",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Various levels",
        keyRequirements: ["Sales experience", "Customer relationship management"],
        jobDescriptionSummary: "Sell more, Win more - global sales focus"
      },
      {
        jobTitle: "Technology Roles",
        department: "Technology",
        location: "Multiple locations",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Various levels",
        keyRequirements: ["IT infrastructure", "Strategic services"],
        jobDescriptionSummary: "Provide strategic infrastructure and services"
      },
      {
        jobTitle: "Data Center Roles",
        department: "Data Center",
        location: "Multiple locations",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Various levels",
        keyRequirements: ["Data center operations", "Outsourcing services"],
        jobDescriptionSummary: "Data center outsourcing and management"
      }
    ]
  },
  {
    name: "Depositphotos",
    industry: "Digital Content & Media",
    description: "Leading stock content marketplace providing millions of high-quality royalty-free images, vectors, videos and editorial content for creative and business needs.",
    website: "https://depositphotos.com",
    headquarters: "New York, USA / Kyiv, Ukraine",
    founded: 2009,
    employees: "1,000+",
    specialties: ["Stock Photography", "Digital Content", "Visual Assets", "Creative Technology", "Content Marketplace"],
    cyprusPresence: "Office in Limassol, Cyprus for European operations",
    companyStats: {
      totalEmployees: "1,000+",
      foundedYear: 2009,
      globalOffices: 6,
      marketPresence: "Serving millions of customers worldwide",
      keyMetrics: ["250+ million files", "40+ million customers", "Multiple content formats"]
    },
    benefits: {
      workLifeBalance: ["Remote/Hybrid work", "Flexible hours", "Work-life balance initiatives"],
      compensation: ["Competitive salaries", "Performance bonuses", "Stock options", "Relocation support"],
      development: ["Professional development", "Tech conferences", "Skills training", "Career growth paths"],
      health: ["Health insurance", "Wellness programs", "Mental health support"],
      culture: ["Creative environment", "International team", "Innovation-focused", "Content-driven"]
    },
    totalOpenRoles: 4,
    jobOpenings: [
      {
        jobTitle: "Software Engineer (Java/Spring)",
        department: "Engineering",
        location: "Limassol, Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Java", "Spring Boot", "Microservices", "RESTful APIs", "Database design"],
        jobDescriptionSummary: "Build and maintain backend services for visual content platform serving millions of users",
        salaryRange: "€45,000 - €75,000"
      },
      {
        jobTitle: "Frontend Developer (JavaScript/React)",
        department: "Engineering",
        location: "Limassol, Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid",
        keyRequirements: ["JavaScript", "React", "TypeScript", "CSS3", "HTML5", "Responsive design"],
        jobDescriptionSummary: "Develop and enhance user interfaces for visual content discovery and licensing platform",
        salaryRange: "€40,000 - €65,000"
      },
      {
        jobTitle: "Product Manager",
        department: "Product Management",
        location: "Limassol, Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["Product management", "User research", "Analytics", "A/B testing", "Media/content industry experience"],
        jobDescriptionSummary: "Drive product strategy and roadmap for visual content platform features and user experience",
        salaryRange: "€55,000 - €85,000"
      },
      {
        jobTitle: "Data Scientist",
        department: "Data & Analytics",
        location: "Limassol, Cyprus/Remote",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Python", "Machine learning", "Computer vision", "SQL", "Statistical analysis", "Content recommendation systems"],
        jobDescriptionSummary: "Develop ML models for content recommendation, search optimization, and user behavior analysis",
        salaryRange: "€50,000 - €80,000"
      }
    ]
  }
]

// Helper function to check if a company is premium
export const isPremiumCompany = (companyName: string): boolean => {
  return premiumCompanies.some(company => company.name === companyName)
}

// Get premium company details
export const getPremiumCompanyDetails = (companyName: string): PremiumCompany | null => {
  return premiumCompanies.find(company => company.name === companyName) || null
}