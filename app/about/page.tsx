"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { AdminTrigger } from "@/components/admin-trigger"

export default function AboutPage() {
  const skills = {
    frontend: ["HTML", "CSS", "Tailwind CSS", "JavaScript", "TypeScript", "React", "Next.js"],
    backend: ["Node.js", "PostgreSQL", "MySQL", "MongoDB"],
    ai: ["Python", "AI/Machine Learning", "Rust", "Go", "C++"],
    security: ["Cyber Security", "AppSec", "Network Security", "OSINT", "Linux/Unix", "System Admin", "UX/UI Design"],
  }

  const languages = [
    { name: "Azerbaijani", level: "Native", percentage: 100 },
    { name: "Turkish", level: "Fluent", percentage: 95 },
    { name: "Russian", level: "Intermediate-Advanced", percentage: 80 },
    { name: "English", level: "Intermediate", percentage: 50 },
    { name: "Arabic", level: "Beginner", percentage: 15 },
    { name: "Chinese", level: "Beginner", percentage: 10 },
    { name: "Hebrew", level: "Beginner", percentage: 10 },
    { name: "Persian", level: "Beginner", percentage: 10 },
    { name: "Kurdish", level: "Beginner", percentage: 10 },
    { name: "Other Languages", level: "Beginner", percentage: 30 },
  ]

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

        <div className="max-w-6xl mx-auto">
          <h1 className="text-responsive-8xl font-thin mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up tracking-wide">
            About Me
          </h1>

          {/* Hero Section */}
          <div className="unified-container rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <div className="flex flex-col xl:flex-row gap-8 sm:gap-12 lg:gap-16">
              <div className="flex-shrink-0 mx-auto xl:mx-0">
                <div className="relative">
                  <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-gray-900/30 border border-gray-700/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-sm overflow-hidden">
                    <Image
                      src="/profile-photo.jpg"
                      alt="Daghlar Mammadov"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white text-black flex items-center justify-center rounded-xl sm:rounded-2xl font-light text-lg sm:text-2xl">
                    23
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6 sm:space-y-8 lg:space-y-10 text-center xl:text-left">
                <h2 className="text-responsive-6xl font-thin tracking-wide">Daghlar Mammadov</h2>

                <div className="flex flex-wrap justify-center xl:justify-start gap-3 sm:gap-4">
                  <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/30 border border-gray-700/50 rounded-full backdrop-blur-sm">
                    <span className="font-light text-gray-300 text-sm sm:text-base">Istanbul, Turkey</span>
                  </div>
                  <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/30 border border-gray-700/50 rounded-full backdrop-blur-sm">
                    <span className="font-light text-gray-300 text-sm sm:text-base">23 years old</span>
                  </div>
                  <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/30 border border-gray-700/50 rounded-full backdrop-blur-sm">
                    <span className="font-light text-gray-300 text-sm sm:text-base">13 years experience</span>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6 font-light text-base sm:text-lg leading-relaxed text-gray-300">
                  <p>
                    I'm a Computer Engineering student at Nişantaşı University and an Azerbaijani citizen. I've been
                    actively working in software development, artificial intelligence, and cybersecurity for 13 years.
                  </p>
                  <p>
                    I've developed numerous open-source projects, operating systems, browsers, and AI models. I'm
                    constantly improving my language skills across multiple languages and cultures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Skills Combined */}
          <div
            className="unified-container rounded-2xl sm:rounded-3xl overflow-hidden animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Education */}
            <div className="p-6 sm:p-12 lg:p-16 border-b border-gray-800/50">
              <h2 className="text-responsive-6xl font-thin mb-8 sm:mb-12 tracking-wide">Education</h2>
              <div className="border-l-2 border-gray-600/50 pl-4 sm:pl-8">
                <h3 className="text-responsive-4xl font-light mb-3 sm:mb-4">Nişantaşı University</h3>
                <p className="text-gray-400 mb-3 sm:mb-4 font-light text-sm sm:text-base">
                  Computer Engineering (2nd Year) • 2023 - Present
                </p>
                <p className="text-gray-500 font-light text-sm sm:text-base">Istanbul, Turkey</p>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="p-6 sm:p-12 lg:p-16 border-b border-gray-800/50">
              <h2 className="text-responsive-6xl font-thin mb-12 sm:mb-16 tracking-wide">Technical Skills</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category} className="space-y-6 sm:space-y-8">
                    <h3 className="text-lg sm:text-xl font-light uppercase tracking-widest text-gray-400 border-b border-gray-700/50 pb-3 sm:pb-4">
                      {category.replace("ai", "AI & Programming Languages")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {skillList.map((skill) => (
                        <div
                          key={skill}
                          className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-700/30 transition-smooth text-center rounded-lg sm:rounded-xl backdrop-blur-sm"
                        >
                          <span className="font-light text-xs sm:text-sm text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Skills */}
            <div className="p-6 sm:p-12 lg:p-16">
              <h2 className="text-responsive-6xl font-thin mb-12 sm:mb-16 tracking-wide">Language Skills</h2>
              <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                {languages.map((lang) => (
                  <div key={lang.name} className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-xl lg:text-2xl font-light">{lang.name}</span>
                      <span className="text-gray-400 font-light text-sm sm:text-base">{lang.level}</span>
                    </div>
                    <div className="w-full h-1.5 sm:h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gray-400 to-white transition-all duration-3000 ease-out"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community */}
          <div
            className="unified-container rounded-2xl sm:rounded-3xl p-6 sm:p-12 lg:p-16 mt-12 sm:mt-16 lg:mt-20 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <h2 className="text-responsive-6xl font-thin mb-8 sm:mb-12 tracking-wide">Community Leadership</h2>
            <div className="border-l-2 border-gray-600/50 pl-4 sm:pl-8">
              <h3 className="text-responsive-4xl font-light mb-4 sm:mb-6">Siber TUN – Club President</h3>
              <p className="text-gray-300 font-light text-base sm:text-lg leading-relaxed">
                Leading event organization, lab platform development, content creation, and educational processes in the
                cybersecurity community. Fostering innovation and knowledge sharing among students and professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
