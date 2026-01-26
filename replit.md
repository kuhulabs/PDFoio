# PDFo - Free Online PDF Tools

## Overview

PDFo is a comprehensive web application providing free online PDF manipulation tools. Users can merge, split, compress, rotate, reorder, add page numbers, add watermarks, lock/unlock, edit metadata, and convert PDFs to/from various formats (Word, Excel, PowerPoint, images, text, JSON). All PDF processing happens client-side in the browser for privacy and speed, with the server only handling newsletter subscriptions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with React plugin
- **PDF Processing**: Client-side using pdf-lib (manipulation) and pdfjs-dist (rendering/thumbnails)
- **Drag & Drop**: @dnd-kit for file reordering functionality
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: Simple REST endpoints defined in shared/routes.ts with Zod schemas
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Build**: esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: shared/schema.ts using Drizzle table definitions
- **Current Tables**: newsletter_subscribers (id, email, createdAt)
- **Migrations**: Drizzle Kit with migrations output to ./migrations

### Key Design Decisions

1. **Client-Side PDF Processing**: All PDF operations run in the browser using pdf-lib and pdfjs-dist. This ensures user privacy (files never leave the browser) and reduces server load.

2. **Shared Type Definitions**: The shared/ directory contains schema.ts (database models) and routes.ts (API contracts with Zod validation), ensuring type safety across client and server.

3. **Component Structure**: Tool pages follow a consistent pattern - FileUpload component, processing UI, download button, and ToolFooter. Each tool has its own page component in client/src/pages/.

4. **PDF Worker Configuration**: pdfjs-dist uses a CDN-hosted worker (pdf.worker.min.js v3.4.120) for background PDF parsing, configured in client/src/lib/pdf-worker-config.ts.

5. **SEO Optimization**: Each tool page uses SEOHead component with structured data, managed through client/src/seo/ and client/src/lib/seo-data.ts.

## External Dependencies

### Third-Party Services
- **PDF.js Worker**: CDN-hosted at cdnjs.cloudflare.com for PDF rendering
- **Google Fonts**: Inter and Plus Jakarta Sans font families
- **Font Awesome**: Icon library loaded via CDN
- **Buy Me a Coffee**: External donation link integration

### Key NPM Packages
- **pdf-lib**: PDF creation and modification
- **pdfjs-dist**: PDF parsing and thumbnail generation
- **jszip**: ZIP file creation for batch downloads
- **xlsx**: Excel file processing for conversion features
- **drizzle-orm** + **pg**: PostgreSQL database access
- **zod**: Runtime type validation for API contracts
- **@dnd-kit/***: Drag and drop functionality for file/page reordering

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required for server startup)