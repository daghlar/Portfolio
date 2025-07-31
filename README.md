# Daghlar Mammadov Portfolio

A comprehensive, modern, and highly interactive personal portfolio for Daghlar Mammadov—Computer Engineering Student, Cybersecurity Expert, Software Developer, and AI Enthusiast.

---

## 🚀 Overview
This portfolio is a feature-rich, fully responsive web application designed to showcase Daghlar's professional journey, projects, skills, certifications, and thought leadership. Built with **Next.js** and **Tailwind CSS**, it leverages advanced UI components, real-time admin features, and a modular, scalable architecture.

---

## 🗂️ Project Structure

```
portfolio/
├── app/                # Main application pages (Home, About, Projects, Blog, Certificates, Contact, etc.)
│   ├── about/          # About page and personal/professional background
│   ├── blog/           # Blog post listing and detail pages
│   ├── certificates/   # Certifications, filtering, and stats
│   ├── contact/        # Contact form, social links, contact info
│   ├── projects/       # Projects showcase, real-time updates
│   ├── globals.css     # Main global styles
│   ├── layout.tsx      # Root layout, metadata, theme provider
│   ├── metadata.ts     # SEO and metadata configuration
│   └── page.tsx        # Home page (landing)
├── components/         # Reusable React components (UI, Admin Panels, Sidebar, etc.)
│   ├── admin-panel.tsx           # Main admin dashboard (real-time, secure)
│   ├── enhanced-admin-panel.tsx  # Advanced admin features
│   ├── responsive-admin-panel.tsx# Mobile-optimized admin
│   ├── sidebar.tsx               # Sidebar navigation
│   ├── social-ticker.tsx         # Social media ticker
│   ├── ui/                       # 50+ custom UI components (buttons, cards, modals, forms, etc.)
├── hooks/              # Custom React hooks (e.g., use-toast, use-mobile)
├── lib/                # Utility libraries (admin storage, real-time sync, security, etc.)
├── public/             # Static assets (images, manifest, icons, robots.txt, etc.)
├── styles/             # Tailwind and global styles
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

---

## 🌟 Key Features

- **Stunning UI/UX:**
  - Modern, dark-themed, and mobile-first design
  - Animated backgrounds, unified containers, and smooth transitions
  - Highly accessible and SEO-optimized

- **Dynamic Content:**
  - Real-time admin panel for managing projects, certificates, blog posts, and site content
  - Content updates reflected instantly via local storage and real-time listeners

- **Personalized Sections:**
  - **About:** Detailed biography, technical skills (frontend, backend, AI, security), language proficiencies, education, and community leadership
  - **Projects:** Interactive project cards, GitHub/demo links, tags, and real-time updates
  - **Certificates:** Advanced filtering, categorization, expiry tracking, and verification links
  - **Blog:** Markdown-driven articles with code highlighting, categories, and navigation
  - **Contact:** Contact form, social links (ProtonMail, Matrix, GitHub, Bluesky), and location info

- **Advanced Admin Tools:**
  - Multiple admin panel variants (standard, enhanced, responsive, comprehensive)
  - Security logs, analytics, and content management
  - Access via hidden triggers and multi-click logic for extra security

- **Reusable UI Library:**
  - 50+ custom components (buttons, forms, modals, tooltips, charts, carousels, etc.)
  - Built on Radix UI primitives for accessibility and consistency

- **Technical Stack:**
  - **Next.js** (App Router, SSR, API routes)
  - **Tailwind CSS** (utility-first styling)
  - **TypeScript** (strict typing)
  - **Radix UI** (accessible primitives)
  - **React Hooks** (custom hooks for state, toasts, mobile detection)
  - **Real-time Data Sync** (AdminStorage, RealTimeManager)
  - **Security Enhancements** (role-based access, logs, password protection)

---

## 🛠️ Technologies & Libraries
- `next`, `react`, `typescript`, `tailwindcss`, `@radix-ui/*`, `zod`, `recharts`, `date-fns`, `embla-carousel-react`, `sonner`, and more.

---

## 📦 Usage

### Development
```bash
pnpm install   # or npm install / yarn install
pnpm dev       # or npm run dev / yarn dev
```

### Production
```bash
pnpm build     # or npm run build / yarn build
pnpm start     # or npm run start / yarn start
```

### Admin Access
- Trigger the admin panel by clicking the logo 4 times in the sidebar (desktop) or mobile menu.
- Manage projects, certificates, blog posts, and site content in real time.

---

## 🔒 Security & Best Practices
- Role-based admin access and hidden triggers
- Security logs and analytics
- Data never leaves your browser unless you deploy it
- No hardcoded secrets; all sensitive data is handled securely

---

## 📁 Notable Code Highlights
- **Dynamic Content Management:** All main sections (projects, blog, certificates) are managed via real-time admin panels and local storage sync.
- **Custom UI Components:** 50+ reusable, accessible components for rapid development and consistent UX.
- **Advanced Filtering & Categorization:** Especially in certificates and projects, with multi-dimensional filtering and stats.
- **Localization Ready:** Structure supports easy addition of new languages.

---

## 👤 Author
**Daghlar Mammadov**  
Computer Engineering Student, Cybersecurity Expert, Software Developer, AI Enthusiast
- [GitHub](https://github.com/xdaghlar)
- [Matrix](https://matrix.to/#/@xdaghlar:matrix.org)
- [Bluesky](https://bsky.app/profile/xdaghlar.bsky.social)
- [Email](mailto:daghlar@protonmail.com)

---

## 📄 License
This project is open source under the MIT License.

---

For questions, collaboration, or feedback, please reach out via email or social links above. Thank you for visiting this portfolio!
