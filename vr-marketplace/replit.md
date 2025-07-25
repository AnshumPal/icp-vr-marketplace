# VR Marketplace Replit Project

## Overview

This is a full-stack VR asset marketplace application built with React, Express, and PostgreSQL. The platform allows users to mint, buy, and sell VR assets in a decentralized marketplace with Internet Computer (IC) integration. The application features a modern cyberpunk-themed UI with 3D asset previews and comprehensive market analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom cyberpunk theme variables
- **3D Graphics**: Three.js for VR asset previews and interactive scenes
- **Build Tool**: Vite with custom configuration for monorepo support

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: ID, username, wallet address, balance, timestamps
- **VR Assets**: ID, title, description, category, price, preview/model URLs, owner relationship
- **Transactions**: ID, asset/buyer/seller relationships, price, transaction hash, status

### API Endpoints (server/routes.ts)
- `GET /api/assets` - Fetch all VR assets with owner information
- `GET /api/assets/:id` - Get specific asset details
- `POST /api/assets` - Create new VR asset (minting)
- `GET /api/market/stats` - Market analytics and statistics
- User-specific endpoints for assets and transactions

### UI Components
- **AssetCard**: Grid/list view asset display with preview capabilities
- **Asset3DPreviewModal**: Full 3D asset viewer with Three.js integration
- **ThreeJSViewer**: Reusable 3D scene component for model rendering
- **MintAssetModal**: Asset creation form with validation
- **TransactionLoadingModal**: Transaction status tracking

### Pages
- **Marketplace**: Main asset browsing with filtering and sorting
- **My Assets**: User portfolio management
- **Analytics**: Market statistics and data visualization

## Data Flow

1. **Asset Discovery**: Users browse marketplace with real-time filtering by category, price range, and sorting options
2. **3D Preview**: Assets can be previewed in interactive 3D viewers before purchase
3. **Wallet Integration**: Mock IC wallet connection for user authentication and balance management
4. **Asset Minting**: Users create new VR assets with metadata and file references
5. **Transactions**: Purchase flow with loading states and transaction confirmation
6. **Portfolio Management**: Users track owned assets and transaction history

## External Dependencies

### Core Framework Dependencies
- React ecosystem: react, react-dom, @tanstack/react-query
- UI Components: @radix-ui/* components, tailwindcss, class-variance-authority
- 3D Graphics: three.js with @types/three for TypeScript support
- Routing: wouter for lightweight routing

### Backend Dependencies
- Database: drizzle-orm, @neondatabase/serverless, connect-pg-simple
- Validation: zod with drizzle-zod integration
- Development: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- TypeScript with strict configuration
- ESLint and Prettier (configured via components.json)
- Vite with custom plugins including @replit/vite-plugin-runtime-error-modal

## Deployment Strategy

### Development
- **Client**: Vite dev server with HMR and error overlay
- **Server**: tsx with nodemon-like behavior for hot reloading
- **Database**: Neon serverless PostgreSQL with connection pooling

### Production Build
- **Client**: Vite builds to `dist/public` with optimized assets
- **Server**: esbuild bundles to `dist/index.js` with ESM format
- **Database**: Production Neon instance with environment-based configuration

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- Development/production mode detection via `NODE_ENV`
- Replit-specific optimizations with cartographer plugin

### Key Architectural Decisions

1. **Monorepo Structure**: Chosen for shared TypeScript types and simplified development workflow
2. **Drizzle ORM**: Selected for type-safe database operations and excellent PostgreSQL integration
3. **shadcn/ui**: Provides consistent, accessible UI components with Tailwind CSS integration
4. **TanStack Query**: Handles server state, caching, and background updates efficiently
5. **Three.js Integration**: Enables rich 3D asset previews essential for VR marketplace
6. **Neon PostgreSQL**: Serverless database for scalable, cost-effective deployment
7. **Vite Build System**: Fast development and optimized production builds with modern tooling

The architecture prioritizes developer experience, type safety, and performance while maintaining clear separation of concerns between client and server code.