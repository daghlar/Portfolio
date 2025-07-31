"use client"

import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  date: string
  readTime: string
  category: string
  author: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Advanced Cybersecurity Techniques for Modern Applications",
    excerpt:
      "Exploring cutting-edge security practices to protect applications from emerging threats and vulnerabilities.",
    content: `
# Advanced Cybersecurity Techniques for Modern Applications

In today's rapidly evolving digital landscape, cybersecurity has become more critical than ever. As applications become more complex and interconnected, the attack surface expands, creating new opportunities for malicious actors.

## Understanding Modern Threats

Modern applications face a variety of sophisticated threats:

### 1. Advanced Persistent Threats (APTs)
APTs are prolonged and targeted cyberattacks where an intruder gains access to a network and remains undetected for an extended period. These attacks are particularly dangerous because they're designed to steal data rather than cause damage to the network or organization.

### 2. Zero-Day Exploits
These are attacks that occur on the same day a weakness is discovered in software. At that point, it's exploited before a fix becomes available from its creator.

### 3. AI-Powered Attacks
Artificial intelligence is increasingly being used by cybercriminals to automate attacks, making them more efficient and harder to detect.

## Defensive Strategies

### Multi-Factor Authentication (MFA)
Implementing robust MFA systems is crucial. This includes:
- Something you know (password)
- Something you have (token/phone)
- Something you are (biometric)

### Zero Trust Architecture
Never trust, always verify. This security model requires strict identity verification for every person and device trying to access resources on a private network.

### Continuous Monitoring
Real-time monitoring and analysis of network traffic, user behavior, and system activities to detect anomalies and potential threats.

## Implementation Best Practices

1. **Regular Security Audits**: Conduct comprehensive security assessments regularly
2. **Employee Training**: Keep staff updated on the latest security threats and best practices
3. **Incident Response Planning**: Have a clear plan for responding to security incidents
4. **Data Encryption**: Encrypt sensitive data both at rest and in transit

## Conclusion

Cybersecurity is not a one-time implementation but an ongoing process. As threats evolve, so must our defensive strategies. By staying informed about the latest threats and implementing robust security measures, organizations can significantly reduce their risk of falling victim to cyberattacks.

The key is to maintain a proactive approach, continuously updating and improving security measures to stay ahead of potential threats.
    `,
    date: "July 15, 2023",
    readTime: "8 min read",
    category: "Cybersecurity",
    author: "Daghlar Mammadov",
  },
  {
    id: 2,
    title: "Building Efficient Systems with Rust: Performance and Safety",
    excerpt:
      "How Rust's unique features enable the development of high-performance systems with memory safety guarantees.",
    content: `
# Building Efficient Systems with Rust: Performance and Safety

Rust has emerged as a game-changing programming language that combines the performance of low-level languages like C and C++ with the safety guarantees typically found in higher-level languages.

## Why Rust?

### Memory Safety Without Garbage Collection
Rust's ownership system prevents common programming errors such as:
- Buffer overflows
- Use-after-free errors
- Data races
- Memory leaks

### Zero-Cost Abstractions
Rust's abstractions compile down to the same assembly you'd get from hand-optimized C code, meaning you don't sacrifice performance for safety.

## Key Features

### Ownership System
The ownership system is Rust's most unique feature:

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2
    // println!("{}", s1); // This would cause a compile error
    println!("{}", s2); // This works fine
}
\`\`\`

### Pattern Matching
Rust's pattern matching is powerful and exhaustive:

\`\`\`rust
match result {
    Ok(value) => println!("Success: {}", value),
    Err(error) => println!("Error: {}", error),
}
\`\`\`

## Performance Characteristics

### Compile-Time Optimizations
Rust's compiler performs aggressive optimizations:
- Dead code elimination
- Inlining
- Loop unrolling
- SIMD vectorization

### Runtime Performance
Benchmarks consistently show Rust performing on par with C and C++ while providing memory safety guarantees.

## Real-World Applications

### System Programming
- Operating systems (Redox OS)
- Web browsers (Firefox's Servo engine)
- Game engines
- Blockchain implementations

### Web Development
- High-performance web servers
- WebAssembly applications
- API backends

## Best Practices

1. **Embrace the Borrow Checker**: Don't fight it, learn from it
2. **Use Cargo**: Rust's package manager and build system
3. **Write Tests**: Rust makes testing easy and idiomatic
4. **Profile Your Code**: Use tools like \`perf\` and \`flamegraph\`

## Conclusion

Rust represents a significant step forward in systems programming, offering the performance needed for critical applications while preventing entire classes of bugs at compile time. As the ecosystem continues to mature, Rust is becoming an increasingly attractive option for developers who need both performance and reliability.
    `,
    date: "June 28, 2023",
    readTime: "12 min read",
    category: "Programming",
    author: "Daghlar Mammadov",
  },
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === Number.parseInt(params.id))

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Blog yazısı bulunamadı</h1>
          <Link href="/blog" className="text-blue-400 hover:text-blue-300">
            Blog sayfasına dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Sidebar />

      {/* Background */}
      <div className="fixed inset-0 grid-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900/10 to-black" />

      <div className="lg:ml-20 p-4 sm:p-8 lg:p-16 relative z-10 pt-20 lg:pt-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 sm:mb-12 lg:mb-16 transition-smooth group"
        >
          <ArrowLeft className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-2 transition-smooth" />
          <span className="font-light text-sm sm:text-base">Back to blog</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-gray-800/30 border border-gray-700/50 rounded-full text-sm font-light backdrop-blur-sm text-gray-300">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-thin mb-8 tracking-wide leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="unified-container rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 animate-fade-in-up">
            <div className="prose prose-invert prose-lg max-w-none">
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .split("\n")
                    .map((line) => {
                      if (line.startsWith("# ")) {
                        return `<h1 class="text-3xl font-light mb-6 mt-8 text-white">${line.substring(2)}</h1>`
                      } else if (line.startsWith("## ")) {
                        return `<h2 class="text-2xl font-light mb-4 mt-6 text-white">${line.substring(3)}</h2>`
                      } else if (line.startsWith("### ")) {
                        return `<h3 class="text-xl font-light mb-3 mt-4 text-white">${line.substring(4)}</h3>`
                      } else if (line.startsWith("```")) {
                        return line.includes("```") && !line.startsWith("```")
                          ? `<pre class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 my-4 overflow-x-auto"><code>${line}</code></pre>`
                          : line.startsWith("```")
                            ? '<pre class="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 my-4 overflow-x-auto"><code>'
                            : "</code></pre>"
                      } else if (line.trim() === "") {
                        return "<br>"
                      } else if (line.startsWith("- ")) {
                        return `<li class="mb-2">${line.substring(2)}</li>`
                      } else if (/^\d+\./.test(line)) {
                        return `<li class="mb-2">${line.replace(/^\d+\.\s*/, "")}</li>`
                      } else {
                        return `<p class="mb-4 leading-relaxed">${line}</p>`
                      }
                    })
                    .join(""),
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center animate-fade-in-up">
            <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white transition-smooth">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tüm yazılar
            </Link>

            <div className="flex gap-4">
              {post.id > 1 && (
                <Link
                  href={`/blog/${post.id - 1}`}
                  className="px-4 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 transition-smooth"
                >
                  Önceki
                </Link>
              )}
              {post.id < blogPosts.length && (
                <Link
                  href={`/blog/${post.id + 1}`}
                  className="px-4 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:bg-gray-700/30 transition-smooth"
                >
                  Sonraki
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
