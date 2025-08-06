# SecureVault - Password Manager

A modern, secure password management application built with Next.js, TypeScript, and ClerkJS for authentication.

## Features

- 🔐 **Secure Authentication** - Powered by ClerkJS
- 🎨 **Modern UI** - Beautiful, responsive design with Framer Motion animations
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **Fast Performance** - Built with Next.js 15 and React 19
- 🎯 **Smart Routing** - Automatic redirection based on authentication status

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard route for authenticated users
│   ├── layout.tsx            # Root layout with ClerkJS provider
│   └── page.tsx              # Home page with authentication routing
├── components/
│   ├── layout/
│   │   ├── Footer.tsx        # Footer component
│   │   └── Navbar.tsx        # Navigation bar with auth buttons
│   ├── pages/
│   │   ├── Dashboard.tsx     # Dashboard component for authenticated users
│   │   └── LandingPage.tsx   # Landing page component for unauthenticated users
│   ├── sections/
│   │   ├── CTASection.tsx    # Call-to-action section
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── PricingSection.tsx
│   │   └── SecuritySection.tsx
│   └── ui/
│       ├── button.tsx        # Reusable button component
│       └── card.tsx          # Reusable card component
├── lib/
│   └── utils.ts              # Utility functions
└── middleware.ts             # ClerkJS middleware configuration
```

## Authentication Flow

1. **Unauthenticated Users** (`/`):
   - See the landing page with all marketing sections
   - Can sign up or sign in using ClerkJS modals
   - Navbar shows "Sign In" and "Sign Up" buttons

2. **Authenticated Users** (`/`):
   - Automatically redirected to `/dashboard`
   - See the dashboard with password management features
   - Navbar shows "Dashboard" link and UserButton

3. **Dashboard Route** (`/dashboard`):
   - Protected route that requires authentication
   - Unauthenticated users are redirected to home
   - Shows password management interface

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up ClerkJS:**
   - Create a ClerkJS account
   - Add your environment variables to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **ClerkJS** - Authentication
- **React Icons** - Icon library
- **Radix UI** - UI primitives

## Development

- **Landing Page**: `src/components/pages/LandingPage.tsx`
- **Dashboard**: `src/components/pages/Dashboard.tsx`
- **Authentication**: Handled by ClerkJS in `src/app/layout.tsx`
- **Routing**: `src/app/page.tsx` and `src/app/dashboard/page.tsx`

## Folder Structure Improvements

The project has been reorganized with:

- **`src/components/pages/`** - Page-level components
- **`src/components/sections/`** - Landing page sections
- **`src/components/layout/`** - Layout components
- **`src/components/ui/`** - Reusable UI components

This structure provides better separation of concerns and makes the codebase more maintainable.
