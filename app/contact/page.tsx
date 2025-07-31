"use client"

import { ArrowLeft, Mail, Phone, MapPin, Send, Github, Hash, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { AdminTrigger } from "@/components/admin-trigger"

export default function ContactPage() {
  const socialLinks = [
    {
      name: "ProtonMail",
      href: "mailto:xdaghlar@protonmail.com",
      icon: Mail,
      color: "text-purple-400 hover:text-purple-300",
    },
    {
      name: "Element",
      href: "https://matrix.to/#/@xdaghlar:matrix.org",
      icon: Hash,
      color: "text-green-400 hover:text-green-300",
    },
    {
      name: "GitHub",
      href: "https://github.com/xdaghlar",
      icon: Github,
      color: "text-gray-400 hover:text-white",
    },
    {
      name: "Bluesky",
      href: "https://bsky.app/profile/xdaghlar.bsky.social",
      icon: Zap,
      color: "text-blue-400 hover:text-blue-300",
    },
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
          <div className="mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
            <h1 className="text-responsive-8xl font-thin mb-6 sm:mb-8 tracking-wide">Get in Touch</h1>
            <p className="text-gray-400 text-responsive-3xl font-light">Let's collaborate on something amazing</p>
          </div>

          <div className="unified-container rounded-2xl sm:rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="grid xl:grid-cols-2">
              {/* Contact Information */}
              <div className="p-6 sm:p-12 lg:p-16 xl:border-r border-b xl:border-b-0 border-gray-800/50">
                <h2 className="text-responsive-5xl font-thin mb-12 sm:mb-16 tracking-wide">Contact Information</h2>

                <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Mail className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-light mb-1 sm:mb-2">Email</p>
                      <p className="text-gray-400 font-light text-sm sm:text-base">contact@xdaghlar.me</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Phone className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-light mb-1 sm:mb-2">Phone</p>
                      <p className="text-gray-400 font-light text-sm sm:text-base">+90 535 014 10 99</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-800/30 border border-gray-700/50 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-light mb-1 sm:mb-2">Location</p>
                      <p className="text-gray-400 font-light text-sm sm:text-base">Istanbul, Turkey</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 lg:pt-16 border-t border-gray-800/50">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-6 sm:mb-8 lg:mb-10">Connect with me</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 p-4 bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-700/30 transition-smooth rounded-xl backdrop-blur-sm group ${social.color}`}
                        >
                          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="font-light text-sm">{social.name}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-6 sm:p-12 lg:p-16">
                <h2 className="text-responsive-5xl font-thin mb-12 sm:mb-16 tracking-wide">Send a Message</h2>

                <form className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <Input
                      type="text"
                      placeholder="Your Name"
                      className="bg-gray-800/30 border-gray-700/50 focus:border-gray-600/50 h-12 sm:h-14 text-white placeholder:text-gray-500 font-light rounded-lg sm:rounded-xl backdrop-blur-sm text-sm sm:text-base"
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-gray-800/30 border-gray-700/50 focus:border-gray-600/50 h-12 sm:h-14 text-white placeholder:text-gray-500 font-light rounded-lg sm:rounded-xl backdrop-blur-sm text-sm sm:text-base"
                    />
                  </div>

                  <Input
                    type="text"
                    placeholder="Subject"
                    className="bg-gray-800/30 border-gray-700/50 focus:border-gray-600/50 h-12 sm:h-14 text-white placeholder:text-gray-500 font-light rounded-lg sm:rounded-xl backdrop-blur-sm text-sm sm:text-base"
                  />

                  <Textarea
                    placeholder="Your Message"
                    className="bg-gray-800/30 border-gray-700/50 focus:border-gray-600/50 min-h-[120px] sm:min-h-[160px] text-white placeholder:text-gray-500 resize-none font-light rounded-lg sm:rounded-xl backdrop-blur-sm text-sm sm:text-base"
                  />

                  <Button className="w-full h-12 sm:h-14 bg-white text-black hover:bg-gray-200 font-light text-base sm:text-lg transition-smooth rounded-lg sm:rounded-xl">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
