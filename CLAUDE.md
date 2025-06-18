# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Frontend (root directory):**
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run preview` - Preview production build
- `npm run test.unit` - Run unit tests with Vitest
- `npm run test.e2e` - Run end-to-end tests with Cypress
- `npm run lint` - Run ESLint

**Backend (Sanity CMS in /backend):**
- `cd backend && npm run dev` - Start Sanity Studio development
- `cd backend && npm run build` - Build Sanity Studio
- `cd backend && npm run deploy` - Deploy Sanity Studio

## Architecture Overview

This is an Ionic React e-commerce application with Sanity CMS backend:

**Frontend Stack:**
- Ionic React with React Router for mobile-first UI
- TypeScript with strict mode enabled
- Vite for build tooling and development
- SCSS with Catppuccin theme (catppuccin.scss)
- Vitest for unit testing, Cypress for e2e testing

**Backend:**
- Sanity CMS for content management and product catalog
- Sanity client configuration in `backend/services/sanityClient.ts`
- Schema types defined in `backend/schemaTypes/`

**Key Frontend Components:**
- `src/context/CartContext.tsx` - Global cart state management with localStorage persistence
- `src/services/api.ts` - API layer for Sanity data fetching (products, collections, cart operations)
- `src/pages/` - Route components for different app sections
- `src/components/cart/` - Shopping cart UI components including PayPal integration

**Data Flow:**
- Products and collections fetched from Sanity via `api.ts`
- Cart state managed in React Context with localStorage sync
- Cart data can be persisted to Sanity for order conversion
- PayPal integration for checkout processing

**Routing Structure:**
- Home (`/`) - Homepage with featured content
- Shop (`/shop`) - Product listing
- Product details (`/product/:slug`)
- Collections (`/collections`, `/collection/:slug`)
- Checkout (`/checkout`) with PayPal integration
- About and other informational pages

**Environment Variables Required:**
- `VITE_SANITY_PROJECT_ID` - Sanity project ID
- `VITE_SANITY_API_TOKEN` - Sanity API token

**Testing:**
- Unit tests use Vitest with jsdom environment
- E2e tests use Cypress
- Test setup in `src/setupTests.ts`

## Code Conventions

- Use TypeScript with strict mode
- Follow existing SCSS structure and Catppuccin theming
- Cart operations should maintain localStorage sync
- Always use the `useCart` hook for cart state access
- API calls should go through `src/services/api.ts`
- Image handling uses Sanity's image URL builder via `urlFor()`

### SCSS Guidelines
- Place all property declarations before nested rules and media queries
- When using mixins that contain media queries (like `@include mobile-only`), ensure all direct properties are declared first
- For Sass mixed-decls warnings, either move declarations above nested rules or wrap them in `& {}`

## Clean Code Principles (Robert C. Martin Guidelines)

### Core Principles
- **Self-Documenting Code**: Write code so clear that comments become unnecessary
- **Single Responsibility**: Each function/component should have one reason to change
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through abstraction
- **Small Functions**: Functions should be small and do one thing well
- **Meaningful Names**: Use intention-revealing names for variables, functions, and classes

### Function Guidelines
- **Function Size**: Keep functions under 20 lines when possible
- **Function Arguments**: Prefer 0-3 arguments; use objects for multiple parameters
- **Pure Functions**: Avoid side effects; return predictable outputs for given inputs
- **Error Handling**: Use proper error boundaries; don't ignore caught exceptions

## Code Style Guidelines

### TypeScript Best Practices
- **Strict Typing**: Use strict typing with interfaces/types for all components
- **Discriminated Unions**: Use for type-safe state management (see `grantTypes.ts`)
- **Interface Naming**: Use descriptive names (`FormFieldProps`, not `IProps`)
- **Type Guards**: Implement type guards for runtime type checking
- **Generic Types**: Use generics for reusable components (`useMultiStepForm<T>`)

### Component Architecture
- **Functional Components**: Use functional components with hooks exclusively
- **Custom Hooks**: Extract complex logic into custom hooks (`useErrorHandler`, `useLoadingManager`)
- **Component Composition**: Prefer composition over inheritance
- **Props Interface**: Always define explicit props interfaces
- **Component Size**: Keep components under 200 lines; extract sub-components if larger