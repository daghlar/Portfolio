// Content scraper for external blog posts
export class ContentScraper {
  private static readonly CORS_PROXY = "https://api.allorigins.win/get?url="

  // Scrape content from URL
  static async scrapeContent(url: string): Promise<{
    title: string
    content: string
    excerpt: string
    publishDate: string
    platform: string
    success: boolean
    error?: string
  }> {
    try {
      const platform = this.detectPlatform(url)

      // Use CORS proxy to fetch content
      const response = await fetch(`${this.CORS_PROXY}${encodeURIComponent(url)}`)
      const data = await response.json()

      if (!data.contents) {
        throw new Error("Failed to fetch content")
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(data.contents, "text/html")

      let title = ""
      let content = ""
      let excerpt = ""
      let publishDate = ""

      // Platform-specific scraping
      switch (platform) {
        case "Medium":
          title = this.scrapeMediumTitle(doc)
          content = this.scrapeMediumContent(doc)
          excerpt = this.scrapeMediumExcerpt(doc)
          publishDate = this.scrapeMediumDate(doc)
          break
        case "Dev.to":
          title = this.scrapeDevToTitle(doc)
          content = this.scrapeDevToContent(doc)
          excerpt = this.scrapeDevToExcerpt(doc)
          publishDate = this.scrapeDevToDate(doc)
          break
        case "Hashnode":
          title = this.scrapeHashnodeTitle(doc)
          content = this.scrapeHashnodeContent(doc)
          excerpt = this.scrapeHashnodeExcerpt(doc)
          publishDate = this.scrapeHashnodeDate(doc)
          break
        default:
          // Generic scraping
          title = this.scrapeGenericTitle(doc)
          content = this.scrapeGenericContent(doc)
          excerpt = this.scrapeGenericExcerpt(doc)
          publishDate = this.scrapeGenericDate(doc)
      }

      // Clean and format content
      content = this.cleanContent(content)
      excerpt = excerpt || this.generateExcerpt(content)

      return {
        title: title || "Untitled Post",
        content,
        excerpt,
        publishDate: publishDate || new Date().toISOString(),
        platform,
        success: true,
      }
    } catch (error) {
      console.error("Content scraping failed:", error)
      return {
        title: "",
        content: "",
        excerpt: "",
        publishDate: "",
        platform: "",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Detect platform from URL
  private static detectPlatform(url: string): string {
    if (url.includes("medium.com") || url.includes("/@")) return "Medium"
    if (url.includes("dev.to")) return "Dev.to"
    if (url.includes("hashnode.")) return "Hashnode"
    if (url.includes("substack.com")) return "Substack"
    if (url.includes("notion.so")) return "Notion"
    return "Other"
  }

  // Medium scraping methods
  private static scrapeMediumTitle(doc: Document): string {
    return (
      doc.querySelector('h1[data-testid="storyTitle"]')?.textContent ||
      doc.querySelector("h1")?.textContent ||
      doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
      ""
    )
  }

  private static scrapeMediumContent(doc: Document): string {
    const article = doc.querySelector("article") || doc.querySelector('[data-testid="storyContent"]')
    if (article) {
      // Remove unwanted elements
      const unwanted = article.querySelectorAll("script, style, .highlight-menu, .js-postMetaLockup")
      unwanted.forEach((el) => el.remove())

      return this.htmlToMarkdown(article.innerHTML)
    }
    return ""
  }

  private static scrapeMediumExcerpt(doc: Document): string {
    return (
      doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
      doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
      ""
    )
  }

  private static scrapeMediumDate(doc: Document): string {
    const timeElement = doc.querySelector("time")
    return timeElement?.getAttribute("datetime") || timeElement?.textContent || ""
  }

  // Dev.to scraping methods
  private static scrapeDevToTitle(doc: Document): string {
    return (
      doc.querySelector("h1.crayons-article__header__title")?.textContent || doc.querySelector("h1")?.textContent || ""
    )
  }

  private static scrapeDevToContent(doc: Document): string {
    const article = doc.querySelector("#article-body") || doc.querySelector(".crayons-article__main")
    if (article) {
      return this.htmlToMarkdown(article.innerHTML)
    }
    return ""
  }

  private static scrapeDevToExcerpt(doc: Document): string {
    return doc.querySelector('meta[name="description"]')?.getAttribute("content") || ""
  }

  private static scrapeDevToDate(doc: Document): string {
    const timeElement = doc.querySelector("time")
    return timeElement?.getAttribute("datetime") || ""
  }

  // Hashnode scraping methods
  private static scrapeHashnodeTitle(doc: Document): string {
    return doc.querySelector("h1.blog-title")?.textContent || doc.querySelector("h1")?.textContent || ""
  }

  private static scrapeHashnodeContent(doc: Document): string {
    const article = doc.querySelector(".blog-content-wrapper") || doc.querySelector("article")
    if (article) {
      return this.htmlToMarkdown(article.innerHTML)
    }
    return ""
  }

  private static scrapeHashnodeExcerpt(doc: Document): string {
    return doc.querySelector('meta[name="description"]')?.getAttribute("content") || ""
  }

  private static scrapeHashnodeDate(doc: Document): string {
    const timeElement = doc.querySelector("time")
    return timeElement?.getAttribute("datetime") || ""
  }

  // Generic scraping methods
  private static scrapeGenericTitle(doc: Document): string {
    return (
      doc.querySelector("h1")?.textContent ||
      doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
      doc.querySelector("title")?.textContent ||
      ""
    )
  }

  private static scrapeGenericContent(doc: Document): string {
    const article = doc.querySelector("article") || doc.querySelector("main") || doc.querySelector(".content")
    if (article) {
      return this.htmlToMarkdown(article.innerHTML)
    }
    return ""
  }

  private static scrapeGenericExcerpt(doc: Document): string {
    return (
      doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
      doc.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
      ""
    )
  }

  private static scrapeGenericDate(doc: Document): string {
    const timeElement = doc.querySelector("time")
    return timeElement?.getAttribute("datetime") || timeElement?.textContent || ""
  }

  // Convert HTML to Markdown
  private static htmlToMarkdown(html: string): string {
    // Simple HTML to Markdown conversion
    const markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n")
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
      .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")
      .replace(/<pre[^>]*>(.*?)<\/pre>/gi, "```\n$1\n```\n")
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)")
      .replace(/<br[^>]*>/gi, "\n")
      .replace(/<[^>]*>/g, "") // Remove remaining HTML tags
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Clean up multiple newlines
      .trim()

    return markdown
  }

  // Generate excerpt from content
  private static generateExcerpt(content: string, maxLength = 200): string {
    const plainText = content
      .replace(/[#*`[\]()]/g, "")
      .replace(/\n+/g, " ")
      .trim()
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  // Clean content
  private static cleanContent(content: string): string {
    return content
      .replace(/\n{3,}/g, "\n\n") // Remove excessive newlines
      .replace(/\s+$/gm, "") // Remove trailing spaces
      .trim()
  }
}
