// Advanced Content Scraper with AI-powered content extraction
export class AdvancedContentScraper {
  private static readonly CORS_PROXIES = [
    "https://api.allorigins.win/get?url=",
    "https://cors-anywhere.herokuapp.com/",
    "https://thingproxy.freeboard.io/fetch/",
  ]

  // Main scraping function
  static async scrapeContent(url: string): Promise<{
    title: string
    content: string
    excerpt: string
    publishDate: string
    platform: string
    author: string
    tags: string[]
    readTime: number
    success: boolean
    error?: string
  }> {
    try {
      const platform = this.detectPlatform(url)
      console.log(`Scraping content from ${platform}: ${url}`)

      // Try multiple CORS proxies
      let htmlContent = ""
      for (const proxy of this.CORS_PROXIES) {
        try {
          const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          })

          if (response.ok) {
            const data = await response.json()
            htmlContent = data.contents || data
            break
          }
        } catch (error) {
          console.warn(`Proxy ${proxy} failed:`, error)
          continue
        }
      }

      if (!htmlContent) {
        throw new Error("Failed to fetch content from all proxies")
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, "text/html")

      let scrapedData = {
        title: "",
        content: "",
        excerpt: "",
        publishDate: "",
        author: "",
        tags: [] as string[],
        readTime: 0,
      }

      // Platform-specific scraping
      switch (platform) {
        case "Medium":
          scrapedData = this.scrapeMedium(doc)
          break
        case "Dev.to":
          scrapedData = this.scrapeDevTo(doc)
          break
        case "Hashnode":
          scrapedData = this.scrapeHashnode(doc)
          break
        case "Substack":
          scrapedData = this.scrapeSubstack(doc)
          break
        case "Notion":
          scrapedData = this.scrapeNotion(doc)
          break
        case "LinkedIn":
          scrapedData = this.scrapeLinkedIn(doc)
          break
        default:
          scrapedData = this.scrapeGeneric(doc)
      }

      // Clean and enhance content
      scrapedData.content = this.cleanContent(scrapedData.content)
      scrapedData.excerpt = scrapedData.excerpt || this.generateExcerpt(scrapedData.content)
      scrapedData.readTime = scrapedData.readTime || this.calculateReadTime(scrapedData.content)
      scrapedData.tags = this.extractTags(scrapedData.content, scrapedData.title)

      return {
        ...scrapedData,
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
        author: "",
        tags: [],
        readTime: 0,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Detect platform from URL
  private static detectPlatform(url: string): string {
    const hostname = new URL(url).hostname.toLowerCase()

    if (hostname.includes("medium.com") || url.includes("/@")) return "Medium"
    if (hostname.includes("dev.to")) return "Dev.to"
    if (hostname.includes("hashnode.")) return "Hashnode"
    if (hostname.includes("substack.com")) return "Substack"
    if (hostname.includes("notion.so") || hostname.includes("notion.site")) return "Notion"
    if (hostname.includes("linkedin.com")) return "LinkedIn"
    if (hostname.includes("github.com")) return "GitHub"
    if (hostname.includes("stackoverflow.com")) return "Stack Overflow"

    return "Other"
  }

  // Medium scraping
  private static scrapeMedium(doc: Document): any {
    return {
      title: this.getTextContent(doc, [
        'h1[data-testid="storyTitle"]',
        "h1.graf--title",
        "h1",
        'meta[property="og:title"]',
      ]),
      content: this.getArticleContent(doc, ["article", '[data-testid="storyContent"]', ".postArticle-content"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]", '[data-testid="storyPublishDate"]']),
      author: this.getTextContent(doc, ['[data-testid="authorName"]', ".author-name", 'meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // Dev.to scraping
  private static scrapeDevTo(doc: Document): any {
    return {
      title: this.getTextContent(doc, ["h1.crayons-article__header__title", "h1", 'meta[property="og:title"]']),
      content: this.getArticleContent(doc, ["#article-body", ".crayons-article__main", "article"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]", ".crayons-article__subheader time"]),
      author: this.getTextContent(doc, [".crayons-article__subheader a", 'meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // Hashnode scraping
  private static scrapeHashnode(doc: Document): any {
    return {
      title: this.getTextContent(doc, ["h1.blog-title", "h1", 'meta[property="og:title"]']),
      content: this.getArticleContent(doc, [".blog-content-wrapper", "article", ".post-content"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]", ".blog-date"]),
      author: this.getTextContent(doc, [".blog-author", 'meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // Substack scraping
  private static scrapeSubstack(doc: Document): any {
    return {
      title: this.getTextContent(doc, ["h1.post-title", "h1", 'meta[property="og:title"]']),
      content: this.getArticleContent(doc, [".available-content", "article", ".post-content"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]", ".post-date"]),
      author: this.getTextContent(doc, [".byline-names", 'meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // Notion scraping
  private static scrapeNotion(doc: Document): any {
    return {
      title: this.getTextContent(doc, ["h1.notion-header-block", "h1", "title"]),
      content: this.getArticleContent(doc, [".notion-page-content", "main", "article"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]"]),
      author: this.getTextContent(doc, ['meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // LinkedIn scraping
  private static scrapeLinkedIn(doc: Document): any {
    return {
      title: this.getTextContent(doc, ["h1", 'meta[property="og:title"]']),
      content: this.getArticleContent(doc, [".article-content", "article", "main"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]"]),
      author: this.getTextContent(doc, [".author-info", 'meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // Generic scraping
  private static scrapeGeneric(doc: Document): any {
    return {
      title: this.getTextContent(doc, ["h1", 'meta[property="og:title"]', "title"]),
      content: this.getArticleContent(doc, ["article", "main", ".content", ".post-content", ".entry-content"]),
      excerpt: this.getMetaContent(doc, ['meta[name="description"]', 'meta[property="og:description"]']),
      publishDate: this.getDateTime(doc, ["time[datetime]", ".date", ".published"]),
      author: this.getTextContent(doc, [".author", ".byline", 'meta[name="author"]']),
      readTime: this.extractReadTime(doc.body.textContent || ""),
    }
  }

  // Helper methods
  private static getTextContent(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      if (selector.startsWith("meta[")) {
        const meta = doc.querySelector(selector) as HTMLMetaElement
        if (meta?.content) return meta.content
      } else {
        const element = doc.querySelector(selector)
        if (element?.textContent?.trim()) return element.textContent.trim()
      }
    }
    return ""
  }

  private static getMetaContent(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      const meta = doc.querySelector(selector) as HTMLMetaElement
      if (meta?.content) return meta.content
    }
    return ""
  }

  private static getDateTime(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      const element = doc.querySelector(selector) as HTMLTimeElement
      if (element?.dateTime) return element.dateTime
      if (element?.textContent) {
        const date = new Date(element.textContent)
        if (!isNaN(date.getTime())) return date.toISOString()
      }
    }
    return new Date().toISOString()
  }

  private static getArticleContent(doc: Document, selectors: string[]): string {
    for (const selector of selectors) {
      const element = doc.querySelector(selector)
      if (element) {
        // Remove unwanted elements
        const unwanted = element.querySelectorAll(
          "script, style, .highlight-menu, .js-postMetaLockup, .social-share, .comments, nav, header, footer, .sidebar, .ads",
        )
        unwanted.forEach((el) => el.remove())

        return this.htmlToMarkdown(element.innerHTML)
      }
    }
    return ""
  }

  // Convert HTML to Markdown with better formatting
  private static htmlToMarkdown(html: string): string {
    return (
      html
        // Headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n")
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n")

        // Paragraphs
        .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")

        // Text formatting
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
        .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
        .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
        .replace(/<u[^>]*>(.*?)<\/u>/gi, "_$1_")

        // Code
        .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")
        .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, "```\n$1\n```\n")
        .replace(/<pre[^>]*>(.*?)<\/pre>/gi, "```\n$1\n```\n")

        // Links and images
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, "![$2]($1)")
        .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, "![]($1)")

        // Lists
        .replace(/<ul[^>]*>(.*?)<\/ul>/gi, "$1\n")
        .replace(/<ol[^>]*>(.*?)<\/ol>/gi, "$1\n")
        .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")

        // Blockquotes
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n\n")

        // Line breaks
        .replace(/<br[^>]*>/gi, "\n")
        .replace(/<hr[^>]*>/gi, "\n---\n\n")

        // Remove remaining HTML tags
        .replace(/<[^>]*>/g, "")

        // Clean up whitespace
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .replace(/^\s+|\s+$/g, "")
        .trim()
    )
  }

  // Generate excerpt from content
  private static generateExcerpt(content: string, maxLength = 200): string {
    const plainText = content
      .replace(/[#*`[\]()]/g, "")
      .replace(/\n+/g, " ")
      .trim()

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  // Calculate read time
  private static calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  // Extract read time from content
  private static extractReadTime(content: string): number {
    const readTimeMatch = content.match(/(\d+)\s*min(?:ute)?s?\s*read/i)
    return readTimeMatch ? Number.parseInt(readTimeMatch[1]) : this.calculateReadTime(content)
  }

  // Extract tags from content and title
  private static extractTags(content: string, title: string): string[] {
    const text = `${title} ${content}`.toLowerCase()
    const commonTags = [
      "javascript",
      "python",
      "react",
      "nodejs",
      "typescript",
      "css",
      "html",
      "cybersecurity",
      "security",
      "hacking",
      "penetration testing",
      "ai",
      "machine learning",
      "artificial intelligence",
      "ml",
      "web development",
      "frontend",
      "backend",
      "fullstack",
      "tutorial",
      "guide",
      "tips",
      "best practices",
      "programming",
      "coding",
      "development",
      "software",
    ]

    return commonTags.filter((tag) => text.includes(tag) || text.includes(tag.replace(/\s+/g, ""))).slice(0, 5)
  }

  // Clean content
  private static cleanContent(content: string): string {
    return content
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s+$/gm, "")
      .replace(/^\s*\n/gm, "")
      .trim()
  }
}
