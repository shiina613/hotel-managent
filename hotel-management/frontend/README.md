# Hotel Management System - Frontend

A modern React frontend for the Hotel Management System built with Vite, React Router, Axios, and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axiosClient.js      # Axios configuration with interceptors
│   │   └── authApi.js          # Authentication API calls
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx   # Login page component
│   │   └── DashboardPage.jsx   # Dashboard page (protected)
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies and scripts
```

## Features Implemented

### Login Page
- Clean, modern UI with hotel/admin styling
- Form validation (username and password required)
- Loading state during API call
- Error handling with user-friendly messages
- Success handling with redirect to dashboard
- Token and user info storage in localStorage
- Responsive design

### API Integration
- Axios client with interceptors
- Automatic token injection in requests
- Error handling and response formatting
- Proxy configuration for backend API

### Routing
- React Router v6 setup
- Protected routes (requires authentication)
- Automatic redirects based on auth status
- Login page accessible only when not authenticated

### Authentication Flow
1. User enters credentials on login page
2. Form validates input
3. API call to `POST /api/v1/auth/login`
4. On success:
   - Token saved to localStorage (if provided)
   - User info saved to localStorage
   - Redirect to dashboard
5. On error:
   - Display error message
   - Allow retry

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:8080`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

Start the Vite dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the app for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing the Login Flow

### Step 1: Start the Backend
Make sure your Spring Boot backend is running on `http://localhost:8080`

### Step 2: Start the Frontend
```bash
cd frontend
npm run dev
```

### Step 3: Test Login

1. Open browser to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Use test credentials:
   - Username: `admin001`
   - Password: `admin123`
4. Click "Sign In"
5. On success, you'll be redirected to `/dashboard`

### Expected Backend Response Format

The login page expects this response format from the backend:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "userId": 1,
    "username": "admin001",
    "fullName": "Admin User",
    "email": "admin@hotel.com",
    "role": "ADMIN"
  }
}
```

**Note:** The code handles cases where `token` might be missing (as your backend currently returns a placeholder).

## API Configuration

The frontend is configured to call the backend at:
- Base URL: `http://localhost:8080/api/v1`
- Login endpoint: `POST /api/v1/auth/login`

To change the backend URL, edit `frontend/src/api/axiosClient.js`:
```javascript
baseURL: 'http://localhost:8080/api/v1'
```

## LocalStorage Data

After successful login, the following data is stored:

1. **token** - JWT token (if provided by backend)
2. **user** - User information object:
   ```json
   {
     "userId": 1,
     "username": "admin001",
     "fullName": "Admin User",
     "email": "admin@hotel.com",
     "role": "ADMIN"
   }
   ```

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your Spring Boot backend has CORS configured:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Backend Not Responding
- Verify backend is running on `http://localhost:8080`
- Check backend logs for errors
- Test backend directly with Postman

### Login Not Working
- Open browser DevTools (F12) → Network tab
- Check the API request/response
- Verify credentials match registered users
- Check backend logs for authentication errors

## Next Steps

After the login flow is working, you can add:

1. **Registration page** - Allow new users to register
2. **Room management** - CRUD operations for rooms
3. **Booking management** - Create and manage bookings
4. **Invoice management** - Generate and track invoices
5. **User profile** - View and edit user information
6. **Dashboard statistics** - Real data from backend APIs

## Demo Credentials

For testing, use these credentials (must be registered in backend first):

- **Admin User:**
  - Username: `admin001`
  - Password: `admin123`

- **Customer User:**
  - Username: `customer001`
  - Password: `customer123`

## License

This project is part of a graduation project.
