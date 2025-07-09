# Full2Win Gaming Platform

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Technical Implementation](#technical-implementation)
5. [Setup & Installation](#setup--installation)
6. [API Documentation](#api-documentation)
7. [Deployment Guide](#deployment-guide)
8. [Contributing](#contributing)
9. [License](#license)

## Executive Summary

Full2Win is a cutting-edge online gaming platform that brings together competitive gamers in an engaging, real-time tournament environment. This platform enables users to participate in competitive gaming tournaments, featuring real-time multiplayer functionality, an interactive tournament lobby, and a comprehensive leaderboard system.

## Project Overview

### Core Features
- **Tournament System**: Create and join competitive tournaments
- **Real-time Gameplay**: WebSocket-based multiplayer gaming
- **Interactive Lobby**: Chat with opponents and spectators
- **Secure Payments**: Integrated Razorpay payment gateway
- **Responsive Design**: Works across all devices

### Technical Stack
- **Frontend**: React.js, Socket.IO Client
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Payments**: Razorpay
- **Cloud Storage**: Cloudinary

## System Architecture

### Frontend Architecture
- Component-based architecture using React.js
- State management with Context API
- Real-time updates via Socket.IO
- Responsive design with modern CSS

### Backend Architecture
- RESTful API design
- WebSocket server for real-time features
- MongoDB for data storage
- Authentication middleware
- Payment processing

## Technical Implementation

### Key Components
1. **User Authentication**
   - JWT-based authentication
   - Role-based access control
   - Secure password hashing

2. **Tournament System**
   - Tournament creation and management
   - Bracket generation
   - Real-time matchmaking

3. **Game Integration**
   - Game lobby system
   - Real-time game state synchronization
   - Score tracking and validation

4. **Payment Processing**
   - Secure payment integration
   - Payout distribution
   - Transaction history

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   cd Full2Win-Frontend
   npm install
   
   cd ../Ful2Win-Backend
   npm install
   ```
3. Set up environment variables (see .env.example)
4. Start the development servers:
   ```bash
   # Backend
   cd Ful2Win-Backend
   npm run dev
   
   # Frontend (in a new terminal)
   cd Full2Win-Frontend
   npm start
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Tournaments
- `GET /api/tournaments` - List all tournaments
- `POST /api/tournaments` - Create a new tournament
- `GET /api/tournaments/:id` - Get tournament details
- `POST /api/tournaments/:id/join` - Join a tournament

### Games
- `GET /api/games` - List available games
- `POST /api/games/start` - Start a new game session
- `POST /api/games/:id/move` - Submit game move

## Deployment Guide

### Production Deployment
1. Set up a MongoDB Atlas cluster
2. Configure environment variables for production
3. Build the frontend:
   ```bash
   cd Full2Win-Frontend
   npm run build
   ```
4. Start the production server:
   ```bash
   cd Ful2Win-Backend
   npm run prod
   ```

### Environment Variables
```
# Backend
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_URL=your_cloudinary_url

# Frontend
REACT_APP_API_URL=your_api_url
REACT_APP_SOCKET_URL=your_socket_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Last Updated**: July 9, 2025
**Version**: 1.0.0
