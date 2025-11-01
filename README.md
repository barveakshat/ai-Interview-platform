# PrepTrack

**PrepTrack** is an AI-powered interview platform that automates the creation, scheduling, and execution of technical interviews. Leveraging modern web technologies and AI/voice services, PrepTrack offers a seamless experience for recruiters and candidates alike.

---

## 🚀 Tech Stack

- **Next.js 15** (App Router) — Server-side rendering, dynamic routes, API routes
- **React** — Client-side UI
- **Tailwind CSS** & **ShadCN UI** — Utility-first styling and component library
- **Supabase** — Authentication, PostgreSQL database, CRUD operations
- **Vapi.ai** — AI voice assistant (interview conductor)
- **Lucide Icons** & **React-Icons** — SVG iconography
- **Framer Motion** — Animations for smooth UI transitions
- **Sonner** — Toast notifications
- **PNPM** — Fast package management
- **Docker** — Containerization for consistent deployment

---

## Docker Image

Build and push your own image (example shown below). You can also deploy without Docker using pnpm directly.

## 🧭 Project Flow & User Guide

### 1. Landing & Authentication

- Open your deployed URL (for local dev: `http://localhost:3000`)
- Click **Sign in** on the landing page
- Log in using **Google** or **GitHub** (via Supabase)
- Upon success, you're redirected to your **Dashboard**

### 2. Dashboard Overview

From here, you can:

- Create new interviews (`/dashboard/create-interview`)
- View all interviews (`/all-interviews`)
- View interview feedbacks (`/scheduled-interviews`)

### 3. Creating an Interview

**Route:** `/dashboard/create-interview`

- **Step 1:** Enter job details (title, description, duration)
- **Step 2:** AI generates questions.
- **Step 3:** Review and save questions — a unique **Interview ID** and **URL** are created

### 4. Managing Interviews

**Route:** `/all-interviews`

- View all created interviews
- Copy and share interview links

### 5. Schedule & Feedback

**Route:** `/scheduled-interviews`

- View completed interviews along with feedback
- Delete interviews via smooth UI interactions

### 6. Conducting a Live Interview

**Route:** `/interview/[id]/start`

- Vapi.ai conducts the voice interview session
- The AI asks questions, transcribes answers, and ends the session
- Feedback is generated and saved
- Redirects user to the completed screen

### 7. Viewing Completed Feedback

**Route:** `/interview/[id]/completed`

- Displays summary and analysis
- Guides you on potential next steps

---

## 📁 Project Structure

```
preptrack/
├─ app/
│  ├─ (main)/dashboard/        # Protected dashboard routes
│  │   ├─ create-interview/     # Interview creation flow
│  │   ├─ _components/          # Shared UI components
│  │   └─ page.jsx              # Dashboard landing
│  ├─ (main)/all-interviews/    # List all interviews
│  ├─ (main)/scheduled-interviews/ # Interviews with feedback
│  ├─ (main)/layout.js          # Nested layouts + provider
│  ├─ auth/page.jsx             # OAuth login page
│  ├─ interview/[id]/start/     # Live interview session
│  ├─ interview/[id]/completed/ # Interview completed screen
│  └─ provider.jsx              # Supabase auth wrapper & context
├─ components/                  # Shared Shadcn UI components
├─ services/                    # API clients (Supabase, Constants)
├─ public/                      # Static assets
├─ styles/                      # Global CSS and Tailwind config
├─ Dockerfile.dev/              # Docker configuration files
├─ Dockerfile                   # Docker image configuration
├─ docker-compose.yml           # Multi-container setup
├─ docker-compose.dev.yml       # Multi-container setup for hot reload
├─ .dockerignore               # Docker ignore patterns
├─ next.config.mjs              # Next.js config
└─ package.json                 # Scripts & dependencies
```

---

## ⚙️ Installation & Setup

### Option 1: Traditional Setup

1. **Clone the repo**

```bash
git clone https://github.com/arnishbaruah/ai-Interview-platform.git
cd ai-Interview-platform
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**
   Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_VAPI_PUBLIC_KEY=<your_vapi_key>
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_KEY=<your_supabase_anon_key>
```

4. **Run development server**

```bash
pnpm run dev
```

5. **Open in browser**
   Go to `http://localhost:3000`

### Option 2: Docker Setup

#### Prerequisites

- Docker installed on your machine
- Docker Compose (usually comes with Docker Desktop)

#### Quick Start with Docker

1. **Clone the repo**

```bash
git clone https://github.com/arnishbaruah/ai-Interview-platform.git
cd ai-Interview-platform
```

2. **Configure environment variables**
   Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_superbase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENROUTER_API_KEY=your_router_key
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_key
NEXT_PUBLIC_HOST_URL=http://localhost:3000/interview
NEXT_PUBLIC_SITE_URL=http://localhost:3000

```

3. **Build and run with Docker Compose (recommended)**

- For local development:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- For local working:

```bash
export $(grep -v '^#' .env.local | xargs)
docker-compose -f docker-compose.yml up --build -d
```

4. **Access the application**
   Open `http://localhost:3000` in your browser

**Stop all containers:**

```bash
docker-compose down
```

**View logs:**

```bash
docker-compose logs -f
```

---

## 🐳 Docker Configuration

### Dockerfile Features

- Multi-stage build for optimized image size
- Node.js 18 Alpine base image
- Automatic dependency caching
- Production-ready configuration
- Health checks included

### Docker Compose Services

- **app**: Main Next.js application
- **nginx** (optional): Reverse proxy for production
- Volume mounting for development
- Environment variable management
- Hot reload support in development mode
  
---

## 📈 Deployment

### Traditional Deployment

1. **Build the app**

```bash
pnpm run build
```

2. **Start in production**

```bash
pnpm run start
```

### Docker Deployment

#### Local Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Cloud Deployment Options

**1. Docker Hub + Cloud Provider:**

```bash
# Build and push to Docker Hub
docker build -t yourusername/preptrack:latest .
docker push yourusername/preptrack:latest

# Deploy on any cloud provider supporting Docker
```

**2. Container Registry:**

- AWS ECR + ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

**3. Platform-as-a-Service:**

- Vercel (recommended for Next.js)
- Netlify
- Railway
- Render

### Environment Variables for Production

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_VAPI_PUBLIC_KEY=<your_production_vapi_key>
NEXT_PUBLIC_SUPABASE_URL=<your_production_supabase_url>
NEXT_PUBLIC_SUPABASE_KEY=<your_production_supabase_key>
NODE_ENV=production
```

---

## 🔧 Development

### Docker Development Workflow

1. **Start development environment:**

```bash
docker-compose up
```

2. **Install new dependencies:**

```bash
docker-compose exec app pnpm add <package-name>
```

3. **Run commands inside container:**

```bash
docker-compose exec app pnpm run <script>
```

4. **Access container shell:**

```bash
docker-compose exec app sh
```

### Debugging

**View application logs:**

```bash
docker-compose logs app
```

**Monitor container resources:**

```bash
docker stats
```

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for backend services
- [Vapi.ai](https://vapi.ai/) for AI voice capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [ShadCN UI](https://ui.shadcn.com/) for beautiful components


