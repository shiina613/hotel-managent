# CORS Quick Start Guide

## ✅ What Was Done

CORS (Cross-Origin Resource Sharing) has been configured to allow your React frontend to communicate with the Spring Boot backend.

## 📁 Files Created

1. **src/main/java/com/hotel/management/config/CorsConfig.java**
   - Main CORS configuration using CorsFilter
   - Allows origins: `http://localhost:3000` and `http://localhost:5173`
   - Allows methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
   - Allows all headers and credentials

2. **src/main/java/com/hotel/management/config/WebConfig.java**
   - Additional CORS configuration using WebMvcConfigurer
   - Provides backup/alternative CORS setup
   - Same permissions as CorsConfig

3. **CORS_SETUP_GUIDE.md**
   - Comprehensive documentation
   - Troubleshooting guide
   - Production considerations

4. **frontend/test-cors.html**
   - Standalone HTML test tool
   - Tests CORS configuration without running React app
   - 4 different test scenarios

## 🚀 How to Test

### Step 1: Start Backend
```bash
./mvnw spring-boot:run
```

### Step 2: Test with HTML Tool (Easiest)
```bash
# Open in browser
open frontend/test-cors.html
# or
start frontend/test-cors.html
```

Click the test buttons to verify CORS is working.

### Step 3: Test with React App
```bash
cd frontend
npm run dev
```

Try logging in with:
- Username: `admin001`
- Password: `admin123`

## ✅ Expected Results

### Before CORS Fix
```
Access to fetch at 'http://localhost:8080/api/v1/auth/login' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

### After CORS Fix
```
✅ Login successful
✅ Token received
✅ Redirected to dashboard
```

## 🔍 Verify CORS Headers

Open browser DevTools (F12) → Network tab → Click on a request → Headers

You should see:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

## 🛠️ Troubleshooting

### Problem: Still getting CORS errors

**Solution:**
1. Restart Spring Boot application
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Check backend console for startup errors

### Problem: Backend won't start

**Solution:**
1. Check if port 8080 is already in use
2. Check for compilation errors: `./mvnw clean compile`
3. Check application.properties for database connection

### Problem: 404 Not Found

**Solution:**
1. Verify backend is running: `curl http://localhost:8080/api/v1/rooms`
2. Check controller mappings are correct
3. Ensure database is running and connected

## 📝 Configuration Details

### Allowed Origins
- `http://localhost:3000` - React default port
- `http://localhost:5173` - Vite default port

### Allowed Methods
- GET - Read data
- POST - Create data
- PUT - Update data (full)
- PATCH - Update data (partial)
- DELETE - Delete data
- OPTIONS - Preflight requests

### Allowed Headers
- All headers (`*`)
- Including: Authorization, Content-Type, etc.

### Credentials
- Enabled (`allowCredentials: true`)
- Allows cookies and authorization headers

## 🎯 Next Steps

1. ✅ CORS is configured
2. ✅ Frontend can call backend APIs
3. ⏭️ Test login flow
4. ⏭️ Build remaining features (rooms, bookings, invoices)
5. ⏭️ Add JWT authentication (optional)

## 📚 Additional Resources

- Full documentation: `CORS_SETUP_GUIDE.md`
- Frontend setup: `frontend/README.md`
- API testing: `API_TEST_PLAN.md`

## 🎉 Success Criteria

- [ ] Backend starts without errors
- [ ] test-cors.html shows all tests passing
- [ ] React app can login successfully
- [ ] No CORS errors in browser console
- [ ] Dashboard loads after login

---

**Your CORS configuration is complete and ready to use!** 🚀
