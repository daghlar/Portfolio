import { Metadata } from "next"

export const defaultMetadata: Metadata = {
  title: {
    default: "Daghlar Mammadov | Computer Engineering Student & Cybersecurity Expert",
    template: "%s | Daghlar Mammadov"
  },
  description: "Computer Engineering Student at Nişantaşı University. Cybersecurity Expert, Software Developer, and AI Enthusiast. Explore my projects, research, and professional journey.",
  keywords: [
    "Daghlar Mammadov",
    "Computer Engineering",
    "Cybersecurity",
    "Software Development",
    "AI",
    "Machine Learning",
    "Web Development",
    "Nişantaşı University",
    "Portfolio",
    "Projects",
    "Blog",
    "Certificates"
  ],
  authors: [{ name: "Daghlar Mammadov" }],
  creator: "Daghlar Mammadov",
  publisher: "Daghlar Mammadov",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://daghlar.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daghlar.dev",
    title: "Daghlar Mammadov | Computer Engineering Student & Cybersecurity Expert",
    description: "Computer Engineering Student at Nişantaşı University. Cybersecurity Expert, Software Developer, and AI Enthusiast.",
    siteName: "Daghlar Mammadov Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Daghlar Mammadov - Computer Engineering Student & Cybersecurity Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daghlar Mammadov | Computer Engineering Student & Cybersecurity Expert",
    description: "Computer Engineering Student at Nişantaşı University. Cybersecurity Expert, Software Developer, and AI Enthusiast.",
    images: ["/og-image.jpg"],
    creator: "@daghlar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
}

export function generateMetadata(path: string, customData?: any): Metadata {
  const baseMetadata = { ...defaultMetadata }
  
  switch (path) {
    case "/":
      return {
        ...baseMetadata,
        title: "Daghlar Mammadov | Computer Engineering Student & Cybersecurity Expert",
        description: "Computer Engineering Student at Nişantaşı University. Cybersecurity Expert, Software Developer, and AI Enthusiast. Explore my projects, research, and professional journey.",
      }
    
    case "/about":
      return {
        ...baseMetadata,
        title: "About Me | Daghlar Mammadov",
        description: "Learn more about Daghlar Mammadov - Computer Engineering Student, Cybersecurity Expert, and Software Developer. Discover my skills, experience, and passion for technology.",
        openGraph: {
          ...baseMetadata.openGraph,
          title: "About Me | Daghlar Mammadov",
          description: "Learn more about Daghlar Mammadov - Computer Engineering Student, Cybersecurity Expert, and Software Developer.",
        },
      }
    
    case "/projects":
      return {
        ...baseMetadata,
        title: "Projects | Daghlar Mammadov",
        description: "Explore my software development projects, AI applications, cybersecurity tools, and innovative solutions. See my technical skills in action.",
        openGraph: {
          ...baseMetadata.openGraph,
          title: "Projects | Daghlar Mammadov",
          description: "Explore my software development projects, AI applications, and cybersecurity tools.",
        },
      }
    
    case "/blog":
      return {
        ...baseMetadata,
        title: "Blog | Daghlar Mammadov",
        description: "Read my latest articles on cybersecurity, software development, AI, and technology trends. Insights from a Computer Engineering student.",
        openGraph: {
          ...baseMetadata.openGraph,
          title: "Blog | Daghlar Mammadov",
          description: "Read my latest articles on cybersecurity, software development, and AI.",
        },
      }
    
    case "/certificates":
      return {
        ...baseMetadata,
        title: "Certificates | Daghlar Mammadov",
        description: "View my professional certifications in cybersecurity, software development, and various technologies. Continuous learning and skill development.",
        openGraph: {
          ...baseMetadata.openGraph,
          title: "Certificates | Daghlar Mammadov",
          description: "View my professional certifications in cybersecurity and software development.",
        },
      }
    
    case "/contact":
      return {
        ...baseMetadata,
        title: "Contact | Daghlar Mammadov",
        description: "Get in touch with Daghlar Mammadov. Available for collaborations, projects, and professional opportunities in software development and cybersecurity.",
        openGraph: {
          ...baseMetadata.openGraph,
          title: "Contact | Daghlar Mammadov",
          description: "Get in touch with Daghlar Mammadov for collaborations and opportunities.",
        },
      }
    
    default:
      if (path.startsWith("/blog/") && customData) {
        return {
          ...baseMetadata,
          title: `${customData.title} | Daghlar Mammadov`,
          description: customData.excerpt || customData.description,
          openGraph: {
            ...baseMetadata.openGraph,
            title: customData.title,
            description: customData.excerpt || customData.description,
            type: "article",
            publishedTime: customData.publishedAt,
            modifiedTime: customData.updatedAt,
            authors: ["Daghlar Mammadov"],
            tags: customData.tags || [],
          },
          twitter: {
            ...baseMetadata.twitter,
            title: customData.title,
            description: customData.excerpt || customData.description,
          },
        }
      }
      
      return baseMetadata
  }
} 