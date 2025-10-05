# API Reference

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

or

```json
{
  "errors": [
    {
      "msg": "Validation error message",
      "param": "field_name"
    }
  ]
}
```

---

## Authentication Endpoints

### Register User

Creates a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**

```json
{
  "error": "Email already registered"
}
```

---

### Login User

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**

```json
{
  "error": "Invalid credentials"
}
```

---

### Get User Profile

Retrieves the current user's profile.

**Endpoint:** `GET /api/auth/profile`

**Authentication:** Required

**Success Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Update User Profile

Updates the current user's profile.

**Endpoint:** `PUT /api/auth/profile`

**Authentication:** Required

**Request Body:**

```json
{
  "name": "John Doe Updated",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Success Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john@example.com",
    "avatar": "https://example.com/new-avatar.jpg",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## Task Endpoints

### Get All Tasks

Retrieves all tasks with optional filtering.

**Endpoint:** `GET /api/tasks`

**Authentication:** Required

**Query Parameters:**

- `status` (optional): Filter by status (TODO, IN_PROGRESS, DONE)
- `assignee_id` (optional): Filter by assignee user ID
- `created_by` (optional): Filter by creator user ID
- `due_date` (optional): Filter tasks due on or before this date (YYYY-MM-DD)
- `my_tasks` (optional): Set to 'true' to get tasks assigned to current user

**Example:**

```
GET /api/tasks?status=TODO&my_tasks=true
```

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task description",
    "status": "TODO",
    "assignee_id": 2,
    "assignee_name": "Jane Smith",
    "assignee_email": "jane@example.com",
    "assignee_avatar": null,
    "created_by": 1,
    "creator_name": "John Doe",
    "creator_email": "john@example.com",
    "due_date": "2024-01-15",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Task by ID

Retrieves a specific task.

**Endpoint:** `GET /api/tasks/:id`

**Authentication:** Required

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Task description",
  "status": "TODO",
  "assignee_id": 2,
  "assignee_name": "Jane Smith",
  "assignee_email": "jane@example.com",
  "assignee_avatar": null,
  "created_by": 1,
  "creator_name": "John Doe",
  "creator_email": "john@example.com",
  "due_date": "2024-01-15",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "error": "Task not found"
}
```

---

### Create Task

Creates a new task.

**Endpoint:** `POST /api/tasks`

**Authentication:** Required

**Request Body:**

```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "TODO",
  "assignee_id": 2,
  "due_date": "2024-01-15"
}
```

**Success Response (201):**

```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "title": "New Task",
    "description": "Task description",
    "status": "TODO",
    "assignee_id": 2,
    "created_by": 1,
    "due_date": "2024-01-15",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Task

Updates an existing task.

**Endpoint:** `PUT /api/tasks/:id`

**Authentication:** Required

**Request Body:**

```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "assignee_id": 3,
  "due_date": "2024-01-20"
}
```

**Success Response (200):**

```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "title": "Updated Task",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "assignee_id": 3,
    "created_by": 1,
    "due_date": "2024-01-20",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### Delete Task

Deletes a task.

**Endpoint:** `DELETE /api/tasks/:id`

**Authentication:** Required

**Success Response (200):**

```json
{
  "message": "Task deleted successfully"
}
```

**Error Response (404):**

```json
{
  "error": "Task not found"
}
```

---

### Get Task Statistics

Retrieves overall task statistics.

**Endpoint:** `GET /api/tasks/stats`

**Authentication:** Required

**Success Response (200):**

```json
{
  "total": "10",
  "todo": "3",
  "in_progress": "4",
  "done": "3",
  "progress": 30
}
```

---

## Comment Endpoints

### Get Task Comments

Retrieves all comments for a task.

**Endpoint:** `GET /api/tasks/:taskId/comments`

**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "user_avatar": null,
    "content": "This is a comment",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Add Comment

Adds a comment to a task.

**Endpoint:** `POST /api/tasks/:taskId/comments`

**Authentication:** Required

**Request Body:**

```json
{
  "content": "This is a new comment"
}
```

**Success Response (201):**

```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": 1,
    "task_id": 1,
    "user_id": 1,
    "content": "This is a new comment",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Delete Comment

Deletes a comment.

**Endpoint:** `DELETE /api/tasks/comments/:id`

**Authentication:** Required

**Success Response (200):**

```json
{
  "message": "Comment deleted successfully"
}
```

---

## User Endpoints

### Get All Users

Retrieves all users.

**Endpoint:** `GET /api/users`

**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "avatar": null
  }
]
```

---

### Get User by ID

Retrieves a specific user.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required

**Success Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "error": "User not found"
}
```

---

## Activity Log Endpoints

### Get Task Activities

Retrieves activity log for a task.

**Endpoint:** `GET /api/activities/tasks/:taskId`

**Authentication:** Required

**Success Response (200):**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "action": "CREATED",
    "description": "Task created: New Task",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "task_id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "action": "STATUS_CHANGED",
    "description": "Status changed from TODO to IN_PROGRESS",
    "created_at": "2024-01-02T00:00:00.000Z"
  }
]
```

---

### Get Recent Activities

Retrieves recent activities across all tasks.

**Endpoint:** `GET /api/activities/recent`

**Authentication:** Required

**Query Parameters:**

- `limit` (optional): Number of activities to return (default: 20)

**Success Response (200):**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "task_title": "New Task",
    "user_id": 1,
    "user_name": "John Doe",
    "action": "CREATED",
    "description": "Task created: New Task",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Health Check

### API Health

Checks if the API is running.

**Endpoint:** `GET /api/health`

**Authentication:** Not required

**Success Response (200):**

```json
{
  "status": "ok",
  "message": "Task Manager API is running"
}
```

---

## Status Codes

- `200` - OK: Request succeeded
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required or failed
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server error occurred

---

## Activity Actions

The following actions are logged in the activity system:

- `CREATED` - Task was created
- `STATUS_CHANGED` - Task status was changed
- `ASSIGNEE_CHANGED` - Task assignee was changed
- `COMMENT_ADDED` - Comment was added to task

---

## Task Status Values

- `TODO` - Task is to be done
- `IN_PROGRESS` - Task is in progress
- `DONE` - Task is completed
