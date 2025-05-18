# Auth Service

Authentication service for Nexon Event Management Platform.

## Description

This service handles user authentication and authorization, providing the following features:
- User registration
- User login with JWT token
- Token refresh mechanism
- Role-based access control

## Environment Variables

The following environment variables are required to run the service:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Port number for the service | `3000` | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT token generation | - | Yes |
| `JWT_EXPIRATION` | JWT token expiration time in seconds | `3600` | No |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiration time in seconds | `604800` | No |

## Running with Docker

### Build the image
```bash
docker build -t auth-service .
```

### Run the container
```bash
# Using environment variables
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  -e JWT_EXPIRATION=3600 \
  -e REFRESH_TOKEN_EXPIRATION=604800 \
  auth-service

# Or using .env file
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  auth-service
```

## API Documentation

Once the service is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```
