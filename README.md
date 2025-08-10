<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 🏗️ Construction Company Admin Dashboard API

A robust NestJS backend API for managing a construction company's admin dashboard. Built with TypeScript, featuring secure authentication, contact management, and project portfolio management.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **📞 Contact Management**: Store and manage customer inquiries and contact information
- **🏢 Project Portfolio**: Upload and manage construction projects with images and descriptions
- **📊 Dashboard Analytics**: Get overview statistics and recent activities
- **🛡️ Protected Routes**: All admin endpoints require authentication
- **✅ Input Validation**: Comprehensive validation using Zod schemas
- **🗄️ Database**: MySQL with Drizzle ORM for type-safe database operations

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pues-api-node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/pues_api
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Create Admin Account
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "admin@construction.com",
  "password": "securepassword123",
  "name": "Admin User"
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "admin@construction.com",
  "password": "securepassword123"
}
```

### Protected Admin Endpoints

All admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Profile Management
```http
GET /admin/profile
```

#### Contact Management
```http
GET /admin/contacts          # List all contacts
GET /admin/contacts/:id      # Get specific contact
DELETE /admin/contacts/:id   # Delete contact
```

#### Project Management
```http
GET /admin/projects          # List all projects
GET /admin/projects/:id      # Get specific project
POST /admin/projects         # Create new project
PUT /admin/projects/:id      # Update project
DELETE /admin/projects/:id   # Delete project
```

#### Dashboard Analytics
```http
GET /admin/dashboard/stats   # Get dashboard statistics
```

### Example: Creating a Project
```http
POST /admin/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Modern Office Building",
  "description": "A state-of-the-art office complex with sustainable design",
  "imageUrl": "https://example.com/project-image.jpg",
  "completedAt": "2024-01-15T00:00:00.000Z"
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debug

# Production
npm run build              # Build the application
npm run start:prod         # Start production server

# Database
npm run db:generate        # Generate database migrations
npm run db:migrate         # Run database migrations
npm run db:studio          # Open Drizzle Studio

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run tests with coverage

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── auth.controller.ts # Auth endpoints
│   ├── auth.service.ts    # Auth business logic
│   ├── jwt.strategy.ts    # JWT authentication
│   └── auth.module.ts     # Auth module config
├── admin/                 # Admin dashboard module
│   ├── admin.controller.ts # Admin endpoints
│   ├── admin.service.ts    # Admin business logic
│   └── admin.module.ts     # Admin module config
├── db/                    # Database configuration
│   ├── index.ts           # Database connection
│   ├── schema.ts          # Database schema
│   └── database.module.ts # Database module
└── utils/                 # Utility functions
    ├── zod-validation.pipe.ts
    └── zod-exception.filters.ts
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: 24-hour expiration for admin sessions
- **Input Validation**: Zod schemas for all inputs
- **Protected Routes**: Authentication required for admin endpoints
- **Soft Deletes**: Safe deletion (marked as deleted, not removed)
- **Error Handling**: Proper error responses for invalid requests

## 🗄️ Database Schema

### Admin Users
- `id`: Primary key
- `email`: Unique email address
- `passwordHash`: Hashed password
- `name`: Admin user name
- `createdAt`, `updatedAt`: Timestamps
- `deleted`, `deletedAt`: Soft delete fields

### Projects
- `id`: Primary key
- `title`: Project title
- `description`: Project description
- `imageUrl`: Project image URL
- `completedAt`: Completion date
- `updatedAt`: Last update timestamp
- `deleted`, `deletedAt`: Soft delete fields

### Contacts
- `id`: Primary key
- `name`: Contact name
- `email`: Contact email
- `phone`: Contact phone (optional)
- `message`: Contact message
- `createdAt`: Contact creation timestamp
- `updatedAt`: Last update timestamp
- `deleted`, `deletedAt`: Soft delete fields

## 🚀 Deployment

### Environment Variables for Production

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
PORT=3000
```

### Database Migration

```bash
npm run db:migrate
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the [AUTH_SETUP.md](AUTH_SETUP.md) for detailed setup instructions
