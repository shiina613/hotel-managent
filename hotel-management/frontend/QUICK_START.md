# Quick Start Guide - Admin Dashboard

## 🚀 Get Started in 3 Steps

### Step 1: Start Backend
```bash
./mvnw spring-boot:run
```
Wait for: `Started HotelManagementApplication`

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
Open: http://localhost:3000

### Step 3: Login
- Username: `admin001`
- Password: `admin123`

---

## 📱 What You'll See

### After Login
You'll be redirected to the **Dashboard** with:
- Stats cards showing counts
- User information
- Quick action buttons

### Navigation Menu (Left Sidebar)
- 🏠 **Dashboard** - Overview and stats
- 🏨 **Rooms** - Manage hotel rooms
- 🛎️ **Services** - Manage hotel services
- 📅 **Bookings** - Manage reservations
- 🧾 **Invoices** - Manage billing
- 🚪 **Logout** - Sign out

---

## 🎯 Features Available

### Dashboard Page
✅ Welcome message with user name  
✅ Stats cards (Rooms, Bookings, Invoices, Services)  
✅ User information display  
✅ Quick action buttons  

### Rooms Page
✅ Room statistics (Total, Available, Occupied, Maintenance)  
✅ Search and filter functionality  
✅ Rooms table with status badges  
✅ View, Edit, Delete actions  
✅ Add Room button  

### Services Page
✅ Service statistics (Total, Active, Inactive)  
✅ Grid layout with service cards  
✅ Price display in IDR currency  
✅ Active/Inactive status  
✅ Edit and Delete actions  

### Bookings Page
✅ Booking statistics by status  
✅ Search by booking code or guest  
✅ Filter by status and date  
✅ Complete booking details table  
✅ View, Edit, Cancel actions  

### Invoices Page
✅ Revenue and pending amount tracking  
✅ Search and filter functionality  
✅ Detailed invoice table  
✅ Payment method display  
✅ Mark as Paid functionality  

---

## 🎨 UI Features

### Responsive Design
- ✅ Mobile-friendly sidebar (collapsible)
- ✅ Tablet and desktop optimized
- ✅ Touch-friendly buttons

### Visual Feedback
- ✅ Hover effects on buttons
- ✅ Active state in navigation
- ✅ Color-coded status badges
- ✅ Loading states (ready for API)

### User Experience
- ✅ Clean, modern design
- ✅ Intuitive navigation
- ✅ Consistent layout
- ✅ Professional appearance

---

## 🔐 Authentication

### Login Flow
1. Enter username and password
2. Click "Sign In"
3. On success → Redirect to Dashboard
4. On error → Show error message

### Protected Pages
All admin pages require authentication:
- If not logged in → Redirect to Login
- If logged in and visit /login → Redirect to Dashboard

### Logout
Click "Logout" in sidebar:
- Clears localStorage
- Redirects to Login page

---

## 📊 Current Data

### Note: Using Placeholder Data
All pages currently show **static placeholder data** for demonstration:
- Rooms: 3 sample rooms
- Services: 4 sample services
- Bookings: 3 sample bookings
- Invoices: 3 sample invoices

### Next Step: API Integration
Connect pages to your backend API to show real data.

---

## 🛠️ Troubleshooting

### Can't Login?
- ✅ Backend running on port 8080?
- ✅ CORS configured correctly?
- ✅ User registered in database?
- ✅ Check browser console for errors

### Sidebar Not Showing?
- ✅ Click hamburger menu (mobile)
- ✅ Check screen size (responsive)
- ✅ Refresh page

### Styles Look Wrong?
- ✅ Run `npm run dev` again
- ✅ Clear browser cache
- ✅ Check Tailwind is working

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── AdminLayout.jsx      ← Sidebar + Header
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx        ← Login
│   │   ├── DashboardPage.jsx        ← Dashboard
│   │   ├── rooms/
│   │   │   └── RoomsPage.jsx        ← Rooms
│   │   ├── services/
│   │   │   └── ServicesPage.jsx     ← Services
│   │   ├── bookings/
│   │   │   └── BookingsPage.jsx     ← Bookings
│   │   └── invoices/
│   │       └── InvoicesPage.jsx     ← Invoices
│   ├── routes/
│   │   └── ProtectedRoute.jsx       ← Auth guard
│   ├── api/
│   │   ├── axiosClient.js           ← HTTP client
│   │   └── authApi.js               ← Auth functions
│   └── App.jsx                      ← Main routing
└── package.json
```

---

## 🎯 Next Steps

### 1. Test All Pages
- [ ] Login and logout
- [ ] Navigate to each page
- [ ] Check responsive design
- [ ] Test on mobile

### 2. API Integration
- [ ] Connect Rooms to `/api/v1/rooms`
- [ ] Connect Services to `/api/v1/services`
- [ ] Connect Bookings to `/api/v1/bookings`
- [ ] Connect Invoices to `/api/v1/invoices`

### 3. Add CRUD Operations
- [ ] Create forms for adding data
- [ ] Edit forms for updating data
- [ ] Delete confirmations
- [ ] Success/error notifications

### 4. Enhance UX
- [ ] Loading spinners
- [ ] Error messages
- [ ] Form validation
- [ ] Toast notifications

---

## 💡 Tips

### Development
- Use browser DevTools (F12) to debug
- Check Network tab for API calls
- Use React DevTools extension
- Keep console open for errors

### Testing
- Test on different screen sizes
- Try all navigation links
- Test logout and login again
- Check localStorage in DevTools

### Customization
- Colors: Edit `tailwind.config.js`
- Layout: Edit `AdminLayout.jsx`
- Pages: Edit individual page files
- Routes: Edit `App.jsx`

---

## 📚 Documentation

- **Full Guide**: `ADMIN_DASHBOARD_GUIDE.md`
- **Frontend Setup**: `README.md`
- **API Testing**: `../API_TEST_PLAN.md`
- **CORS Setup**: `../CORS_QUICK_START.md`

---

## ✅ Success Checklist

- [x] Backend running
- [x] Frontend running
- [x] Can login successfully
- [x] Dashboard loads
- [x] Can navigate to all pages
- [x] Sidebar works
- [x] Logout works
- [x] Responsive on mobile
- [ ] API integration (next)
- [ ] CRUD operations (next)

---

**You're all set!** 🎉

Your admin dashboard is ready to use. Start exploring the pages and when you're ready, connect them to your backend APIs.

**Need Help?**
- Check `ADMIN_DASHBOARD_GUIDE.md` for detailed documentation
- Review browser console for errors
- Verify backend is running and CORS is configured
