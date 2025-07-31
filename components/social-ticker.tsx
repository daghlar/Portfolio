"use client"

import {
  MessageCircle,
  Linkedin,
  Twitter,
  Youtube,
  Send,
  Hash,
  Shield,
  Trophy,
  Zap,
  Video,
  Camera,
  Play,
} from "lucide-react"

export function SocialTicker() {
  const socialLinks = [
    {
      name: "QTox ID",
      value: "xdaghlar@qtox.me",
      icon: MessageCircle,
      color: "text-green-400",
      href: "tox:xdaghlar@qtox.me",
    },
    {
      name: "Session ID",
      value: "xdaghlar.session",
      icon: Shield,
      color: "text-blue-400",
      href: "#",
    },
    {
      name: "Element",
      value: "@xdaghlar:matrix.org",
      icon: Hash,
      color: "text-purple-400",
      href: "https://matrix.to/#/@xdaghlar:matrix.org",
    },
    {
      name: "Bluesky",
      value: "@xdaghlar.bsky.social",
      icon: Zap,
      color: "text-sky-400",
      href: "https://bsky.app/profile/xdaghlar.bsky.social",
    },
    {
      name: "LinkedIn",
      value: "/in/xdaghlar",
      icon: Linkedin,
      color: "text-blue-500",
      href: "https://linkedin.com/in/xdaghlar",
    },
    {
      name: "Telegram",
      value: "@xdaghlar",
      icon: Send,
      color: "text-blue-400",
      href: "https://t.me/xdaghlar",
    },
    {
      name: "Twitter",
      value: "@xdaghlar",
      icon: Twitter,
      color: "text-blue-400",
      href: "https://twitter.com/xdaghlar",
    },
    {
      name: "Threads",
      value: "@xdaghlar",
      icon: Hash,
      color: "text-pink-400",
      href: "https://threads.net/@xdaghlar",
    },
    {
      name: "Teknofest",
      value: "xdaghlar.teknofest",
      icon: Trophy,
      color: "text-orange-400",
      href: "https://teknofest.org/profile/xdaghlar",
    },
    {
      name: "YouTube",
      value: "@xdaghlar",
      icon: Youtube,
      color: "text-red-500",
      href: "https://youtube.com/@xdaghlar",
    },
    {
      name: "TikTok",
      value: "@xdaghlar",
      icon: Video,
      color: "text-pink-500",
      href: "https://tiktok.com/@xdaghlar",
    },
    {
      name: "Pixelfed",
      value: "@xdaghlar",
      icon: Camera,
      color: "text-purple-500",
      href: "https://pixelfed.social/@xdaghlar",
    },
    {
      name: "Rutube",
      value: "xdaghlar",
      icon: Play,
      color: "text-red-400",
      href: "https://rutube.ru/channel/xdaghlar",
    },
    {
      name: "Odysee",
      value: "@xdaghlar",
      icon: Play,
      color: "text-green-500",
      href: "https://odysee.com/@xdaghlar",
    },
    {
      name: "Kick",
      value: "xdaghlar",
      icon: Zap,
      color: "text-green-500",
      href: "https://kick.com/xdaghlar",
    },
  ]

  // Duplicate the array for seamless loop
  const duplicatedLinks = [...socialLinks, ...socialLinks]

  return (
    <div
      className="overflow-hidden bg-gray-900/20 backdrop-blur-sm border-y border-gray-800/30 py-3 md:py-4 animate-fade-in-up"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        animationDelay: "0.1s",
      }}
    >
      <div className="flex animate-scroll-right">
        {duplicatedLinks.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={`${link.name}-${index}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 md:gap-3 px-4 md:px-8 py-1.5 md:py-2 mx-2 md:mx-4 bg-gray-800/30 border border-gray-700/50 rounded-full hover:bg-gray-700/40 hover:border-gray-600/60 transition-all duration-300 group backdrop-blur-sm whitespace-nowrap flex-shrink-0 min-w-[200px] md:min-w-[240px]"
            >
              <Icon className={`w-3 h-3 md:w-4 md:h-4 ${link.color} group-hover:scale-110 transition-transform`} />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-light">{link.name}</span>
                <span className="text-xs md:text-sm text-white font-light">{link.value}</span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
