
# Second Brain

Second Brain is a full-stack personal knowledge management application for storing and organizing notes, tasks, tweets, and YouTube videos in one place.

Live: https://secondbrain.sbs

---

## Features

- Create and manage notes
- Track tasks and to-dos
- Save tweets for later reference
- Bookmark YouTube videos
- JWT-based authentication
- Google OAuth login
- Production deployment with HTTPS and custom domain

---

## Tech Stack

### Frontend
- React
- Vite
- TypeScript
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL (NeonDB)
- JWT Authentication
- Google Identity Services OAuth

### Infrastructure & DevOps
- Docker
- Docker Compose
- Multi-stage Docker builds
- AWS EC2 (Ubuntu 22.04)
- Nginx reverse proxy
- SSL with Certbot
- Docker Hub image deployment pipeline

---

## Architecture

```text
User Browser
     │
     ▼
https://secondbrain.sbs
     │
     ▼
AWS EC2 Instance
     │
     ├── Nginx (80/443)
     │     ├── /      → React Client Container
     │     └── /api   → Express Server Container
     │
     ├── Frontend Container (React + Vite)
     └── Backend Container (Node.js + Express)
                         │
                         ▼
                 NeonDB PostgreSQL
````

---

## Local Development

### Prerequisites

* Node.js 20+
* Docker Desktop
* PostgreSQL or NeonDB

### Clone the Repository

```bash
git clone https://github.com/compiler041/second-brain
cd second-brain
```

### Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Environment Variables

Create `server/.env`

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
PORT=3000
```

Create `client/.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Run Locally

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

---

## Docker Setup

### Build Backend

```bash
docker build \
  -t second-brain-server \
  -f docker/DockerFile.backend ./server
```

### Build Frontend

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:3000/api \
  -t second-brain-client \
  -f docker/DockerFile.frontend ./client
```

### Run Containers

```bash
docker-compose up -d
```

---

## Deployment Workflow

### Build and Push Images

```bash
docker build \
  -t vaibhav0041/second-brain-server:vX \
  -f docker/DockerFile.backend ./server

docker push vaibhav0041/second-brain-server:vX
```

```bash
docker build \
  --build-arg VITE_API_URL=https://secondbrain.sbs/api \
  -t vaibhav0041/second-brain-client:vX \
  -f docker/DockerFile.frontend ./client

docker push vaibhav0041/second-brain-client:vX
```

### Deploy on EC2

```bash
ssh -i key.pem ubuntu@your-ec2-ip

cd second-brain

docker-compose down
docker-compose pull
docker-compose up -d
```

---

## Engineering Learnings

* Reduced Docker image size from ~900MB to ~25MB using multi-stage builds
* Learned that Vite environment variables must be injected at build time
* Configured Nginx as a reverse proxy for frontend and backend routing
* Implemented connection pool error handling for NeonDB idle disconnects
* Configured React Router fallback routing using `try_files`
* Managed OAuth edge cases including duplicate username conflicts

---

## Production Issues Solved

| Issue                                    | Solution                                                      |
| ---------------------------------------- | ------------------------------------------------------------- |
| React Router 404 errors on refresh       | Added `try_files $uri $uri/ /index.html` in Nginx             |
| Frontend calling localhost in production | Injected `VITE_API_URL` during Docker build                   |
| NeonDB idle connection crashes           | Added pool-level and client-level error handling              |
| OAuth duplicate key conflicts            | Implemented email-first lookup and unique username generation |
| CORS failures during OAuth login         | Configured production domain in backend and Google Console    |

---

## Future Improvements

* Add markdown editor for notes
* Add search and tagging system
* Add Redis caching
* Add CI/CD with GitHub Actions
* Add monitoring and centralized logging

---

## Author

Vaibhav Rathod

GitHub: [https://github.com/compiler041](https://github.com/compiler041)
Live: [https://secondbrain.sbs](https://secondbrain.sbs)

