Whisk-a-Way – Project Summary
=============================

Vision
------

Whisk‑a‑Way is a modern restaurant platform that lets guests:

- Explore curated menus with advanced filtering and search capabilities
- Place online orders with a seamless cart, checkout, and payment selection flow
- Reserve tables at different restaurant branches
- Manage their profile, favorites, orders, and reservations
- Track order history with detailed payment method information
- Verify email addresses for enhanced security

It mirrors the core sections and flows of the Dine Dash demo site, but is rebuilt with:

- A new brand identity based on the **Whisk‑a‑Way** logo and tagline **"Beyond the plate"**
- A maroon + white + navy visual theme with modern UI/UX design
- Enhanced features including payment method selection, favorites, email verification, and admin tracking
- Responsive design optimized for desktop and mobile devices

High-Level Architecture
-----------------------

- **Backend (`backend/`)**
  - Node.js + Express REST API
  - MongoDB via Mongoose for persistence
  - JWT authentication and role‑based access control (user/admin)
  - Routes for authentication, users, menu, orders, reservations, and contacts
  - Middleware for authentication and authorization
  - Database seeding script for sample data
  - Email service with nodemailer for verification (supports mock mode for development)

- **Frontend (`frontend/`)**
  - React 18 single‑page application
  - React Router v6 for navigation
  - Context API for authentication and cart state management
  - Axios‑based API client with automatic JWT token handling
  - Responsive UI with CSS variables and modern design patterns
  - Component-based architecture with reusable UI elements

Core Domain Concepts
--------------------

- **User**
  - Fields: name, email, password hash, role (`user` or `admin`), favorites [MenuItem IDs], isVerified, verificationToken, verificationTokenExpires, timestamps
  - Auth flows: register, login, email verification, profile management
  - Email domain validation for registration (Gmail, Hotmail, Yahoo, Outlook, iCloud)
  - Email verification required before login (with resend capability)

- **MenuItem**
  - Fields: name, description, price, category, location, isSpecial (Chef's Special), timestamps
  - Used in menu browsing, cart, orders, and favorites
  - Supports multi-location restaurants

- **Order**
  - Fields: user (ref), customerName, items [array], status, totalAmount, paymentMethod, location, notes, timestamps
  - Status flow: pending → confirmed → preparing → ready → completed/cancelled
  - Payment methods: cash, card, upi (with color-coded admin tags)
  - Powers cart → checkout → payment selection → confirmation flows
  - Admin pagination support (15 orders per page)
  - Date-based filtering for order management
  - Chronological sorting (newest first by default)

- **Reservation**
  - Fields: user (ref), name, email, phone, date, time, partySize, status, specialRequests, timestamps
  - Status flow: pending → confirmed/cancelled
  - Captures table bookings across different Whisk‑a‑Way locations

- **Contact**
  - Fields: name, email, phone, message, timestamps
  - Powers the contact form for guest inquiries and feedback

Frontend Pages & Sections
-------------------------

- `Home` – Hero banner with logo and "Beyond the plate" messaging, featured sections, and call-to-action buttons.
- `Menu` – Menu browser with:
  - Category filtering (Starters, Mains, Desserts, etc.)
  - Real-time search functionality
  - Chef's Special indicators
  - Add to cart and favorite dish functionality
  - Responsive card layout with hover effects
- `Cart` – Shopping cart overview with:
  - Item quantities and subtotal calculation
  - Remove items functionality
  - Running total with item count
- `Checkout` – Enhanced checkout form with:
  - Customer name input
  - Visual payment method selection (Cash 💵 / Card 💳 / UPI 📱)
  - Interactive payment cards with hover and active states
  - Kitchen notes field
  - Order summary with GST (5%) calculation and grand total
- `Auth` – Login and registration screens with:
  - Email domain validation
  - Email verification system with token-based verification
  - Form validation and error handling
  - Redirect to previous page after login
  - Resend verification email capability
  - Email verification prompt page
- `EmailVerification` – Email verification page with:
  - Token validation from email link
  - Auto-login after successful verification
  - Error handling for invalid/expired tokens
- `Profile` – User profile management with:
  - Account information display
  - Favorite dishes list
  - Quick links to orders and reservations
- `MyOrders` – Order history with:
  - Order status tracking
  - Item details and totals
  - Payment method information
- `MyReservations` – Reservation history with:
  - Upcoming and past reservations
  - Status indicators
- `OrderConfirmation` – Post‑checkout confirmation screen with:
  - Order ID and status
  - Payment method display
  - Item breakdown
  - Quick navigation to menu or order history
- `Reservations` – Table booking form with:
  - Date and time selection
  - Party size input
  - Special requests field
- `Contact` – Contact form and restaurant information
- `AdminDashboard` – Comprehensive admin panel with modern gold-themed UI:
  - **Users**: Create users manually, view all users, delete accounts
  - **Menu**: Add new dishes, view menu items, remove dishes
  - **Reservations**: View all bookings, confirm reservations
  - **Orders**: Enhanced order management with:
    - Date and time display for each order
    - Pagination (15 orders per page) with Previous/Next controls
    - Date filter to view orders for specific dates
    - Chronological sorting (newest first)
    - Color-coded payment tags (🟢 Cash, 🔵 Card, 🟣 UPI)
    - Order count summary with filter status
    - Update order status workflow
  - **Contacts**: View all contact form submissions

Key Features
------------

Beyond mirroring the original site's flows, Whisk‑a‑Way includes:

### **Email Verification System**
- Token-based email verification on registration
- Users must verify email before first login
- 24-hour token expiration
- Resend verification email from login page
- Mock email mode for development (logs to console)
- Production-ready with Gmail/SMTP support
- Email verification status tracking in user model

### **Admin Dashboard Enhancements**
- Modern gold-themed gradient design with glass-morphism effects
- Smooth animations and hover effects throughout
- Order management with date/time display
- Pagination system (15 orders per page)
- Date filtering for order history
- Chronological sorting (newest first)
- Responsive design for all screen sizes
- Enhanced visual feedback and user experience

### **Payment Method System**
- Visual payment selection at checkout (Cash, Card, UPI)
- Interactive card-based UI with hover effects and active states
- Backend storage of payment method with every order
- Color-coded payment tags in admin dashboard for quick identification
- Payment method display in order confirmation and user order history

### **Favorites System**
- Users can favorite menu items from the Menu page
- Favorite dishes are stored in user profile
- Quick access to favorites from Profile page
- Requires authentication to use

### **Advanced Menu Browsing**
- Category-based filtering system
- Real-time search across dish names and descriptions
- Chef's Special badges for featured items
- Responsive card grid layout with consistent sizing
- Hover animations and smooth transitions

### **Order Management**
- Complete cart functionality with add/remove items
- GST calculation (5%) with rounding
- Order status tracking through multiple stages
- Admin order management with status updates
- Detailed order history for users

### **Reservation System**
- Table booking with date, time, and party size
- Reservation status management
- Admin confirmation workflow
- User reservation history

### **Admin Dashboard**
- Comprehensive management interface with modern UI/UX
- User management (create, view, delete)
- Menu item management (add, view, remove)
- Enhanced order tracking with:
  - Date and time display
  - Pagination and navigation
  - Date-based filtering
  - Payment method visibility
- Reservation management
- Contact form submission viewer

### **UI/UX Enhancements**
- Responsive design for all screen sizes
- Toast notifications for user feedback
- Loading states and error handling
- Smooth animations and transitions
- Consistent design system with CSS variables
- Mobile-optimized navigation
- Modern gradient backgrounds and glass-morphism effects

Intended Use
------------

This codebase is designed as:

- A comprehensive learning resource for full‑stack JavaScript development (Node.js + Express + React + MongoDB)
- A production-ready starting point for a restaurant or hospitality business
- A customizable platform that can be re-branded for different restaurant chains
- A demonstration of modern web development practices including:
  - RESTful API design
  - JWT authentication and authorization
  - State management with React Context
  - Responsive UI/UX design
  - Database modeling with Mongoose
  - Component-based React architecture
  - Email verification and security best practices

Technology Stack
----------------

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose ODM
- JWT (JSON Web Tokens) for authentication
- bcrypt.js for password hashing
- CORS for cross-origin requests
- nodemailer for email verification

**Frontend:**
- React 18
- React Router v6
- Context API (state management)
- Axios (HTTP client)
- Pure CSS with CSS Variables

**Development:**
- Git for version control
- npm for package management
- Environment variables for configuration

For detailed setup and usage, see `README.md`, `QUICK_START_GUIDE.txt`, and `FILE_STRUCTURE.md`.

Recent Updates
--------------

**April 2026:**

### Email Verification & Security
- ✅ Implemented email verification system with token-based verification
- ✅ Added email verification prompt and resend functionality
- ✅ Created mock email service for development (console logging)
- ✅ Production-ready email support with nodemailer
- ✅ Email verification required before login
- ✅ 24-hour token expiration for security

### Admin Dashboard Enhancements
- ✅ Added date and time display to orders table
- ✅ Implemented pagination (15 orders per page)
- ✅ Added date filter for viewing orders by specific date
- ✅ Chronological sorting (newest orders first)
- ✅ Order count summary with filter status
- ✅ Complete CSS redesign with modern gold theme
- ✅ Glass-morphism effects and gradient backgrounds
- ✅ Smooth animations and hover effects
- ✅ Enhanced responsive design for mobile devices
- ✅ Improved visual hierarchy and user experience

### Payment & Checkout Features
- ✅ Added payment method selection at checkout (Cash, Card, UPI)
- ✅ Implemented color-coded payment tags in admin dashboard
- ✅ Enhanced menu card layout with responsive grid
- ✅ Added payment method display in order confirmation
- ✅ Improved backend to store and retrieve payment methods
- ✅ Created comprehensive file structure documentation
- ✅ Fixed menu card alignment and sizing issues
- ✅ Added visual payment selection cards with interactive UI
