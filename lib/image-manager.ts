// Advanced Image Management System
export class ImageManager {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private static readonly ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
  private static readonly COMPRESSION_QUALITY = 0.8

  // Upload and process image
  static async uploadImage(file: File, category: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Compress image if needed
      const processedFile = await this.compressImage(file)

      // Convert to base64 for storage
      const base64 = await this.fileToBase64(processedFile)

      // Generate unique filename
      const filename = this.generateFilename(file.name, category)

      // Store in localStorage (simulating file storage)
      const imageData = {
        filename,
        base64,
        originalName: file.name,
        size: processedFile.size,
        type: processedFile.type,
        category,
        uploadedAt: new Date().toISOString(),
      }

      // Save to image storage
      const images = JSON.parse(localStorage.getItem("uploaded_images") || "{}")
      images[filename] = imageData
      localStorage.setItem("uploaded_images", JSON.stringify(images))

      return { success: true, url: `/api/images/${filename}` }
    } catch (error) {
      console.error("Image upload failed:", error)
      return { success: false, error: "Upload failed. Please try again." }
    }
  }

  // Validate file
  private static validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only JPG, PNG, WebP, and SVG files are allowed.",
      }
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      }
    }

    return { valid: true }
  }

  // Compress image
  private static async compressImage(file: File): Promise<File> {
    if (file.type === "image/svg+xml") {
      return file // Don't compress SVG
    }

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        const maxWidth = 1920
        const maxHeight = 1080
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          file.type,
          this.COMPRESSION_QUALITY,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Convert file to base64
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Generate unique filename
  private static generateFilename(originalName: string, category: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split(".").pop()
    return `${category}_${timestamp}_${random}.${extension}`
  }

  // Get image URL
  static getImageUrl(filename: string): string {
    const images = JSON.parse(localStorage.getItem("uploaded_images") || "{}")
    const image = images[filename]

    if (image) {
      return image.base64
    }

    return "/placeholder.svg?height=400&width=600&text=Image+Not+Found"
  }

  // Delete image
  static deleteImage(filename: string): boolean {
    try {
      const images = JSON.parse(localStorage.getItem("uploaded_images") || "{}")
      delete images[filename]
      localStorage.setItem("uploaded_images", JSON.stringify(images))
      return true
    } catch (error) {
      console.error("Failed to delete image:", error)
      return false
    }
  }

  // Get all images by category
  static getImagesByCategory(category: string): any[] {
    const images = JSON.parse(localStorage.getItem("uploaded_images") || "{}")
    return Object.values(images).filter((img: any) => img.category === category)
  }

  // Get image gallery for content
  static getImageGallery(contentId: string): string[] {
    const galleries = JSON.parse(localStorage.getItem("image_galleries") || "{}")
    return galleries[contentId] || []
  }

  // Update image gallery for content
  static updateImageGallery(contentId: string, imageFilenames: string[]): void {
    const galleries = JSON.parse(localStorage.getItem("image_galleries") || "{}")
    galleries[contentId] = imageFilenames
    localStorage.setItem("image_galleries", JSON.stringify(galleries))
  }

  // Optimize images for web
  static async optimizeForWeb(file: File): Promise<File> {
    if (file.type === "image/svg+xml") {
      return file
    }

    // Convert to WebP if supported
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Try WebP first
        canvas.toBlob(
          (webpBlob) => {
            if (webpBlob && webpBlob.size < file.size) {
              const webpFile = new File([webpBlob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                type: "image/webp",
                lastModified: Date.now(),
              })
              resolve(webpFile)
            } else {
              // Fallback to original compression
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const compressedFile = new File([blob], file.name, {
                      type: file.type,
                      lastModified: Date.now(),
                    })
                    resolve(compressedFile)
                  } else {
                    resolve(file)
                  }
                },
                file.type,
                0.85,
              )
            }
          },
          "image/webp",
          0.85,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }
}
