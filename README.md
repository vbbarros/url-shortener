# URL Shortener Application

A modern, full-stack URL shortener application built with React and Node.js, featuring user accounts, rate limiting, and URL tracking.

## Project Overview

This project is a URL shortening service that allows users to create shortened versions of long URLs. It includes features like user authentication, URL validation, visit tracking, and rate limiting to prevent abuse.

## Architecture

### Frontend Architecture (React + TypeScript)

The frontend follows a component-based architecture with clear separation of concerns:

```
frontend/src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── hooks/         # Custom React hooks
├── services/      # API communication layer
├── styles/        # Global styles and theme
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

Key Technical Decisions:
- **React with TypeScript** for type safety and better developer experience
- **Styled Components** for component-level styling and theme management
- **React Context** for global state management (auth, notifications)
- **Custom Hooks** for reusable logic and API interactions
- **Axios** for HTTP requests with interceptors for auth and error handling

### Backend Architecture (NestJS + TypeScript)

The backend follows a Clean Architecture pattern with clear separation of concerns:

```
backend/src/
├── domain/           # Business rules and entities
│   ├── entities/     # Core business entities
│   ├── repositories/ # Repository interfaces
│   └── usecases/    # Business use cases
├── application/      # Application services and DTOs
├── infra/           # External implementations
│   ├── http/        # Controllers and middleware
│   ├── database/    # Database implementations
│   └── modules/     # NestJS modules
└── shared/          # Shared utilities and constants
```

Key Technical Decisions:
- **Clean Architecture** for maintainable and testable code
- **Domain-Driven Design** principles for business logic organization
- **Repository Pattern** for data access abstraction
- **Dependency Injection** for loose coupling between components
- **Rate Limiting** implementation for API protection
- **JWT Authentication** for secure user sessions
- **Comprehensive Unit Tests** covering:
  - Use Cases (CreateUser, AuthenticateUser, CreateShortUrl, FindUserUrls, RedirectShortUrl)
  - Repositories (PrismaUserRepository, PrismaShortUrlRepository)
  - HTTP Components (RateLimitInterceptor)
  - Error handling and edge cases
  - Database interactions
  - Authentication flows

## Features Implementation

### URL Shortening
- Custom slug generation with uniqueness validation
- URL validation before shortening
- Support for custom slugs (user-defined)
- Efficient database indexing for quick lookups

### User Management
- JWT-based authentication
- Secure password hashing
- User-specific URL management
- Protected routes and endpoints

### Rate Limiting
- IP-based rate limiting
- Configurable limits and windows
- Headers for limit tracking (X-RateLimit-*)
- Protection against abuse

### URL Tracking
- Visit count tracking
- Creation and last access timestamps
- User association with URLs
- Analytics data storage

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users`: User account information
- `short_urls`: Shortened URL records
- `url_visits`: URL visit tracking

## Security Measures

- Password hashing using bcrypt
- JWT token validation
- Rate limiting for API endpoints
- Input validation and sanitization
- Environment variable protection

## Testing

### Backend Tests

The backend includes comprehensive unit tests implemented with Jest, covering:

#### Use Cases
- `CreateUserUseCase`: User registration with password hashing
- `AuthenticateUserUseCase`: User login and JWT token generation
- `CreateShortUrlUseCase`: URL shortening with custom/auto-generated slugs
- `FindUserUrlsUseCase`: Retrieving user's shortened URLs
- `RedirectShortUrlUseCase`: URL redirection with visit tracking

#### Repositories
- `PrismaUserRepository`: User data persistence tests
- `PrismaShortUrlRepository`: URL data persistence tests
  - CRUD operations
  - Visit count tracking
  - User associations

#### HTTP Components
- `RateLimitInterceptor`: Request rate limiting tests
  - IP-based limiting
  - Window period handling
  - Header management

All tests focus on:
- Happy path scenarios
- Error handling
- Edge cases
- Data validation
- Repository interactions
- Service integrations

Run the tests using:
```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

## Docker Setup

The application is containerized using Docker with three main services:
- Frontend (React application)
- Backend (NestJS API)
- Database (PostgreSQL)

Docker Compose is used to orchestrate these services, making deployment and development consistent across environments.

## Getting Started

1. Clone the repository
2. Install Docker and Docker Compose
3. Run `docker compose up`
4. Access the application at `http://localhost:5173`

## Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
PORT=3000
```

### Frontend
```env
VITE_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### URL Management
- `POST /short-urls` - Create shortened URL
- `GET /short-urls/list` - List user's URLs
- `GET /:slug` - Redirect to original URL
