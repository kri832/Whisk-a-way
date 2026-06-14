# Whisk-a-Way - Complete File Structure

## 📁 Project Root
```
whisk-a-way/
├── backend/                    # Node.js/Express Backend
├── frontend/                   # React Frontend
├── .gitignore                  # Git ignore rules
├── DATABASE_SETUP.md           # Database setup instructions
├── FILE_STRUCTURE.md           # This file - Complete file structure documentation
├── NEW_FEATURES_SETUP.md       # Setup guide for email verification and payment features
├── PROJECT_SUMMARY.md          # Project overview and features
├── QUICK_START_GUIDE.txt       # Quick start instructions
├── README.md                   # Project documentation
└── SETUP_CHECKLIST.txt         # Setup checklist
```

---

## 🔧 Backend Structure

```
backend/
├── .env                        # Environment variables (MongoDB URI, JWT secret, port, email config)
├── package.json                # Backend dependencies and scripts
├── package-lock.json           # Dependency lock file
├── server.js                   # Main server entry point
├── seedData.js                 # Script to populate database with sample data
├── test-email.js               # Email testing script for development
│
├── models/                     # MongoDB/Mongoose Models
│   ├── User.js                 # User schema (name, email, password, role, favorites, isVerified, verificationToken, verificationTokenExpires)
│   ├── MenuItem.js             # Menu item schema (name, description, price, category, isSpecial)
│   ├── Order.js                # Order schema (user, items, status, totalAmount, paymentMethod, location, notes)
│   ├── Reservation.js          # Reservation schema (name, date, time, partySize, status)
│   └── Contact.js              # Contact form schema (name, email, phone, message)
│
├── routes/                     # API Route Handlers
│   ├── auth.js                 # Authentication routes (login, register, email verification, resend verification)
│   ├── users.js                # User CRUD operations
│   ├── menu.js                 # Menu item CRUD operations
│   ├── orders.js               # Order management (create, list with pagination/filtering, update status)
│   ├── reservations.js         # Reservation management
│   └── contacts.js             # Contact form submissions
│
├── middleware/
│   └── auth.js                 # JWT authentication middleware (user/admin role checks)
│
└── utils/
    └── email.js                # Email service (nodemailer) with mock mode for development
```

### Backend Architecture Flow:
```
server.js (Express app setup)
    ↓
middleware/auth.js (JWT verification)
    ↓
routes/*.js (API endpoints)
    ↓
models/*.js (Database schemas)
    ↓
MongoDB Database

Email Flow:
routes/auth.js → utils/email.js → nodemailer → User inbox (or console in mock mode)
```

### Key Backend Features:
- **Email Service**: Supports both production (Gmail/SMTP) and development (mock console logging) modes
- **Order Pagination**: Backend supports page, limit, date filtering, and sorting parameters
- **Token-based Verification**: 24-hour expiration for email verification tokens
- **Role-based Access**: Middleware checks for user/admin roles on protected routes

---

## ⚛️ Frontend Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   └── logo.png                # Website logo
│
├── .env                        # Frontend environment variables (API URL)
├── package.json                # Frontend dependencies and scripts
├── package-lock.json           # Dependency lock file
│
└── src/
    ├── index.js                # React app entry point
    ├── App.js                  # Main app component with routing
    ├── index.css               # Global CSS styles and CSS variables
    │
    ├── components/             # Reusable UI Components
    │   ├── Navbar/
    │   │   ├── Navbar.js       # Navigation bar component
    │   │   └── Navbar.css      # Navbar styles
    │   │
    │   ├── Footer/
    │   │   ├── Footer.js       # Footer component
    │   │   └── Footer.css      # Footer styles
    │   │
    │   ├── Toast/
    │   │   ├── Toast.js        # Notification toast component
    │   │   └── Toast.css       # Toast styles
    │   │
    │   ├── PrivateRoute/
    │   │   └── PrivateRoute.js # Protected route wrapper (requires authentication)
    │   │
    │   └── AdminRoute/
    │       └── AdminRoute.js   # Admin-only route wrapper
    │
    ├── context/                # React Context API (Global State)
    │   ├── AuthContext.js      # Authentication state (user, login, logout, verification)
    │   └── CartContext.js      # Shopping cart state (items, add, remove, clear)
    │
    ├── pages/                  # Page Components
    │   ├── Home/
    │   │   ├── Home.js         # Landing page with hero banner
    │   │   └── Home.css        # Home page styles
    │   │
    │   ├── Auth/
    │   │   ├── Login.js        # Login page with email verification handling
    │   │   ├── Login.css       # Login styles
    │   │   ├── Register.js     # Registration page
    │   │   ├── EmailVerification.js    # Email verification page (token validation)
    │   │   ├── EmailVerification.css   # Email verification styles
    │   │   ├── VerifyEmailPrompt.js    # Prompt to check email after registration
    │   │   └── VerifyEmailPrompt.css   # Email prompt styles
    │   │
    │   ├── Menu/
    │   │   ├── Menu.js         # Browse menu items with filters and favorites
    │   │   └── Menu.css        # Menu page & card styles
    │   │
    │   ├── Cart/
    │   │   ├── Cart.js         # Shopping cart page
    │   │   └── Cart.css        # Cart styles
    │   │
    │   ├── Checkout/
    │   │   ├── Checkout.js     # Checkout with payment method selection (Cash/Card/UPI)
    │   │   └── Checkout.css    # Checkout form & payment card styles
    │   │
    │   ├── OrderConfirmation/
    │   │   ├── OrderConfirmation.js    # Order success page with payment method display
    │   │   └── OrderConfirmation.css   # Confirmation styles
    │   │
    │   ├── MyOrders/
    │   │   ├── MyOrders.js     # User's order history with payment methods
    │   │   └── MyOrders.css    # Orders list styles
    │   │
    │   ├── Reservations/
    │   │   ├── Reservations.js # Book a table form
    │   │   └── Reservations.css # Reservation styles
    │   │
    │   ├── MyReservations/
    │   │   ├── MyReservations.js     # User's reservation history
    │   │   └── MyReservations.css    # Reservations list styles
    │   │
    │   ├── Contact/
    │   │   ├── Contact.js      # Contact form page
    │   │   └── Contact.css     # Contact form styles
    │   │
    │   ├── Profile/
    │   │   ├── Profile.js      # User profile with favorites management
    │   │   └── Profile.css     # Profile styles
    │   │
    │   └── Admin/
    │       ├── AdminDashboard.js     # Admin panel with enhanced order management (pagination, date filter, sorting)
    │       └── AdminDashboard.css    # Modern gold-themed admin dashboard styles
    │
    └── utils/                  # Utility Functions
        ├── api.js              # Axios instance with JWT token handling
        └── currency.js         # Currency formatting (INR ₹)
```

---

## 🔄 Data Flow Architecture

### 1. **Authentication & Email Verification Flow**
```
User Registration → Create User (isVerified: false) → Generate Token 
    ↓
Send Verification Email (or log in mock mode) → Show Email Prompt
    ↓
User Clicks Link → Validate Token → Set isVerified: true → Auto-login
    ↓
Store JWT Token → Redirect to Home
    ↓
PrivateRoute checks auth → Grant/Deny access
```

### 2. **Order Placement Flow**
```
Menu Page → Add to Cart → CartContext → Checkout Page
    ↓
Select Payment Method (Cash/Card/UPI) → Place Order
    ↓
POST /api/orders → Backend validates & saves → Returns order
    ↓
Navigate to OrderConfirmation → Display order details with payment method
    ↓
Admin Dashboard shows order with payment method tag
```

### 3. **Admin Order Management Flow**
```
Admin Login → AdminRoute → AdminDashboard
    ↓
Fetch orders with pagination (GET /api/orders?page=1&limit=15&date=YYYY-MM-DD)
    ↓
Backend returns: { orders: [...], pagination: { currentPage, totalPages, totalOrders, ... } }
    ↓
Display orders with date/time, pagination controls, and date filter
    ↓
Update order status / Filter by date / Navigate pages
    ↓
PATCH /api/orders/:id/status → Update status in real-time
```

### 4. **Admin Management Flow**
```
Admin Login → AdminRoute → AdminDashboard
    ↓
Fetch all data (orders, users, menu, reservations, contacts)
    ↓
Update order status / Add menu items / Manage users
    ↓
PATCH /api/orders/:id/status → Update status
POST /api/menu → Add new menu item
DELETE /api/users/:id → Remove user
```

---

## 🗄️ Database Schema

### **Users Collection**
- `_id`, `name`, `email`, `password` (hashed), `role` (user/admin)
- `favorites` [ObjectId] (favorite menu items)
- `isVerified` (boolean) - Email verification status
- `verificationToken` (string) - Token for email verification
- `verificationTokenExpires` (Date) - Token expiration time
- `createdAt`, `updatedAt`

### **MenuItems Collection**
- `_id`, `name`, `description`, `price`, `category`
- `location`, `isSpecial` (boolean)
- `createdAt`, `updatedAt`

### **Orders Collection**
- `_id`, `user` (ref), `customerName`, `items` [array]
- `status` (pending/confirmed/preparing/ready/completed/cancelled)
- `totalAmount`, `paymentMethod` (cash/card/upi)
- `location`, `notes`
- `createdAt`, `updatedAt`

### **Reservations Collection**
- `_id`, `user` (ref), `name`, `email`, `phone`
- `date`, `time`, `partySize`
- `status` (pending/confirmed/cancelled)
- `specialRequests`
- `createdAt`, `updatedAt`

### **Contacts Collection**
- `_id`, `name`, `email`, `phone`, `message`
- `createdAt`, `updatedAt`

---

## 🛣️ API Routes

### **Authentication** (`/api/auth`)
- `POST /login` - User login (checks email verification)
- `POST /register` - User registration (creates unverified user, sends email)
- `POST /favorites/:id` - Toggle favorite menu item
- `GET /verify/:token` - Verify email with token
- `POST /resend-verification` - Resend verification email

### **Users** (`/api/users`)
- `GET /` - Get all users (admin only)
- `POST /` - Create user (admin only)
- `DELETE /:id` - Delete user (admin only)

### **Menu** (`/api/menu`)
- `GET /` - Get all menu items
- `POST /` - Create menu item (admin only)
- `DELETE /:id` - Delete menu item (admin only)

### **Orders** (`/api/orders`)
- `POST /` - Create new order
- `GET /mine` - Get current user's orders
- `GET /` - Get all orders with pagination (admin only)
  - Query params: `page`, `limit`, `date`, `sortBy`, `sortOrder`
  - Returns: `{ orders: [...], pagination: {...} }`
- `PATCH /:id/status` - Update order status (admin only)

### **Reservations** (`/api/reservations`)
- `POST /` - Create reservation
- `GET /mine` - Get current user's reservations
- `GET /` - Get all reservations (admin only)
- `PATCH /:id/status` - Update reservation status (admin only)

### **Contacts** (`/api/contacts`)
- `POST /` - Submit contact form
- `GET /` - Get all contacts (admin only)

---

## 🎨 Frontend Routing

```
/                           → Home
/login                      → Login
/register                   → Register
/verify-email/:token        → Email Verification (auto-validates token)
/menu                       → Menu (Browse dishes)
/cart                       → Cart (View cart items)
/checkout                   → Checkout (Place order) *[Protected]*
/order-confirmation         → Order Confirmation
/my-orders                  → My Orders *[Protected]*
/reservations               → Book a Table *[Protected]*
/my-reservations            → My Reservations *[Protected]*
/contact                    → Contact Us
/profile                    → User Profile *[Protected]*
/admin                      → Admin Dashboard *[Admin Only]*
```

---

## 🔐 Key Features Implemented

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access (user/admin)
   - Protected routes
   - Email verification system with token validation

2. **Email Verification**
   - Token-based verification on registration
   - 24-hour token expiration
   - Mock email mode for development
   - Resend verification capability
   - Email verification status tracking

3. **Menu Management**
   - Browse with category filters & search
   - Favorite dishes (authenticated users)
   - Admin CRUD operations
   - Chef's Special indicators

4. **Ordering System**
   - Add to cart functionality
   - Payment method selection (Cash/Card/UPI)
   - Order tracking with status updates
   - Color-coded payment tags in admin
   - Detailed order history

5. **Admin Dashboard**
   - Modern gold-themed UI with glass-morphism
   - Manage users, menu, orders, reservations, contacts
   - Enhanced order management:
     - Date/time display
     - Pagination (15 per page)
     - Date filtering
     - Chronological sorting
   - Real-time order status updates
   - Visual payment method indicators

6. **Reservation System**
   - Book tables with date/time selection
   - Reservation status management
   - Admin confirmation workflow

7. **UI/UX Features**
   - Responsive design for all devices
   - Toast notifications
   - Interactive payment selection cards
   - Smooth animations & hover effects
   - Modern gradient backgrounds
   - Glass-morphism effects

---

## 🚀 Technology Stack

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt.js (password hashing)
- nodemailer (email verification)

### **Frontend**
- React 18
- React Router v6
- Context API (state management)
- Axios (HTTP client)

### **Styling**
- Pure CSS (no frameworks)
- CSS Variables for theming
- Responsive grid layouts
- Modern gradients and animations
- Glass-morphism effects

---

## 📝 Notes

- **Environment Variables**: Both backend and frontend have `.env` files for configuration
- **Seeding**: Run `npm run seed` in backend to populate sample data
- **API Base URL**: Configured in `frontend/.env` as `REACT_APP_API_URL`
- **Payment Methods**: cash, card, upi (stored as strings in database)
- **Default Payment**: Falls back to 'cash' if not specified
- **Email Service**: 
  - Development: Mock mode (logs to console)
  - Production: Gmail/SMTP with app passwords
- **Order Pagination**: Default 15 orders per page, configurable via query params
- **Email Verification**: Required before first login, 24-hour token expiry

---

**Last Updated**: April 24, 2026
