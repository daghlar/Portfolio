"use client"

import {
  ArrowLeft,
  Award,
  Calendar,
  Building,
  ExternalLink,
  Shield,
  CheckCircle,
  Filter,
  Search,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { AdminTrigger } from "@/components/admin-trigger"
import { useState, useEffect } from "react"

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [filteredCertificates, setFilteredCertificates] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Comprehensive category structure
  const categoryStructure = {
    CYBERSECURITY: {
      color: "#EF4444",
      subcategories: {
        "Fundamentals & Entry Level": "Basic cybersecurity training for beginners",
        "Network Security": "Certificates focused on securing network infrastructure",
        "Web Application Security": "OWASP Top 10, attack surface analysis and application protection",
        "Ethical Hacking & Pentest": "Penetration testing and offensive security training",
        "Reverse Engineering & Exploit": "Malware analysis, RE techniques, BOF and binary exploitation",
        "SOC, SIEM & Blue Team": "Security monitoring, incident response, log analysis",
        "Digital Forensics & DFIR": "Digital evidence collection, forensic analysis, case management",
        "Management Cybersecurity": "ISO 27001, NIST, GDPR, compliance, risk management",
      },
    },
    "SOFTWARE DEVELOPMENT": {
      color: "#10B981",
      subcategories: {
        "Frontend Development": "HTML, CSS, JavaScript, React, Next.js, Tailwind",
        "Backend Development": "Python, Node.js, Go, PHP, API development",
        "Mobile App Development": "Android, iOS, Flutter, React Native",
        "Database Management": "SQL, NoSQL, MongoDB, PostgreSQL",
        "Programming Languages": "C, C++, Rust, Python, Ruby, Java",
        "Game Development": "Unity, Unreal Engine, 2D/3D game development",
        "Version Control & DevOps": "Git, GitHub, Docker, CI/CD, Jenkins",
      },
    },
    "WEB TECHNOLOGIES": {
      color: "#3B82F6",
      subcategories: {
        "Web Development Fundamentals": "HTML, CSS, JavaScript fundamentals",
        "Fullstack Web Development": "Full-stack web development",
        "Web Security": "CSP, CORS, SSL, WAF systems",
        "Site Performance": "Optimization and speed improvements",
        "Hosting & Infrastructure": "DNS, CDN, hosting systems",
      },
    },
    "ARTIFICIAL INTELLIGENCE & DATA SCIENCE": {
      color: "#8B5CF6",
      subcategories: {
        "AI Introduction": "AI for Everyone, Google AI Fundamentals",
        "Machine Learning": "Supervised/Unsupervised Learning, Scikit-learn",
        "Deep Learning": "CNN, RNN, LSTM, TensorFlow, PyTorch",
        "Natural Language Processing": "NLP, BERT, GPT, Sentiment Analysis",
        "Computer Vision": "OpenCV, YOLO, Image Classification",
        "Data Science": "Pandas, NumPy, Matplotlib, Data Visualization",
        "MLOps & Deployment": "Model deployment, API integration",
      },
    },
    "CLOUD COMPUTING & DEVOPS": {
      color: "#F59E0B",
      subcategories: {
        "AWS Certifications": "Cloud Practitioner, Solutions Architect",
        "Microsoft Azure": "Azure Fundamentals, Developer Associate",
        "Google Cloud Platform": "GCP Fundamentals, Architect",
        "DevOps Tools": "Terraform, Ansible, Jenkins, CI/CD",
      },
    },
    "HARDWARE & IOT": {
      color: "#06B6D4",
      subcategories: {
        "Arduino & Raspberry Pi": "Microcontroller projects",
        "Embedded Linux": "Embedded Linux systems",
        "IoT Security": "Internet of Things security",
      },
    },
    "ACADEMIC / GENERAL": {
      color: "#84CC16",
      subcategories: {
        Cryptography: "Encryption and security algorithms",
        "IT Fundamentals": "Information technology fundamentals",
        "Project Management": "PMI, Agile, Scrum methodologies",
        "Participation Certificates": "Workshops, summits and events",
        "Instructor Certificates": "Mentoring and training certificates",
      },
    },
  }

  // Available tags
  const availableTags = [
    { id: "online", label: "Online", color: "#3B82F6" },
    { id: "hands-on", label: "Hands-on", color: "#10B981" },
    { id: "certificate_of_completion", label: "Certificate of Completion", color: "#8B5CF6" },
    { id: "exam_passed", label: "Exam Passed", color: "#EF4444" },
    { id: "instructor_led", label: "Instructor Led", color: "#F59E0B" },
    { id: "selfpaced", label: "Self-paced", color: "#06B6D4" },
    { id: "openbadge", label: "Open Badge", color: "#84CC16" },
    { id: "recognized", label: "Industry Recognized", color: "#EC4899" },
  ]

  useEffect(() => {
    loadCertificates()

    // Listen for real-time updates
    const handleAdminUpdate = () => {
      loadCertificates()
    }

    window.addEventListener("adminDataUpdated", handleAdminUpdate)
    return () => window.removeEventListener("adminDataUpdated", handleAdminUpdate)
  }, [])

  useEffect(() => {
    filterCertificates()
  }, [certificates, selectedCategory, selectedSubcategory, searchTerm, selectedTags])

  const loadCertificates = () => {
    try {
      const adminData = localStorage.getItem("daghlar_admin_data")
      if (adminData) {
        const data = JSON.parse(adminData)
        setCertificates(data.certificates || [])
      } else {
        // Default certificates with new structure
        setCertificates([
          {
            id: 1,
            name: "Certified Ethical Hacker (CEH)",
            institution: "EC-Council",
            certificateId: "CEH-2024-001",
            issueDate: "2024-01-15",
            expiryDate: "2027-01-15",
            category: "CYBERSECURITY",
            subcategory: "Ethical Hacking & Pentest",
            verificationUrl: "https://cert.eccouncil.org/verify",
            certificateImageUrl: "/placeholder.svg?height=300&width=400&text=CEH+Certificate",
            description:
              "Advanced ethical hacking and penetration testing certification covering network security, web application security, and system hacking techniques.",
            skills: ["Penetration Testing", "Network Security", "Web Application Security", "System Hacking"],
            tags: ["exam_passed", "recognized", "hands-on"],
            isValid: true,
            isVisible: true,
            priority: 1,
          },
          {
            id: 2,
            name: "AWS Certified Security - Specialty",
            institution: "Amazon Web Services",
            certificateId: "AWS-SEC-2024-002",
            issueDate: "2024-02-20",
            expiryDate: "2027-02-20",
            category: "CLOUD COMPUTING & DEVOPS",
            subcategory: "AWS Certifications",
            verificationUrl: "https://aws.amazon.com/verification",
            certificateImageUrl: "/placeholder.svg?height=300&width=400&text=AWS+Security+Specialty",
            description:
              "Cloud security specialization for AWS infrastructure, covering identity and access management, data protection, and incident response.",
            skills: ["AWS Security", "Cloud Security", "IAM", "Data Protection"],
            tags: ["exam_passed", "recognized", "online"],
            isValid: true,
            isVisible: true,
            priority: 2,
          },
          {
            id: 3,
            name: "Machine Learning Engineer",
            institution: "Google Cloud",
            certificateId: "GCP-ML-2024-003",
            issueDate: "2024-03-10",
            expiryDate: "2026-03-10",
            category: "ARTIFICIAL INTELLIGENCE & DATA SCIENCE",
            subcategory: "Machine Learning",
            verificationUrl: "https://cloud.google.com/certification",
            certificateImageUrl: "/placeholder.svg?height=300&width=400&text=GCP+ML+Engineer",
            description:
              "Professional ML engineering on Google Cloud Platform, covering model development, deployment, and monitoring.",
            skills: ["Machine Learning", "TensorFlow", "Google Cloud", "Model Deployment"],
            tags: ["exam_passed", "hands-on", "recognized"],
            isValid: true,
            isVisible: true,
            priority: 3,
          },
          {
            id: 4,
            name: "React Developer Certification",
            institution: "Meta",
            certificateId: "META-REACT-2024-004",
            issueDate: "2024-04-05",
            expiryDate: null,
            category: "SOFTWARE DEVELOPMENT",
            subcategory: "Frontend Development",
            verificationUrl: "https://developers.facebook.com/certification",
            certificateImageUrl: "/placeholder.svg?height=300&width=400&text=Meta+React+Developer",
            description:
              "Advanced React development and best practices, covering hooks, state management, and modern React patterns.",
            skills: ["React", "JavaScript", "Frontend Development", "State Management"],
            tags: ["certificate_of_completion", "hands-on", "online"],
            isValid: true,
            isVisible: true,
            priority: 4,
          },
          {
            id: 5,
            name: "CISSP - Certified Information Systems Security Professional",
            institution: "ISC2",
            certificateId: "CISSP-2024-005",
            issueDate: "2024-05-12",
            expiryDate: "2027-05-12",
            category: "CYBERSECURITY",
            subcategory: "Management Cybersecurity",
            verificationUrl: "https://isc2.org/verify",
            certificateImageUrl: "/placeholder.svg?height=300&width=400&text=CISSP+Certificate",
            description:
              "Advanced information security management certification covering security governance, risk management, and compliance.",
            skills: ["Security Management", "Risk Assessment", "Compliance", "Security Architecture"],
            tags: ["exam_passed", "recognized", "instructor_led"],
            isValid: true,
            isVisible: true,
            priority: 5,
          },
        ])
      }
    } catch (error) {
      console.error("Error loading certificates:", error)
      setCertificates([])
    }
  }

  const filterCertificates = () => {
    let filtered = certificates.filter((cert) => cert.isVisible)

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((cert) => cert.category === selectedCategory)
    }

    // Subcategory filter
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter((cert) => cert.subcategory === selectedSubcategory)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (cert) =>
          cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((cert) => cert.tags?.some((tag: string) => selectedTags.includes(tag)))
    }

    setFilteredCertificates(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: "no-expiry", daysLeft: null, color: "text-gray-400" }

    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: "expired", daysLeft: diffDays, color: "text-red-400" }
    if (diffDays <= 30) return { status: "expiring-soon", daysLeft: diffDays, color: "text-orange-400" }
    if (diffDays <= 90) return { status: "expiring", daysLeft: diffDays, color: "text-yellow-400" }
    return { status: "valid", daysLeft: diffDays, color: "text-green-400" }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]))
  }

  const getSubcategories = () => {
    if (selectedCategory === "all") return {}
    return categoryStructure[selectedCategory as keyof typeof categoryStructure]?.subcategories || {}
  }

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {}
    Object.keys(categoryStructure).forEach((category) => {
      stats[category] = certificates.filter((cert) => cert.category === category && cert.isVisible).length
    })
    return stats
  }

  const categoryStats = getCategoryStats()

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Sidebar />
      <AdminTrigger />

      {/* Background */}
      <div className="fixed inset-0 grid-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black" />

      <div className="lg:ml-20 p-4 sm:p-8 lg:p-16 relative z-10 pt-20 lg:pt-16">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 sm:mb-12 lg:mb-16 transition-smooth group"
        >
          <ArrowLeft className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-2 transition-smooth" />
          <span className="font-light text-sm sm:text-base">Back to home</span>
        </Link>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <h1 className="text-responsive-8xl font-thin mb-6 sm:mb-8 tracking-wide">Certificates</h1>
            <p className="text-gray-400 text-responsive-3xl font-light mb-8">
              Professional certifications and achievements
            </p>

            {/* Category System Description */}
            <div className="unified-container rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-light mb-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                Certificate Category System
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                The certificates in this section are categorized by expertise areas, technical topics, and industry
                skills. Each category is detailed with relevant subcategories to provide better organization and
                navigation.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(categoryStructure).map(([category, data]) => (
                  <div key={category} className="text-center">
                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: data.color }} />
                    <p className="text-sm text-gray-300">{category}</p>
                    <p className="text-xs text-gray-500">{categoryStats[category] || 0} certificates</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="unified-container rounded-2xl p-6">
              <h3 className="text-xl font-light mb-6 flex items-center gap-3">
                <Filter className="w-5 h-5 text-purple-400" />
                Filtering and Search
              </h3>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search certificate name, institution or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-3">Main Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedSubcategory("all")
                    }}
                    className={`px-4 py-2 rounded-full text-sm transition-smooth ${
                      selectedCategory === "all"
                        ? "bg-white text-black"
                        : "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/30 text-gray-300"
                    }`}
                  >
                    All ({certificates.filter((c) => c.isVisible).length})
                  </button>
                  {Object.entries(categoryStructure).map(([category, data]) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setSelectedSubcategory("all")
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-smooth ${
                        selectedCategory === category
                          ? "text-black"
                          : "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/30 text-gray-300"
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category ? data.color : undefined,
                      }}
                    >
                      {category} ({categoryStats[category] || 0})
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              {selectedCategory !== "all" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">Subcategory</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubcategory("all")}
                      className={`px-3 py-2 rounded-lg text-sm transition-smooth ${
                        selectedSubcategory === "all"
                          ? "bg-white text-black"
                          : "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/30 text-gray-300"
                      }`}
                    >
                      All
                    </button>
                    {Object.entries(getSubcategories()).map(([subcategory, description]) => (
                      <button
                        key={subcategory}
                        onClick={() => setSelectedSubcategory(subcategory)}
                        className={`px-3 py-2 rounded-lg text-sm transition-smooth ${
                          selectedSubcategory === subcategory
                            ? "bg-blue-500 text-white"
                            : "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/30 text-gray-300"
                        }`}
                        title={description}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded-full text-xs transition-smooth ${
                        selectedTags.includes(tag.id)
                          ? "text-white"
                          : "bg-gray-800/30 border border-gray-700/50 hover:bg-gray-700/30 text-gray-300"
                      }`}
                      style={{
                        backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
                      }}
                    >
                      #{tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                {certificates.length === 0
                  ? "No certificates have been added yet."
                  : "No certificates found matching the selected filters."}
              </p>
              {searchTerm || selectedCategory !== "all" || selectedTags.length > 0 ? (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedSubcategory("all")
                    setSelectedTags([])
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-smooth"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <p className="text-gray-400">
                  Showing <span className="text-white font-medium">{filteredCertificates.length}</span> certificates
                  {certificates.length !== filteredCertificates.length && (
                    <span> (out of {certificates.filter((c) => c.isVisible).length} total certificates)</span>
                  )}
                </p>
              </div>

              {/* Certificates Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {filteredCertificates.map((certificate, index) => {
                  const expiryStatus = getExpiryStatus(certificate.expiryDate)
                  const categoryData = categoryStructure[certificate.category as keyof typeof categoryStructure]

                  return (
                    <div
                      key={certificate.id}
                      className="unified-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/5 transition-smooth group animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Certificate Image */}
                      {certificate.certificateImageUrl && (
                        <div className="mb-6 overflow-hidden rounded-xl">
                          <img
                            src={certificate.certificateImageUrl || "/placeholder.svg"}
                            alt={certificate.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-light"
                                style={{
                                  backgroundColor: `${categoryData?.color || "#10B981"}20`,
                                  color: categoryData?.color || "#10B981",
                                  border: `1px solid ${categoryData?.color || "#10B981"}30`,
                                }}
                              >
                                {certificate.category}
                              </span>
                              {certificate.subcategory && (
                                <span className="px-2 py-1 rounded-md text-xs bg-gray-700/30 text-gray-300">
                                  {certificate.subcategory}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {expiryStatus.status === "valid" && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {expiryStatus.status === "expiring-soon" && <Clock className="w-5 h-5 text-orange-400" />}
                          {expiryStatus.status === "expired" && <AlertTriangle className="w-5 h-5 text-red-400" />}
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-light mb-3 group-hover:text-white/90 transition-smooth">
                        {certificate.name}
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-400">
                          <Building className="w-4 h-4" />
                          <span className="font-light">{certificate.institution}</span>
                        </div>

                        {certificate.certificateId && (
                          <div className="flex items-center gap-3 text-gray-400">
                            <Shield className="w-4 h-4" />
                            <span className="font-light font-mono text-sm">{certificate.certificateId}</span>
                          </div>
                        )}

                        {certificate.issueDate && (
                          <div className="flex items-center gap-3 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="font-light">
                              {formatDate(certificate.issueDate)}
                              {certificate.expiryDate && (
                                <span className={expiryStatus.color}>
                                  {" "}
                                  - {formatDate(certificate.expiryDate)}
                                  {expiryStatus.daysLeft !== null && expiryStatus.daysLeft > 0 && (
                                    <span className="text-xs ml-2">({expiryStatus.daysLeft} days left)</span>
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {certificate.description && (
                        <p className="text-gray-400 mb-6 leading-relaxed font-light text-sm sm:text-base">
                          {certificate.description}
                        </p>
                      )}

                      {/* Skills */}
                      {certificate.skills && certificate.skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-400 mb-3">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {certificate.skills.map((skill: string, skillIndex: number) => (
                              <span
                                key={skillIndex}
                                className="px-2 py-1 bg-gray-700/30 rounded-md text-xs text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {certificate.tags && certificate.tags.length > 0 && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {certificate.tags.map((tagId: string, tagIndex: number) => {
                              const tag = availableTags.find((t) => t.id === tagId)
                              if (!tag) return null

                              return (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 rounded-full text-xs"
                                  style={{
                                    backgroundColor: `${tag.color}20`,
                                    color: tag.color,
                                    border: `1px solid ${tag.color}30`,
                                  }}
                                >
                                  #{tag.label}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Verification Link */}
                      {certificate.verificationUrl && (
                        <a
                          href={certificate.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-smooth font-light"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Verify Certificate
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
