# Admin Dashboard Guide

## Overview

A complete admin dashboard for the Hotel Management System with sidebar navigation, protected routes, and management pages for all core features.

---

## 🎨 Features Implemented

### 1. Admin Layout
- **Left Sidebar Navigation**
  - Logo and branding
  - Menu items with icons
  - Active state highlighting
  - Logout button
  - User profile display
  - Collapsible on mobile

- **Top Header**
  - Hamburger menu toggle
  - Notifications icon
  - User avatar
  - Sticky positioning

- **Main Content Area**
  - Responsive padding
  - Clean background
  - Scrollable content

### 2. Pages Created

#### Dashboard (`/dashboard`)
- Welcome message with user info
- Stats cards (Rooms, Bookings, Invoices, Services)
- User information card
- Quick action buttons
- Clean, modern design

#### Rooms Page (`/rooms`)
- Stats overview (Total, Available, Occupied, Maintenance)
- Search and filter functionality
- Rooms table with status badges
- Pagination
- Action buttons (View, Edit, Delete)
- Add Room button

#### Services Page (`/services`)
- Stats cards (Total, Active, Inactive)
- Search and filter
- Grid layout with service cards
- Price display
- Active/Inactive toggle
- Edit and Delete actions

#### Bookings Page (`/bookings`)
- Stats overview (Total, Pending, Confirmed, Checked In)
- Search by booking code or guest name
- Filter by status and date
- Bookings table with all details
- Status badges with colors
- Action buttons (View, Edit, Cancel)

#### Invoices Page (`/invoices`)
- Revenue statistics
- Pending amount tracking
- Search and filter by status/payment method
- Detailed invoice table
- Payment method display
- Mark as Paid functionality
- Print invoice option

### 3. Navigation & Routing
- **Protected Routes**: All admin pages require authentication
- **Auto-redirect**: Logged-in users can't access login page
- **Logout**: Clears localStorage and redirects to login
- **Active State**: Current page highlighted in sidebar

---

## 📁 File Structure

```
frontend/src/
├── components/
│   └── layout/
│       └── AdminLayout.jsx          # Main admin layout with sidebar
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx            # Login page (existing)
│   ├── DashboardPage.jsx            # Dashboard overview
│   ├── rooms/
│   │   └── RoomsPage.jsx            # Room management
│   ├── services/
│   │   └── ServicesPage.jsx         # Service management
│   ├── bookings/
│   │   └── BookingsPage.jsx         # Booking management
│   └── invoices/
│       └── InvoicesPage.jsx         # Invoice management
├── routes/
│   └── ProtectedRoute.jsx           # Route protection wrapper
├── api/
│   ├── axiosClient.js               # Axios configuration
│   └── authApi.js                   # Auth API calls
└── App.jsx                          # Main app with routing
```

---

## 🚀 How to Use

### Start the Application

```bash
# Terminal 1: Start backend
./mvnw spring-boot:run

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Access the Dashboard

1. **Login**: http://localhost:3000/login
   - Username: `admin001`
   - Password: `admin123`

2. **After Login**: Automatically redirected to `/dashboard`

3. **Navigate**: Use sidebar menu to access different pages

4. **Logout**: Click Logout button in sidebar

---

## 🎯 Page Features

### Dashboard
- **Stats Cards**: Display counts for rooms, bookings, invoices, services
- **User Info**: Shows logged-in user details
- **Quick Actions**: Buttons for common tasks

### Rooms
- **Table View**: All rooms with details
- **Status Badges**: Color-coded (Available=Green, Occupied=Red, etc.)
- **Filters**: Search, status, room type
- **Actions**: View, Edit, Delete each room

### Services
- **Grid Layout**: Card-based display
- **Price Display**: Formatted currency
- **Active Toggle**: Enable/disable services
- **Actions**: Edit, Activate/Deactivate, Delete

### Bookings
- **Comprehensive Table**: All booking details
- **Status Tracking**: Pending, Confirmed, Checked In, etc.
- **Date Display**: Check-in and check-out dates
- **Actions**: View, Edit, Cancel bookings

### Invoices
- **Financial Overview**: Revenue and pending amounts
- **Detailed Table**: Room amount, service amount, total
- **Payment Tracking**: Cash or Bank Transfer
- **Actions**: View, Print, Mark as Paid

---

## 🎨 Design System

### Colors
- **Primary**: Blue (`#0ea5e9`)
- **Success**: Green
- **Warning**: Yellow
- **Danger**: Red
- **Gray**: Neutral tones

### Status Colors
```javascript
// Room Status
AVAILABLE    → Green
OCCUPIED     → Red
MAINTENANCE  → Yellow
RESERVED     → Blue
UNAVAILABLE  → Gray

// Booking Status
PENDING      → Yellow
CONFIRMED    → Blue
CHECKED_IN   → Green
CHECKED_OUT  → Gray
CANCELLED    → Red

// Invoice Status
PENDING      → Yellow
PAID         → Green
PARTIALLY_PAID → Blue
OVERDUE      → Red
CANCELLED    → Gray
```

### Typography
- **Headings**: Bold, large
- **Body**: Regular, readable
- **Labels**: Small, uppercase

---

## 🔐 Authentication Flow

### Login Process
1. User enters credentials
2. API call to `/api/v1/auth/login`
3. On success:
   - Token saved to localStorage
   - User info saved to localStorage
   - Redirect to `/dashboard`
4. On error:
   - Display error message
   - Stay on login page

### Protected Routes
```javascript
// ProtectedRoute checks authentication
const isAuthenticated = authApi.isAuthenticated();

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

return children; // Render protected page
```

### Logout Process
1. User clicks Logout button
2. Clear localStorage:
   - Remove `token`
   - Remove `user`
3. Redirect to `/login`

---

## 📊 Data Flow

### Current Implementation
- **Placeholder Data**: All pages use static data arrays
- **No API Calls**: Data is hardcoded for demonstration

### Next Steps (API Integration)
```javascript
// Example: Fetch rooms from API
useEffect(() => {
  const fetchRooms = async () => {
    try {
      const response = await axiosClient.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };
  
  fetchRooms();
}, []);
```

---

## 🛠️ Customization

### Add New Menu Item

Edit `AdminLayout.jsx`:
```javascript
const menuItems = [
  // ... existing items
  {
    name: 'Reports',
    path: '/reports',
    icon: (
      <svg>...</svg>
    )
  }
];
```

### Add New Page

1. Create page component:
```javascript
// src/pages/reports/ReportsPage.jsx
const ReportsPage = () => {
  return <div>Reports Content</div>;
};
```

2. Add route in `App.jsx`:
```javascript
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <ReportsPage />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
```

### Change Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        500: '#your-color',
        600: '#your-color',
        700: '#your-color',
      }
    }
  }
}
```

---

## 📱 Responsive Design

### Mobile (< 768px)
- Sidebar hidden by default
- Hamburger menu to toggle
- Overlay when sidebar open
- Stacked stats cards
- Simplified tables

### Tablet (768px - 1024px)
- Sidebar visible
- 2-column grid for stats
- Full table display

### Desktop (> 1024px)
- Full sidebar always visible
- 4-column grid for stats
- Optimal spacing

---

## 🎯 Best Practices

### Component Organization
- One component per file
- Clear naming conventions
- Reusable components in `/components`
- Page-specific components in page folders

### State Management
- Use `useState` for local state
- Use `useEffect` for side effects
- Consider Context API for global state (future)

### Styling
- Tailwind utility classes
- Consistent spacing (p-4, p-6, etc.)
- Responsive classes (md:, lg:)
- Hover states for interactivity

### Code Quality
- Clear variable names
- Comments for complex logic
- Consistent formatting
- Error handling

---

## 🔄 Next Steps

### Phase 1: API Integration
- [ ] Connect Rooms page to backend API
- [ ] Connect Services page to backend API
- [ ] Connect Bookings page to backend API
- [ ] Connect Invoices page to backend API
- [ ] Add loading states
- [ ] Add error handling

### Phase 2: CRUD Operations
- [ ] Add Room form (Create/Edit)
- [ ] Add Service form (Create/Edit)
- [ ] Add Booking form (Create/Edit)
- [ ] Add Invoice form (Create)
- [ ] Delete confirmations
- [ ] Success/error notifications

### Phase 3: Advanced Features
- [ ] Real-time updates
- [ ] Search functionality
- [ ] Advanced filters
- [ ] Sorting
- [ ] Export to PDF/Excel
- [ ] Charts and graphs

### Phase 4: User Experience
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Confirmation modals
- [ ] Form validation
- [ ] Keyboard shortcuts
- [ ] Dark mode (optional)

---

## 🐛 Troubleshooting

### Sidebar Not Showing
- Check `sidebarOpen` state
- Verify `AdminLayout` is wrapping the page
- Check responsive classes

### Routes Not Working
- Verify `BrowserRouter` in `App.jsx`
- Check route paths match exactly
- Ensure `ProtectedRoute` is working

### Styles Not Applied
- Run `npm run dev` to rebuild
- Check Tailwind config
- Verify class names are correct

### Authentication Issues
- Check localStorage has `token` and `user`
- Verify `authApi.isAuthenticated()` logic
- Check backend CORS configuration

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

---

## ✅ Checklist

- [x] Admin layout with sidebar
- [x] Protected routes
- [x] Dashboard page
- [x] Rooms page
- [x] Services page
- [x] Bookings page
- [x] Invoices page
- [x] Logout functionality
- [x] Responsive design
- [x] Clean UI/UX
- [ ] API integration (next step)
- [ ] CRUD operations (next step)

---

**Your admin dashboard is ready to use!** 🎉

Start the app and explore all the pages. The next step is to connect them to your backend APIs.
