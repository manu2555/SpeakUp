# Speak Up - Public Feedback Portal

A full-stack web application for managing public feedback, built with React, Node.js, and PostgreSQL.

## Features

- User authentication and authorization
- Submit and track feedback
- Real-time status updates
- Multi-language support (English and Hindi)
- Responsive design
- Admin dashboard for feedback management

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Project Structure

```
speak-up/
├── backend/         # Express backend
└── frontend/        # React frontend
```

## Setup Instructions

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE speakup;
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file based on .env.example:
```bash
cp .env.example .env
```

4. Update the .env file with your database credentials and other configurations

5. Run database migrations:
```bash
npm run typeorm migration:run
```

6. Start the development server:
```bash
npm run dev
```

The backend server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will start on http://localhost:5173

## Available Scripts

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Feedback Endpoints

- GET `/api/feedback` - Get all feedback
- POST `/api/feedback` - Create new feedback
- GET `/api/feedback/:id` - Get feedback by ID
- PUT `/api/feedback/:id` - Update feedback status (Admin only)

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=speakup
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 