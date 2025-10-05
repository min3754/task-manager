# Task Manager - MVP

A comprehensive task management application designed for project and team collaboration, built with modern web technologies.

## 📋 Features

### Task Management
- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Task status management (TODO, IN_PROGRESS, DONE)
- ✅ Assign tasks to team members
- ✅ Set due dates for tasks
- ✅ Task filtering by status, assignee, and due date

### User Management
- ✅ Email-based authentication (register/login)
- ✅ User profile management (name, email, avatar)
- ✅ View all team members

### Dashboard & Lists
- ✅ Overall task statistics and progress tracking
- ✅ Task list with advanced filtering
- ✅ "My Tasks" view for personal task management
- ✅ Project progress overview

### Collaboration & Communication
- ✅ Comment system for tasks
- ✅ Activity logging for major events (status changes, assignments)
- ✅ Real-time notifications framework (ready for email/in-app alerts)

## 🛠️ Technology Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with custom styles

## 📦 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
└── package.json
```

## 🚀 Getting Started

### Option 1: Docker (Recommended for Quick Testing)

The fastest way to get started is using Docker:

**Prerequisites:**
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))

**Quick Start:**
```bash
# Clone the repository
git clone https://github.com/min3754/task-manager.git
cd task-manager

# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

That's it! The application is ready to use.

For detailed Docker instructions, see [DOCKER.md](DOCKER.md)

### Option 2: Manual Installation

**Prerequisites:**
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/min3754/task-manager.git
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```
   This will install dependencies for both backend and frontend.

3. **Set up the database**
   
   Create a PostgreSQL database:
   ```bash
   createdb taskmanager
   ```

4. **Configure environment variables**
   
   Copy the example env file and update with your settings:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your database credentials and other settings.

5. **Initialize the database**
   ```bash
   cd backend
   npm run init-db
   cd ..
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend API on http://localhost:5000
   - Frontend app on http://localhost:3000

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server
npm run init-db     # Initialize database tables
```

### Frontend Development

```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Task Endpoints

- `GET /api/tasks` - Get all tasks (with optional filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Comment Endpoints

- `GET /api/tasks/:taskId/comments` - Get comments for a task
- `POST /api/tasks/:taskId/comments` - Add comment to task
- `DELETE /api/tasks/comments/:id` - Delete comment

### User Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Activity Endpoints

- `GET /api/activities/tasks/:taskId` - Get activities for a task
- `GET /api/activities/recent` - Get recent activities

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After successful login/registration:

1. A JWT token is returned
2. Frontend stores the token in localStorage
3. Token is included in Authorization header for protected routes
4. Token expires after 7 days (configurable)

## 🎨 Features Overview

### Dashboard
- View overall project statistics
- Track progress with visual progress bar
- See recent tasks at a glance

### Task Management
- Create tasks with title, description, status, assignee, and due date
- Edit existing tasks
- Delete tasks with confirmation
- Filter tasks by multiple criteria
- View "My Tasks" only

### User Profile
- Update name and avatar
- View email and account information

### Collaboration
- Add comments to tasks
- Track task history and changes
- View recent activities

## 🔮 Future Enhancements

- File attachments for tasks
- Kanban board view
- Calendar integration
- Email notifications
- Real-time updates with WebSockets
- Task priority levels
- Task labels/tags
- Advanced search functionality
- Export tasks to CSV/PDF
- Mobile application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: min3754

## 🐛 Known Issues

None at the moment. Please report issues on the GitHub issue tracker.

## 📞 Support

For support, please open an issue on the GitHub repository.