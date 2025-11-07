# SecureVault - Password Manager

A modern, secure password management application built with Next.js, TypeScript, and ClerkJS for authentication. Features zero-knowledge encryption, secure password storage, and credit card management.

## Key Features

- 🔐 **Zero-Knowledge Encryption** - Client-side encryption using CryptoJS/AES-256
- 🎨 **Modern UI** - Responsive design with Tailwind CSS and Framer Motion animations 
- 🔑 **Password Management** - Store, generate, and organize passwords securely
- 💳 **Credit Card Storage** - Encrypted storage for credit card information
- 🔒 **Master Password** - Additional encryption layer for sensitive data
- 🎯 **Role-based Access** - Secure authentication powered by ClerkJS
- 📱 **Mobile Responsive** - Optimized for all devices with mobile navigation

## Project Structure

```
src/
├── actions/
│ └── actions.ts             # Server actions for master password management
├── app/
│ ├── user/                  # Protected user routes
│ │ ├── dashboard/
│ │ ├── passwords/
│ │ ├── credit-cards/
│ │ ├── password-generator/
│ │ └── settings/
│ ├── sign-in/               # Authentication routes
│ ├── sign-up/
│ └── layout.tsx             # Root layout with ClerkJS provider
├── components/
│ ├── core/
│ │ ├── dashboard/           # Dashboard-specific components
│ │ └── landing-page/        # Landing page sections
│ ├── layout/                # Layout components (Navbar, Sidebar, etc.)
│ ├── pages/                 # Main page components
│ └── ui/                    # Reusable UI components
├── lib/
│ ├── api-client.ts          # Axios instance for API calls
│ ├── encryption-client.ts   # Encryption utilities
│ └── utils.ts               # Helper functions
└── middleware.ts            # ClerkJS auth middleware
```

## Key Sections

1. **Authentication**
   - Secure sign-in/sign-up powered by ClerkJS
   - Protected routes and API endpoints
   - Master password management for additional security

2. **Password Management**
   - CRUD operations for passwords
   - Client-side encryption/decryption
   - Password strength evaluation
   - Custom password generator with configurable settings

3. **Credit Card Management**
   - Secure storage of credit card details
   - End-to-end encryption
   - Card number validation (Luhn algorithm)
   - Category organization

4. **User Dashboard**
   - Overview of stored items
   - Quick actions for common tasks
   - Security tips and recommendations
   - Settings management


## Technologies Used

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Express.js, MongoDB, Mongoose
- **Authentication**: ClerkJS
- **Encryption**: CryptoJS (AES-256)
- **State Management**: React Hooks
- **Form Handling**: React Hook Form, Zod
- **UI Components**: Radix UI primitives
- **Icons**: React Icons, Lucide Icons

## Development

1. **Install dependencies:**
   ```bash
   npm install
   cd server && npm install
   ```

2. **Environment Setup:**
   - Create `.env.local` in root:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   ```
   - Create `server/.env`:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Security Features

- Zero-knowledge encryption architecture
- Client-side AES-256 encryption
- Secure master password hashing
- Protected API endpoints
- Role-based access control
- Automatic session management