# CORS Configuration Guide

## Overview

CORS (Cross-Origin Resource Sharing) has been configured to allow your React frontend to communicate with the Spring Boot backend.

## Problem Solved

**Before:** Frontend requests from `http://localhost:3000` or `http://localhost:5173` were blocked by the browser's CORS policy when trying to access `http://localhost:8080/api/v1/*`

**After:** Frontend can now make API calls to the backend without CORS errors.

---

## Configuration Files Created

### 1. CorsConfig.java
**Location:** `src/main/java/com/hotel/management/config/CorsConfig.java`

**Purpose:** Configures CORS using a `CorsFilter` bean

**Features:**
- ✅ Allows credentials (cookies, authorization headers)
- ✅ Allows origins: `http://localhost:3000` and `http://localhost:5173`
- ✅ Allows all headers
- ✅ Allows methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- ✅ Exposes necessary headers to frontend
- ✅ Sets max age for preflight requests (1 hour)
- ✅ Applies to all `/api/**` endpoints

### 2. WebConfig.java
**Location:** `src/main/java/com/hotel/management/config/WebConfig.java`

**Purpose:** Additional CORS configuration using `WebMvcConfigurer`

**Features:**
- ✅ Global CORS mapping for `/api/**`
- ✅ Same allowed origins, methods, and headers
- ✅ Provides a backup/alternative CORS configuration

---

## How It Works

### 1. Simple Requests
For simple GET/POST requests, the browser:
1. Sends the request with an `Origin` header
2. Backend responds with `Access-Control-Allow-Origin` header
3. Browser allows the response to be read by JavaScript

### 2. Preflight Requests
For complex requests (PUT, DELETE, custom headers), the browser:
1. Sends an OPTIONS request first (preflight)
2. Backend responds with allowed methods, headers, origins
3. If approved, browser sends the actual request
4. Backend processes and responds

### 3. Credentials
When `allowCredentials(true)` is set:
- Frontend can send cookies and authorization headers
- Backend can set cookies in responses
- Required for JWT token authentication

---

## Testing CORS

### Test 1: Login Request
```bash
# From your React frontend
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin001","password":"admin123"}'
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

### Test 2: Preflight Request
```bash
curl -X OPTIONS http://localhost:8080/api/v1/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 3600
```

---

## Frontend Configuration

Your React frontend is already configured correctly in `axiosClient.js`:

```javascript
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

The Vite proxy in `vite.config.js` is optional but can help:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

---

## Troubleshooting

### Issue 1: Still Getting CORS Errors

**Solution:**
1. Restart your Spring Boot application
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console for exact error message
4. Verify backend is running on port 8080

### Issue 2: Credentials Not Working

**Problem:** Cookies or Authorization headers not being sent

**Solution:**
1. Ensure `allowCredentials(true)` is set in CORS config
2. In frontend, use `withCredentials: true` in axios:
```javascript
axios.post('/api/v1/auth/login', data, {
  withCredentials: true
});
```

### Issue 3: Custom Headers Blocked

**Problem:** Custom headers like `X-Custom-Header` are blocked

**Solution:**
Already handled by `allowedHeaders("*")` in the config. If still blocked, explicitly add:
```java
config.setAllowedHeaders(Arrays.asList(
    "Authorization",
    "Content-Type",
    "X-Custom-Header"
));
```

### Issue 4: Different Port Numbers

**Problem:** Frontend runs on a different port (e.g., 5174, 3001)

**Solution:**
Add the new origin to both config files:
```java
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001"  // Add new port
));
```

---

## Production Considerations

### For Production Deployment

**⚠️ Important:** Update CORS configuration before deploying to production!

```java
@Configuration
public class CorsConfig {
    
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(allowedOrigins));
        // ... rest of config
    }
}
```

**application.properties:**
```properties
# Development
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173

# Production
# app.cors.allowed-origins=https://yourdomain.com,https://www.yourdomain.com
```

### Security Best Practices

1. **Never use `*` for allowed origins in production**
   - ❌ Bad: `config.setAllowedOrigins(Arrays.asList("*"))`
   - ✅ Good: `config.setAllowedOrigins(Arrays.asList("https://yourdomain.com"))`

2. **Limit allowed methods**
   - Only allow methods your API actually uses
   - Remove OPTIONS if not needed (though usually required for preflight)

3. **Limit exposed headers**
   - Only expose headers that frontend needs to read
   - Don't expose sensitive headers

4. **Use HTTPS in production**
   - Always use `https://` origins in production
   - Never allow `http://` origins in production

---

## Verification Checklist

After starting your backend, verify CORS is working:

- [ ] Backend starts without errors
- [ ] Can access `http://localhost:8080/api/v1/rooms` in browser
- [ ] Frontend can call login API without CORS errors
- [ ] Browser DevTools Network tab shows CORS headers
- [ ] OPTIONS preflight requests return 200 OK
- [ ] POST/PUT/DELETE requests work from frontend

---

## Quick Test Commands

### Start Backend
```bash
./mvnw spring-boot:run
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Test Login from Browser Console
```javascript
fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin001',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Spring CORS Documentation](https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html)
- [Understanding CORS](https://web.dev/cross-origin-resource-sharing/)

---

## Summary

✅ CORS is now configured for your Hotel Management System
✅ Frontend can call backend APIs without CORS errors
✅ Both development ports (3000 and 5173) are allowed
✅ All necessary HTTP methods are enabled
✅ Credentials are supported for authentication
✅ Configuration is production-ready with minor adjustments needed

Your React frontend should now be able to successfully call the Spring Boot backend APIs! 🎉
