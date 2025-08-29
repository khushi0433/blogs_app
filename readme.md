# Blog Application

A full-stack blog application with user authentication, post management, commenting system, and admin panel. Built with Node.js, Express, Prisma, MySQL, and React.

## Features

### Backend Features
- **User Authentication**: JWT-based authentication with signup/login
- **Post Management**: Create, read, update, delete posts with public/private visibility
- **Comment System**: Add, edit, delete comments on posts
- **Admin Panel**: User management, post moderation, admin privileges
- **Database**: MySQL with Prisma ORM
- **Security**: Password hashing, JWT tokens, role-based access control

### Frontend Features
- **User Interface**: Browse public posts, add comments, user registration/login
- **Admin Interface**: Post management, user management, visibility controls
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Dynamic content loading and updates

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blogs_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: MySQL Setup
1. Start MySQL service:
```bash
# Windows
net start MySQL80

# macOS/Linux
sudo systemctl start mysql
```

2. Create database and user:
```sql
CREATE DATABASE blogs_app;
CREATE USER 'blog_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON blogs_app.* TO 'blog_user'@'%';
FLUSH PRIVILEGES;
```

3. Configure environment variables in `.env`:
```env
DATABASE_URL="mysql://blog_user:your_password@localhost:3306/blogs_app"
SECRET="your_jwt_secret_key_here"
```

#### Option B: SQLite Setup (Development)
1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Configure `.env`:
```env
DATABASE_URL="file:./dev.db"
SECRET="your_jwt_secret_key_here"
```

### 4. Database Migration
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Frontend Setup

### 1. Create React App
```bash
npx create-react-app frontend
cd frontend
npm install axios react-router-dom
```

### 2. Copy Frontend Files
Copy the provided React components and configuration files to the `frontend/src` directory.

### 3. Start Frontend
```bash
npm start
```

The frontend will start on `http://localhost:3001`

## API Documentation

### Authentication Endpoints

#### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### Post Endpoints

#### GET /posts
Get all public posts.

**Response:**
```json
[
  {
    "id": 1,
    "title": "My First Post",
    "text": "This is the content...",
    "isPublished": true,
    "author": {
      "username": "john_doe"
    }
  }
]
```

#### GET /posts/:id
Get a specific post by ID.

**Response:**
```json
{
  "id": 1,
  "title": "My First Post",
  "text": "This is the content...",
  "isPublished": true,
  "author": {
    "username": "john_doe"
  }
}
```

#### POST /posts (Admin Only)
Create a new post.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "New Post Title",
  "text": "Post content here..."
}
```

#### PUT /posts/:id
Update a post (author only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "text": "Updated content..."
}
```

#### DELETE /posts/:id
Delete a post.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST /posts/:id/setpublic (Admin Only)
Make a post public.

#### POST /posts/:id/setprivate (Admin Only)
Make a post private.

### Comment Endpoints

#### GET /comment?postid=:id
Get comments for a specific post.

**Response:**
```json
[
  {
    "id": 1,
    "comment": "Great post!",
    "commenter": {
      "username": "jane_doe"
    }
  }
]
```

#### POST /comment?postid=:id
Add a comment to a post.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "comment": "Your comment here..."
}
```

#### PUT /comment/:id
Update a comment (author only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "comment": "Updated comment..."
}
```

#### DELETE /comment/:id
Delete a comment (author or admin).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### User Management Endpoints (Admin Only)

#### GET /user
Get all users.

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

#### GET /user/:id
Get a specific user.

#### DELETE /user/:id
Delete a user.

#### PUT /user/:id/makeAdmin
Make a user an admin.

## Database Schema

### User Model
```prisma
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  password  String
  isAdmin   Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  posts     Post[]
  comments  Comment[] @relation("UserComments")
}
```

### Post Model
```prisma
model Post {
  id           Int       @id @default(autoincrement())
  title        String
  text         String
  isPublished  Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  author       User      @relation(fields: [authorId], references: [id])
  authorId     Int

  comments     Comment[] @relation("PostComments")
}
```

### Comment Model
```prisma
model Comment {
  id               Int      @id @default(autoincrement())
  comment          String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  commentedBy      User     @relation("UserComments", fields: [commentedById], references: [id])
  commentedById    Int

  commentedPost    Post     @relation("PostComments", fields: [commentedPostId], references: [id])
  commentedPostId  Int
}
```

## Usage Guide

### For Regular Users

1. **Register/Login**: Use the signup/login forms to create an account
2. **Browse Posts**: View all public posts on the main page
3. **Read Posts**: Click on any post to view its full content
4. **Add Comments**: Logged-in users can add comments to posts
5. **Edit Comments**: Users can edit their own comments
6. **Delete Comments**: Users can delete their own comments

### For Admins

1. **User Management**: View all users, delete users, make users admin
2. **Post Management**: Create, edit, delete posts, control visibility
3. **Content Moderation**: Manage post visibility (public/private)
4. **Comment Management**: Delete any comment

### For Post Authors

1. **Create Posts**: Admins can create posts (or remove admin requirement)
2. **Edit Posts**: Authors can edit their own posts
3. **Delete Posts**: Authors can delete their own posts

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for users, authors, and admins
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests

## Development

### Project Structure
```
blogs_app/
├── Controllers/          # Authentication controllers
├── models/              # Database models and queries
├── routes/              # API route definitions
├── prisma/              # Database schema and migrations
├── frontend/            # React frontend application
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

### Available Scripts

- `npm start` - Start the development server
- `npm run dev` - Start with nodemon for development
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio for database management

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/blogs_app"

# JWT Secret
SECRET="your_jwt_secret_key_here"

# Server Port (optional)
PORT=3000
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Authentication Errors**
   - Check JWT secret in `.env`
   - Ensure proper token format in Authorization header
   - Verify user exists in database

3. **CORS Errors**
   - Check CORS configuration in `server.js`
   - Ensure frontend URL is allowed

4. **Prisma Errors**
   - Run `npx prisma generate` after schema changes
   - Run `npx prisma migrate dev` for database changes
   - Check database connection

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=prisma:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## Changelog

### Version 1.0.0
- Initial release
- User authentication system
- Post management
- Comment system
- Admin panel
- React frontend
