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

export interface VerifiedCompany {
  name: string
  industry: string
  description: string
  website: string
  headquarters: string
  founded: number
  employees: string
  specialties: string[]
  cyprusOperations?: string
  companyStats: CompanyStats
  benefits?: CompanyBenefits
  jobOpenings: JobOpening[]
  totalOpenRoles: number
}

export const verifiedCompanies: VerifiedCompany[] = [
  {
    name: "CPM",
    industry: "Consulting/Professional Services",
    description: "Professional services company offering comprehensive legal, accounting, and banking administration services to businesses across Cyprus.",
    website: "https://cpm.com.cy",
    headquarters: "Nicosia, Cyprus",
    founded: 2010,
    employees: "50-200",
    specialties: ["Legal Administration", "Accounting Services", "Banking Administration", "Corporate Services", "Compliance"],
    cyprusOperations: "Main offices in Nicosia, Limassol, and Larnaca",
    companyStats: {
      totalEmployees: "50-200",
      foundedYear: 2010,
      globalOffices: 3,
      marketPresence: "Leading professional services provider in Cyprus",
      keyMetrics: ["Multi-location presence", "Comprehensive service portfolio", "Local market expertise"]
    },
    benefits: {
      workLifeBalance: ["Flexible working hours", "Work-life balance support", "Local office locations"],
      compensation: ["Competitive salaries", "Performance-based incentives", "Professional development support"],
      development: ["Professional training", "Career advancement opportunities", "Skills development programs"],
      health: ["Health insurance coverage", "Employee wellness programs"],
      culture: ["Professional environment", "Team collaboration", "Client-focused approach", "Local expertise"]
    },
    totalOpenRoles: 4,
    jobOpenings: [
      {
        jobTitle: "Junior Legal Administrator",
        department: "Legal",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["Legal administration", "Administrative skills", "Timely completion of tasks"],
        jobDescriptionSummary: "Complete administration work in a timely manner"
      },
      {
        jobTitle: "Junior Accountant",
        department: "Accounting",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["Accounting", "Client portfolio management", "Financial record keeping"],
        jobDescriptionSummary: "Organize and complete the accounting work for the clientele portfolio"
      },
      {
        jobTitle: "Junior Banking Administrator",
        department: "Banking",
        location: "Larnaca, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["Banking administration", "Financial services", "Administrative skills"],
        jobDescriptionSummary: "Organize and complete the banking related work"
      },
      {
        jobTitle: "Legal Administrator",
        department: "Legal",
        location: "Limassol, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Mid",
        keyRequirements: ["Legal administration", "Client service", "Administrative expertise"],
        jobDescriptionSummary: "Handle legal administration tasks and client service responsibilities"
      }
    ]
  },
  {
    name: "JCC Payment Systems Ltd",
    industry: "Financial Services",
    description: "Leading payment systems company in Cyprus providing card issuing, payment processing, and innovative financial technology solutions.",
    website: "https://www.jcc.com.cy",
    headquarters: "Nicosia, Cyprus",
    founded: 1989,
    employees: "200-500",
    specialties: ["Payment Processing", "Card Issuing", "FinTech Solutions", "Digital Payments", "Financial Technology"],
    cyprusOperations: "Headquarters in Nicosia with nationwide service coverage",
    companyStats: {
      totalEmployees: "200-500",
      foundedYear: 1989,
      globalOffices: 1,
      marketPresence: "Leading payment systems provider in Cyprus",
      keyMetrics: ["35+ years in business", "Nationwide coverage", "Financial technology innovation"]
    },
    benefits: {
      workLifeBalance: ["Professional work environment", "Team collaboration", "Work-life balance"],
      compensation: ["Competitive salaries", "Performance incentives", "Career growth opportunities"],
      development: ["Technical training", "Professional development", "Industry certifications", "Skills advancement"],
      health: ["Health insurance", "Employee wellness programs", "Life insurance"],
      culture: ["Innovation-driven", "Technology focus", "Team-oriented", "Financial services expertise"]
    },
    totalOpenRoles: 9,
    jobOpenings: [
      {
        jobTitle: "Card Issuing Technical Analyst (Senior)",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["Computer Science degree", "SQL/PL-SQL", "4+ years experience", "Analytical skills"],
        jobDescriptionSummary: "Senior technical analysis for card issuing systems and processes"
      },
      {
        jobTitle: "Card Issuing Technical Analyst (Entry Level)",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Entry Level",
        keyRequirements: ["Computer Science degree", "SQL/PL-SQL", "Entry-level acceptable", "Analytical skills"],
        jobDescriptionSummary: "Entry-level technical analysis for card issuing systems"
      },
      {
        jobTitle: "Software Support Engineer",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Mid",
        keyRequirements: ["Computer Science degree", "Web services", "API integration", "Linux", "Database skills"],
        jobDescriptionSummary: "Provide software support and maintain system integrations"
      },
      {
        jobTitle: "Systems Engineer (Core Systems)",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Mid",
        keyRequirements: ["IT degree", "Operating systems expertise", "Core systems", "Analytical skills"],
        jobDescriptionSummary: "Manage and maintain core payment systems infrastructure"
      },
      {
        jobTitle: "Systems Engineer (Servers, Automation and Azure)",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Mid",
        keyRequirements: ["IT degree", "Server administration", "Azure", "Automation", "Analytical skills"],
        jobDescriptionSummary: "Server management, automation, and Azure cloud services"
      },
      {
        jobTitle: "Database Administrator (Senior)",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["Computer Science/Engineering degree", "SQL", "5+ years experience", "Problem-solving"],
        jobDescriptionSummary: "Senior database administration and optimization"
      },
      {
        jobTitle: "Database Administrator (Junior)",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["Computer Science/Engineering degree", "SQL", "1+ years experience", "Problem-solving"],
        jobDescriptionSummary: "Junior database administration and support"
      },
      {
        jobTitle: "Head of Information Technology",
        department: "Technology",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Executive",
        keyRequirements: ["Computer Science degree", "Master's preferred", "10+ years IT Financial Sector experience"],
        jobDescriptionSummary: "Lead IT strategy and operations for financial services technology"
      },
      {
        jobTitle: "Legal Advisor",
        department: "Legal",
        location: "Nicosia, Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Law degree", "Cyprus Bar exam", "3-5 years post-qualification experience"],
        jobDescriptionSummary: "Provide legal advisory services for payment systems operations"
      }
    ]
  },
  {
    name: "Cyta",
    industry: "Telecommunications",
    description: "Cyprus's leading telecommunications provider offering comprehensive digital services, internet, mobile, and enterprise solutions.",
    website: "https://www.cyta.com.cy",
    headquarters: "Nicosia, Cyprus",
    founded: 1961,
    employees: "2,000+",
    specialties: ["Telecommunications", "Digital Services", "Internet Infrastructure", "Mobile Networks", "Enterprise Solutions"],
    cyprusOperations: "Nationwide telecommunications infrastructure and services",
    companyStats: {
      totalEmployees: "2,000+",
      foundedYear: 1961,
      globalOffices: 1,
      marketPresence: "Leading telecommunications provider in Cyprus",
      keyMetrics: ["Nationwide coverage", "60+ years of operation", "Digital transformation leader"]
    },
    totalOpenRoles: 0,
    jobOpenings: []
  },
  {
    name: "ECOMMPAY",
    industry: "Financial Technology",
    description: "Global payment service provider offering comprehensive payment processing solutions and financial technology services for businesses worldwide.",
    website: "https://ecommpay.com",
    headquarters: "London, UK",
    founded: 2016,
    employees: "500-1000",
    specialties: ["Payment Processing", "Financial Technology", "Risk Management", "Payment Gateway", "Alternative Payments"],
    cyprusOperations: "European operations center with tech development teams",
    companyStats: {
      totalEmployees: "500-1000",
      foundedYear: 2016,
      globalOffices: 5,
      marketPresence: "Global payment service provider",
      keyMetrics: ["Multi-jurisdiction operations", "Alternative payment solutions", "Global reach"]
    },
    totalOpenRoles: 0,
    jobOpenings: []
  },
  {
    name: "INKTECH",
    industry: "Software Development",
    description: "Innovative software development company specializing in custom solutions, mobile applications, and digital transformation services.",
    website: "https://inktech.com.cy",
    headquarters: "Limassol, Cyprus",
    founded: 2015,
    employees: "100-300",
    specialties: ["Custom Software Development", "Mobile App Development", "Web Development", "Digital Transformation", "Tech Consulting"],
    cyprusOperations: "Main development center in Limassol",
    companyStats: {
      totalEmployees: "100-300",
      foundedYear: 2015,
      globalOffices: 1,
      marketPresence: "Cyprus-based software development specialist",
      keyMetrics: ["Custom solutions focus", "Digital transformation expertise", "Mobile-first approach"]
    },
    totalOpenRoles: 0,
    jobOpenings: []
  },
  {
    name: "H.S Data Ltd",
    industry: "Data & Analytics",
    description: "Data management and analytics company providing comprehensive data solutions, business intelligence, and analytics services.",
    website: "https://hsdata.com.cy",
    headquarters: "Nicosia, Cyprus",
    founded: 2012,
    employees: "50-150",
    specialties: ["Data Analytics", "Business Intelligence", "Data Management", "Data Science", "Database Solutions"],
    cyprusOperations: "Data processing and analytics center in Nicosia",
    companyStats: {
      totalEmployees: "50-150",
      foundedYear: 2012,
      globalOffices: 1,
      marketPresence: "Leading data analytics provider in Cyprus",
      keyMetrics: ["Business intelligence expertise", "Data science capabilities", "Database solutions"]
    },
    totalOpenRoles: 0,
    jobOpenings: []
  },
  {
    name: "DC Sport Soft",
    industry: "Sports Technology",
    description: "Sports technology company developing innovative software solutions for sports management, analytics, and digital sports platforms.",
    website: "https://dcsportsoft.com",
    headquarters: "Limassol, Cyprus",
    founded: 2018,
    employees: "30-100",
    specialties: ["Sports Software", "Sports Analytics", "Digital Platforms", "Sports Management", "Gaming Technology"],
    cyprusOperations: "Development and operations center in Limassol",
    companyStats: {
      totalEmployees: "30-100",
      foundedYear: 2018,
      globalOffices: 1,
      marketPresence: "Specialized sports technology solutions provider",
      keyMetrics: ["Sports management focus", "Analytics specialization", "Gaming technology integration"]
    },
    totalOpenRoles: 0,
    jobOpenings: []
  },
  {
    name: "Quadcode",
    industry: "Financial Technology",
    description: "International fintech company providing trading platforms, investment solutions, and financial technology services to global markets.",
    website: "https://quadcode.com",
    headquarters: "Limassol, Cyprus",
    founded: 2009,
    employees: "1,000+",
    specialties: ["Trading Platforms", "Investment Technology", "Financial Software", "Risk Management", "Market Analysis"],
    cyprusOperations: "Regional headquarters and development center in Limassol",
    companyStats: {
      totalEmployees: "1,000+",
      foundedYear: 2009,
      globalOffices: 8,
      marketPresence: "Global fintech company with remote-first approach",
      keyMetrics: ["200+ team members", "Multiple trading platforms", "Global market presence"]
    },
    benefits: {
      workLifeBalance: ["Remote-first culture", "Flexible schedules", "Work-life balance"],
      compensation: ["Competitive salaries", "Performance bonuses", "Equity participation", "Global opportunities"],
      development: ["Professional development", "Tech conferences", "Skills training", "Career advancement"],
      health: ["Health insurance", "Wellness programs", "Mental health support"],
      culture: ["Remote-first", "Innovation-driven", "Global team", "Fintech expertise"]
    },
    totalOpenRoles: 5,
    jobOpenings: [
      {
        jobTitle: "Customer Support Operator with Spanish and English",
        department: "Customer Support",
        location: "Bolivia, Peru, Uruguay, Dominican Republic, Chile",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Mid",
        keyRequirements: ["Spanish fluency", "English fluency", "Customer support experience", "Communication skills"],
        jobDescriptionSummary: "Provide customer support for trading platform users in Spanish-speaking markets"
      },
      {
        jobTitle: "Business Development Manager (GCC region)",
        department: "Business Development",
        location: "Dubai",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["Business development", "GCC market knowledge", "Sales", "Relationship management"],
        jobDescriptionSummary: "Drive business development and partnerships in the GCC region"
      },
      {
        jobTitle: "Retention Manager (Email & CRM)",
        department: "Marketing",
        location: "Georgia, Armenia, Serbia, Moldova, Belarus",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Senior",
        keyRequirements: ["Email marketing", "CRM management", "Customer retention", "Analytics"],
        jobDescriptionSummary: "Manage customer retention strategies through email marketing and CRM systems"
      },
      {
        jobTitle: "Senior Go Developer (Trading Exchange)",
        department: "Engineering",
        location: "Multiple countries (Georgia, Moldova, Serbia, Kazakhstan, Cyprus, Dubai, Poland, Portugal, Spain, others)",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Senior",
        keyRequirements: ["Go programming", "Trading systems", "High-performance systems", "Financial markets"],
        jobDescriptionSummary: "Develop high-performance trading exchange systems using Go programming language"
      },
      {
        jobTitle: "Talent Sourcer",
        department: "Human Resources",
        location: "Poland, Georgia, Armenia, Serbia, Belarus",
        employmentType: "Full-time",
        workArrangement: "Remote",
        experienceLevel: "Mid",
        keyRequirements: ["Talent acquisition", "Recruiting", "Sourcing strategies", "Communication"],
        jobDescriptionSummary: "Source and recruit talent for various positions across global operations"
      }
    ]
  },
  {
    name: "easyMarkets",
    industry: "Financial Services",
    description: "Online trading platform providing forex, commodities, and CFD trading services with innovative trading tools and risk management features.",
    website: "https://easymarkets.com",
    headquarters: "Limassol, Cyprus",
    founded: 2001,
    employees: "300-500",
    specialties: ["Online Trading", "Forex Trading", "CFD Trading", "Risk Management", "Trading Technology"],
    cyprusOperations: "Main trading operations and customer service center in Limassol",
    companyStats: {
      totalEmployees: "300-500",
      foundedYear: 2001,
      globalOffices: 2,
      marketPresence: "Global trading platform with diverse international work environment",
      keyMetrics: ["20+ years trading experience", "Multi-jurisdiction operations", "Innovative trading tools"]
    },
    benefits: {
      workLifeBalance: ["International work environment", "Flexible arrangements", "Work-life balance"],
      compensation: ["Competitive salaries", "Performance incentives", "Career development opportunities"],
      development: ["Professional training", "Financial markets education", "Skills advancement", "Career progression"],
      health: ["Health insurance", "Employee wellness programs", "Life insurance"],
      culture: ["Diverse international team", "Trading expertise", "Innovation-focused", "Client-centric approach"]
    },
    totalOpenRoles: 10,
    jobOpenings: [
      {
        jobTitle: "Senior Compliance Associate",
        department: "Compliance",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["Compliance expertise", "Financial regulations", "Risk management"],
        jobDescriptionSummary: "Ensure regulatory compliance and manage risk assessment processes"
      },
      {
        jobTitle: "Head of Trading Education",
        department: "Education",
        location: "South Africa",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Executive",
        keyRequirements: ["Trading education", "Leadership", "Marketing", "Financial markets knowledge"],
        jobDescriptionSummary: "Lead trading education initiatives and content development"
      },
      {
        jobTitle: "Growth Product Manager",
        department: "Product Management",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["Product management", "Growth strategies", "Marketing", "Analytics"],
        jobDescriptionSummary: "Drive product growth strategies and user acquisition initiatives"
      },
      {
        jobTitle: "Senior Front End Developer (WordPress)",
        department: "Technology",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["WordPress", "Front-end development", "JavaScript", "CSS", "HTML"],
        jobDescriptionSummary: "Develop and maintain WordPress-based trading platform interfaces"
      },
      {
        jobTitle: "Junior Software Engineer",
        department: "Technology",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["Software development", "Programming languages", "Problem solving"],
        jobDescriptionSummary: "Contribute to software development projects and trading platform features"
      },
      {
        jobTitle: "IT Manager",
        department: "Technology",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Senior",
        keyRequirements: ["IT management", "Leadership", "Technical infrastructure", "Team management"],
        jobDescriptionSummary: "Manage IT operations and technical infrastructure for trading platform"
      },
      {
        jobTitle: "Junior Project Manager",
        department: "Project Management",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["Project management", "Organization", "Communication", "Planning"],
        jobDescriptionSummary: "Support project delivery and coordinate cross-functional initiatives"
      },
      {
        jobTitle: "Project Manager",
        department: "Project Management",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Project management", "Leadership", "Strategic planning", "Team coordination"],
        jobDescriptionSummary: "Lead project delivery and manage strategic initiatives"
      },
      {
        jobTitle: "Chief Accountant",
        department: "Finance",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Executive",
        keyRequirements: ["Accounting expertise", "Financial reporting", "Leadership", "Regulatory compliance"],
        jobDescriptionSummary: "Lead financial operations and ensure regulatory compliance"
      },
      {
        jobTitle: "Junior AML & Compliance Analyst",
        department: "Compliance",
        location: "Cyprus",
        employmentType: "Full-time",
        workArrangement: "On-site",
        experienceLevel: "Junior",
        keyRequirements: ["AML knowledge", "Compliance", "Risk analysis", "Financial regulations"],
        jobDescriptionSummary: "Support AML compliance and conduct risk analysis activities"
      }
    ]
  },
  {
    name: "DECTA",
    industry: "Payment Solutions",
    description: "International payment service provider offering comprehensive payment processing, card issuing, and financial technology solutions.",
    website: "https://decta.com",
    headquarters: "Riga, Latvia",
    founded: 2001,
    employees: "200-400",
    specialties: ["Payment Processing", "Card Issuing", "Payment Gateway", "Financial Technology", "E-commerce Solutions"],
    cyprusOperations: "European operations and compliance center",
    companyStats: {
      totalEmployees: "200-400",
      foundedYear: 2001,
      globalOffices: 4,
      marketPresence: "2000+ customers across multiple countries",
      keyMetrics: ["20+ years experience", "2000+ customers", "Multi-country operations"]
    },
    benefits: {
      workLifeBalance: ["Remote work options", "Flexible arrangements", "International team collaboration"],
      compensation: ["Competitive salaries", "Performance bonuses", "International opportunities"],
      development: ["Technical training", "Career advancement", "Industry certifications", "Skills development"],
      health: ["Health insurance", "Wellness programs", "Employee support"],
      culture: ["International environment", "Innovation-focused", "Technology-driven", "Payment industry expertise"]
    },
    totalOpenRoles: 5,
    jobOpenings: [
      {
        jobTitle: "Back-End Developer (Python)",
        department: "Engineering",
        location: "UK, Latvia, Cyprus, Ireland",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid-Senior",
        keyRequirements: ["Python", "API development", "Microservices", "Basic cryptography", "Security practices"],
        jobDescriptionSummary: "Develop backend systems for payment processing solutions"
      },
      {
        jobTitle: "Technical Support Specialist",
        department: "Support",
        location: "UK, Latvia, Cyprus, Ireland",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid",
        keyRequirements: ["Linux", "Oracle SQL Developer", "JIRA", "Confluence", "Basic API knowledge"],
        jobDescriptionSummary: "Provide technical support for payment systems and client integrations"
      },
      {
        jobTitle: "Data Analyst/Engineer",
        department: "Data & Analytics",
        location: "UK, Latvia, Cyprus, Ireland",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid",
        keyRequirements: ["SQL", "Data warehouse concepts", "ETL processes", "Data analysis", "Reporting dashboards"],
        jobDescriptionSummary: "Analyze payment data and create business intelligence solutions"
      },
      {
        jobTitle: "System Analyst",
        department: "Technology",
        location: "UK, Latvia, Cyprus, Ireland",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Mid",
        keyRequirements: ["Business analysis", "Computer Science degree", "Technical solutions", "2+ years IT experience"],
        jobDescriptionSummary: "Analyze business requirements and design technical solutions"
      },
      {
        jobTitle: "Senior Partnerships Development Manager",
        department: "Business Development",
        location: "UK, Latvia, Cyprus, Ireland",
        employmentType: "Full-time",
        workArrangement: "Remote/Hybrid",
        experienceLevel: "Senior",
        keyRequirements: ["International payment solutions sales", "E-commerce background", "Fluent English", "Market analysis"],
        jobDescriptionSummary: "Develop strategic partnerships and drive business growth"
      }
    ]
  }
]

// Helper function to check if a company is verified
export const isVerifiedCompany = (companyName: string): boolean => {
  return verifiedCompanies.some(company => company.name === companyName)
}

// Get verified company details
export const getVerifiedCompanyDetails = (companyName: string): VerifiedCompany | null => {
  return verifiedCompanies.find(company => company.name === companyName) || null
}

// Get companies by industry
export const getVerifiedCompaniesByIndustry = (industry: string): VerifiedCompany[] => {
  return verifiedCompanies.filter(company => company.industry === industry)
}

// Get all industries
export const getVerifiedCompanyIndustries = (): string[] => {
  const industries = verifiedCompanies.map(company => company.industry)
  return Array.from(new Set(industries))
}