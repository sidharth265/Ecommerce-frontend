# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

# Product Showcase Explorer

A responsive web application that fetches products from the DummyJSON API and displays them with beautiful animations and modern UI patterns.

## Features

- **Product Grid Display**: Responsive grid layout showcasing products with images, titles, prices, and ratings
- **Product Detail Modal**: Full product information including multiple images, description, warranty, shipping info, and more
- **Category Filtering**: Filter products by category with animated pill buttons
- **Sorting**: Sort products by price (ascending/descending) or title (A-Z/Z-A)
- **Pagination**: Navigate through pages of products with animated controls
- **Loading States**: Skeleton loaders during data fetching
- **Error Handling**: Graceful error messages with retry functionality
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd product-showcase-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Design Choices & Trade-offs

### Architecture

- **Component Structure**: Components are organized by feature (ProductCard, ProductDetail, Filters, Pagination, Skeleton) for better maintainability and reusability
- **Type Definitions**: Centralized TypeScript types in `src/types/index.ts` for consistent data shapes across the application
- **API Layer**: Separated API calls into `src/services/api.ts` for easy testing and future modifications

### Styling Approach

- **Tailwind CSS**: Chosen for rapid UI development with consistent spacing scale (8px system) and built-in responsive utilities
- **Color System**: Uses slate (neutral), rose (for discounts/errors), indigo (accents), amber (ratings), and emerald (success indicators)
- **Design Aesthetic**: Clean, modern design with rounded corners (rounded-2xl for cards, rounded-xl for inner elements) and subtle shadows

### Client-side Sorting

The DummyJSON API doesn't support server-side sorting for all fields, so sorting is implemented client-side. The trade-off is:
- **Pro**: Instant sorting feedback without additional API calls
- **Con**: Limited to products already loaded (12 per page for uncategorized, 100 for category views)

### Pagination Strategy

- Main product list uses server-side pagination (API supports skip/limit)
- Category views load up to 100 products for better sorting, but don't paginate (to allow full client-side sort)

### Animation Design

All animations use Framer Motion with intentional design:
- **Stagger delays**: 0.05s per card for a cascading reveal effect
- **Spring physics**: Modal uses spring transitions (damping: 25, stiffness: 300) for natural feel
- **Micro-interactions**: Hover states use scale (1.05-1.1) and lifts (-8px y-offset) for tactile feedback

## Third-Party Libraries

| Library | Purpose | Why Chosen |
|---------|---------|------------|
| **Framer Motion** | Animations | Declarative API, excellent React integration, built-in gesture handling |
| **Lucide React** | Icons | Lightweight, consistent styling, tree-shakeable, modern icon set |
| **Tailwind CSS** | Styling | Utility-first approach, excellent responsive design support, small production bundle |

## Animations Spotlight

### Implemented Animations

1. **List Item Appearance** (`ProductCard.tsx`)
   - Cards fade in and slide up (y: 20 → 0) with staggered delays
   - Creates a cascading reveal effect as products load

2. **Detail View Transition** (`ProductDetail.tsx`)
   - Backdrop fades in (opacity) with blur effect
   - Modal scales up (0.9 → 1) and slides in (y: 50 → 0) with spring physics
   - Image carousel has slide animations between images

3. **Micro-interactions**
   - **Card hover**: Cards lift (-8px) with shadow enhancement, images scale (1.08)
   - **Button feedback**: Scale down on tap (0.95-0.98), scale up on hover (1.02-1.1)
   - **Close button**: Rotates 90° on hover for playful interaction
   - **Filter pills**: Subtle scale animation on hover/tap
