# ProsperOnline Canada

A modern digital marketing and SEO services website built with React, TypeScript, and Tailwind CSS.

## About

ProsperOnline Canada provides professional digital marketing solutions for Canadian businesses, including SEO optimization, lead generation, social media marketing, and business automation services.

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd prosperonline
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build the project in development mode
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Site header
│   ├── Hero.tsx        # Hero section
│   ├── Services.tsx    # Services section
│   ├── About.tsx       # About section
│   ├── Contact.tsx     # Contact section
│   └── Footer.tsx      # Site footer
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Features

- Responsive design optimized for all devices
- Modern UI with shadcn/ui components
- SEO-optimized with proper meta tags
- Contact form integration
- Analytics tracking setup
- TypeScript for type safety
- Tailwind CSS for styling

## Deployment

The project can be deployed to any static hosting service such as:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

Build the project with `npm run build` and deploy the `dist` folder.

## License

This project is private and proprietary to ProsperOnline Canada.