# VR Marketplace

This is a modern VR asset marketplace application built with React, Express.js, and PostgreSQL. The platform allows users to mint, buy, and sell VR assets in a cyberpunk-themed environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Built with Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **3D Visualization**: Three.js integration for VR asset preview

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging and error handling
- **Memory Storage**: In-memory data storage with interface for future database integration
- **Development Setup**: Vite integration for hot module replacement in development

### Key Components

#### Data Models
- **Users**: Username, wallet address, balance, creation timestamp
- **VR Assets**: Title, description, category, price, preview/model URLs, ownership
- **Transactions**: Asset transfers, buyer/seller info, price, status tracking

#### API Endpoints
- `GET /api/assets` - Fetch all VR assets
- `GET /api/assets/:id` - Get specific asset details
- `POST /api/assets` - Create new VR asset (minting)
- `GET /api/market/stats` - Market statistics and analytics

#### Frontend Features
- **Asset Marketplace**: Grid/list view with filtering and sorting
- **3D Asset Preview**: Modal with Three.js viewer for asset inspection
- **Wallet Integration**: Mock wallet connection system
- **Asset Minting**: Form-based asset creation with validation
- **Transaction Flow**: Loading states and confirmation modals

## Data Flow

1. **Asset Discovery**: Users browse assets fetched from `/api/assets`
2. **Asset Preview**: 3D models loaded via Three.js in modal overlay
3. **Wallet Connection**: Mock authentication system stores user state
4. **Asset Purchase**: Transaction creation with status tracking
5. **Asset Creation**: Form validation and API submission for new assets

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React Query, React Router alternative)
- Express.js with standard middleware
- Drizzle ORM configured for PostgreSQL (ready for database integration)

### UI and Styling
- Tailwind CSS with custom cyberpunk theme variables
- Radix UI primitives via shadcn/ui
- Lucide React for icons

### 3D and Visualization
- Three.js for WebGL rendering
- Three.js examples for orbit controls

### Development Tools
- Vite for bundling and development server
- TypeScript for type safety
- ESBuild for production builds

## Deployment Strategy

### Development
- Vite dev server with HMR for frontend
- Express server with auto-restart via tsx
- Replit-specific plugins for development environment

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: ESBuild bundles server to `dist/index.js`
- Static file serving from Express for SPA

### Database Integration
- Drizzle ORM configured for PostgreSQL connection
- Migration system ready via `drizzle-kit`
- Memory storage interface allows easy database swap

The application uses a cyberpunk aesthetic with neon colors and glass morphism effects. The architecture supports easy scaling from the current in-memory storage to a full PostgreSQL database setup.