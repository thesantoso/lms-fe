# LMS Dashboard - Learning Management System

A modern, production-ready multi-tenant admin-heavy LMS dashboard built with React, Vite, TypeScript, and TailwindCSS.

## Features

- 🏢 **Multi-tenant Architecture** - Support for multiple schools with easy switching
- 🔐 **Role-Based Access Control** - Admin, Teacher, and Student roles with appropriate permissions
- 🎨 **Modern UI** - Clean, responsive design using TailwindCSS with custom color tokens
- 📱 **Responsive Design** - Optimized for desktop and tablet layouts
- 🔄 **Real-time Data** - TanStack Query for efficient data fetching and caching
- 🛣️ **Advanced Routing** - React Router v6 with protected routes and role-based layouts
- 🎯 **TypeScript** - Full type safety throughout the application
- 🚀 **Production Ready** - Built with Vite for optimal performance

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom design tokens
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6
- **Icons**: Phosphor Icons
- **HTTP Client**: Axios with custom API abstraction layer
- **Type Safety**: TypeScript with strict mode

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Sidebar, DashboardLayout)
│   └── features/       # Feature-specific components
├── contexts/           # React contexts (Auth, Tenant)
├── lib/                # Utility libraries
│   ├── api/           # API client and services
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Helper functions
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── admin/         # Admin dashboard pages
│   ├── teacher/       # Teacher dashboard pages
│   └── student/       # Student dashboard pages
├── routes/            # Route configuration and guards
└── types/             # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thesantoso/lms-fe.git
cd lms-fe
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Demo Credentials

The application includes mock data for testing:

- **Admin**: admin@demo.com / admin123
- **Teacher**: teacher@demo.com / teacher123
- **Student**: student@demo.com / student123

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features by Role

### Admin Dashboard
- View overall statistics (courses, teachers, students)
- Manage multiple schools (switch between schools)
- View and manage courses
- View and manage students
- View and manage teachers
- School information management

### Teacher Dashboard
- View assigned courses
- View student enrollments
- Track course progress
- Manage course content

### Student Dashboard
- View enrolled courses
- Track course progress
- View grades and assignments
- Access course materials

## Architecture Highlights

### Multi-Tenant Support
- School switcher component in the sidebar
- Automatic filtering of data by selected school
- Context-based tenant management

### Authentication & Authorization
- Protected routes with role-based access control
- JWT token management
- Automatic token refresh
- Secure logout with cleanup

### API Abstraction
- Centralized API client with interceptors
- Request/response transformation
- Error handling
- Mock API for development

### Design System
- Custom color palette (primary, secondary, success, warning, danger)
- Typography system with Inter font
- Reusable UI components
- Consistent spacing and sizing

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000/api)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Acknowledgments

- Design inspiration from modern admin dashboards
- Icons by Phosphor Icons
- Built with best practices from React and TypeScript communities
