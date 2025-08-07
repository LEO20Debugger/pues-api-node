# Authentication Setup Guide

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/pues_api

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Database URL Format
The `DATABASE_URL` follows this format:
```
mysql://username:password@host:port/database_name
```

Examples:
- Local development: `mysql://root:@localhost:3306/pues_api`
- With password: `mysql://root:mypassword@localhost:3306/pues_api`
- Remote database: `mysql://user:pass@db.example.com:3306/pues_api`

## Database Setup

1. Create a MySQL database named `pues_api`
2. Run the database migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## API Endpoints

### Authentication Endpoints

#### Sign Up
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

All admin endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get Admin Profile
```http
GET /admin/profile
Authorization: Bearer <token>
```

#### Contact Management
```http
GET /admin/contacts
GET /admin/contacts/:id
DELETE /admin/contacts/:id
```

#### Project Management
```http
GET /admin/projects
GET /admin/projects/:id
POST /admin/projects
PUT /admin/projects/:id
DELETE /admin/projects/:id
```

#### Dashboard Statistics
```http
GET /admin/dashboard/stats
```

## Usage Examples

### Creating a Project
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

### Getting Dashboard Stats
```http
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "message": "Dashboard statistics retrieved successfully",
  "stats": {
    "totalContacts": 25,
    "totalProjects": 12,
    "recentContacts": [...],
    "recentProjects": [...]
  }
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **JWT Tokens**: 24-hour expiration for admin sessions
3. **Soft Deletes**: All deletions are soft deletes (marked as deleted, not actually removed)
4. **Input Validation**: All inputs are validated using Zod schemas
5. **Protected Routes**: All admin routes require authentication

## Testing the API

1. Start the server: `npm run start:dev`
2. Create an admin user using the signup endpoint
3. Sign in to get a JWT token
4. Use the token in the Authorization header for all admin endpoints
