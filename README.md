# Second Brain

Second Brain is a full-stack productivity and content management application built using React (Frontend), Express.js (Backend), and PostgreSQL (pgAdmin). It helps users organize tasks, notes, and saved content such as tweets and YouTube videos in one centralized system.

---

## Features

### Authentication and Users

* User registration and login
* Role-based access (user / admin)
* Secure password storage

### Task Management

* Create, update, and delete tasks
* Assign priority levels
* Track completion status
* Manage due dates

### Notes System

* Create and manage notes
* Public and private visibility
* Edit and update notes

### Saved Content

* Save tweets and YouTube videos
* Add descriptions to saved content
* Control visibility (private/public)

### Favorites

* Mark tasks, notes, tweets, or videos as favorites

### Tags

* Create and manage custom tags

### Privacy Controls

* Manage visibility and access levels

### Activity Logs

* Track user actions such as create, update, and delete operations

---

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | React.js   |
| Backend  | Express.js |
| Database | PostgreSQL |
| Tooling  | pgAdmin    |

---

## Database Schema Overview

The application uses PostgreSQL with the following core tables:

* users: Stores user credentials and roles
* tasks: Manages user tasks with priorities and status
* notes: Stores user-created notes with visibility settings
* tweets: Stores saved tweet links and metadata
* youtube_videos: Stores saved video links and details
* priority: Defines task priority levels
* tags: Custom tags created by users
* favorites: Tracks user-favorited content
* privacy_settings: Manages user-level privacy configurations
* activity_logs: Logs user actions for tracking and auditing

---

## Project Structure

```bash
/client        -> React frontend
/server        -> Express backend
/database      -> SQL schema and queries
```

---

## Installation and Setup

### Prerequisites

* Node.js installed
* PostgreSQL installed
* pgAdmin (optional for DB management)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

---

## API Overview

### Auth

* POST /api/auth/register
* POST /api/auth/login

### Tasks

* GET /api/tasks
* POST /api/tasks
* PUT /api/tasks/:id
* DELETE /api/tasks/:id

### Notes

* GET /api/notes
* POST /api/notes
* PUT /api/notes/:id
* DELETE /api/notes/:id

### Content (Tweets and Videos)

* GET /api/tweets
* POST /api/tweets
* GET /api/videos
* POST /api/videos

### Favorites

* POST /api/favorites
* GET /api/favorites

---

## Future Improvements

* Add search and filtering
* Implement real-time updates
* Add notifications and reminders
* Improve UI/UX design
* Add file and image uploads
* Implement OAuth login (Google, GitHub)

---

## Author

Vaibhav Rathod

---
