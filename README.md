# Commuter Security App (CSA) - Backend API

A robust Node.js/Express backend API for the Commuter Security App Management System, designed to facilitate secure ride-sharing and commuter safety features.

## Overview

This API provides comprehensive endpoints for managing users (passengers and drivers), rides, authentication, feedback, and administrative functions. It implements JWT-based authentication and integrates with MySQL for data persistence.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Passenger Management**: Create and manage passenger profiles
- **Driver Management**: Driver registration, verification, and profile management
- **Ride Management**: Create, track, and manage ride requests and assignments
- **Feedback System**: Collect and manage user feedback and ratings
- **Admin Dashboard**: Administrative controls and system monitoring
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Comprehensive error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: MySQL 2
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Middleware**: CORS, body-parser
- **Environment**: dotenv for configuration management
- **Development**: Nodemon for hot-reloading

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL Server
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd csa-api-capstoneVersion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=csa_database
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Set up the database**
   - Create a MySQL database named `csa_database`
   - Run any required migration scripts (if available)

## Running the Application

### Development Mode
```bash
npm run dev
```
This uses Nodemon to automatically restart the server on file changes.

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout

### Dashboard (`/api/dashboard`)
- `GET /` - Get dashboard overview

### Passengers (`/api/passengers`)
- `GET /` - List all passengers
- `GET /:id` - Get passenger details
- `POST /` - Create new passenger
- `PUT /:id` - Update passenger profile
- `DELETE /:id` - Delete passenger

### Drivers (`/api/drivers`)
- `GET /` - List all drivers
- `GET /:id` - Get driver details
- `POST /` - Create new driver
- `PUT /:id` - Update driver profile
- `DELETE /:id` - Delete driver

### Rides (`/api/rides`)
- `GET /` - List all rides
- `GET /:id` - Get ride details
- `POST /` - Create new ride
- `PUT /:id` - Update ride status
- `DELETE /:id` - Cancel ride

### Feedback (`/api/feedbacks`)
- `GET /` - List all feedback
- `POST /` - Submit feedback
- `GET /:id` - Get feedback details

### Admin (`/api/admins`)
- `GET /users` - List all users
- `GET /stats` - Get system statistics
- `POST /verify-driver` - Verify driver
- `DELETE /users/:id` - Remove user

## Project Structure

```
csa-api-capstoneVersion/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── adminController.js   # Admin operations
│   ├── driverController.js  # Driver management
│   ├── passengerController.js # Passenger management
│   ├── rideController.js    # Ride operations
│   ├── feedbackController.js # Feedback handling
│   └── dashboardController.js # Dashboard data
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── adminRoutes.js       # Admin endpoints
│   ├── driverRoutes.js      # Driver endpoints
│   ├── passengerRoutes.js   # Passenger endpoints
│   ├── rideRoutes.js        # Ride endpoints
│   ├── feedbackRoutes.js    # Feedback endpoints
│   └── dashboardRoutes.js   # Dashboard endpoints
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
├── .env                     # Environment variables (not in git)
├── .gitignore              # Git ignore rules
├── package.json            # Project dependencies
├── package-lock.json       # Dependency lock file
└── server.js               # Main application entry point
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Passwords are hashed using bcryptjs before storage in the database.

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot-reload

### Adding New Routes

1. Create a new controller in `controllers/`
2. Create a new route file in `routes/`
3. Import and register the route in `server.js`

## Security Considerations

- All passwords are hashed with bcryptjs
- JWT tokens are used for stateless authentication
- CORS is configured for frontend communication
- Environment variables are used for sensitive configuration
- Input validation should be implemented in controllers
- SQL injection prevention through parameterized queries

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: 2026
