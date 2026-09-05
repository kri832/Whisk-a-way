Whisk-a-Way – Beyond the Plate
================================

Whisk-a-Way is a full‑stack restaurant experience platform inspired by the Dine Dash demo, rebuilt from scratch with a new brand identity based on the **Whisk‑a‑Way** logo and tagline **“Beyond the plate”**.

This project gives you:

- A Node.js + Express + MongoDB backend with JWT authentication
- A React frontend with modern, responsive UI
- Full ordering flow (menu → cart → checkout → confirmation)
- Table reservations with multi‑location support
- User accounts, favorites, and history
- An admin dashboard for managing menu items, orders, and reservations

The folder structure and features follow the specification in `FILE_STRUCTURE.txt`.

Quick Links
-----------

- `QUICK_START_GUIDE.txt` – 5‑minute setup
- `PROJECT_SUMMARY.md` – High‑level architecture overview
- `backend/` – API server
- `frontend/` – React single‑page application

Branding & Design
-----------------

The UI theme is built around the uploaded `Whisk-a-way logo.png`:

- Deep maroon background shades for primary surfaces
- Clean white typography for headings and navigation
- Rich navy accents for call‑to‑action buttons and interactive states
- Subtle metallic/silver highlights for dividers and badges

Compared to the original Dine Dash website, all core sections and flows are preserved, but the visuals, copy, and sample data are tailored to **Whisk‑a‑Way** and its fictional locations.

High‑Level Features
-------------------

- Authentication
  - Email/password registration and login
  - Persisted JWT sessions
  - Role‑based access (`user`, `admin`)
- Menu & Cart
  - Menu browsing with category and location filters
  - Add/remove items from cart, adjust quantities
  - Highlighted “Chef’s Specials” section
- Orders
  - Place orders from the cart with contact and location details
  - View order history in `My Orders`
  - Admin can view all orders and update status from the dashboard
- Reservations
  - Reserve tables at different Whisk‑a‑Way locations
  - View upcoming and past reservations
  - Admin can manage all reservations
- Extras beyond the original
  - Favorites: users can favorite menu items and see them in their profile
  - Multi‑location support baked into menu, reservations, and contact sections
  - “Beyond the Plate” storytelling on the home page (experiences, chef notes)
- Admin tools
  - Create users manually (guests or staff) without using the public signup form
  - Add new menu items for any location, including marking dishes as chef’s specials
  - See all reservations in one place with guest details
  - Use an interactive status dropdown (`updateOrderStatus`) to move orders from pending → confirmed → preparing → ready → completed/cancelled

Tech Stack
----------

- **Backend**
  - Node.js, Express
  - MongoDB with Mongoose
  - JSON Web Tokens (JWT) for auth
  - bcrypt for password hashing
  - dotenv, cors, morgan

- **Frontend**
  - React (Create React App–style structure)
  - React Router
  - Context API for auth and cart state
  - Axios for API calls

Running the Project
-------------------

You can run the entire application from the workspace root with a single command:

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Seed the database (Admin: `admin@whiskaway.com` / `admin123` or `admin@gmail.com` / `admin123`):**
   ```bash
   npm run seed
   ```

3. **Start both backend & frontend concurrently:**
   ```bash
   npm start
   ```

The frontend will open at `http://localhost:3000` and the API runs on `http://localhost:5001`.

License
-------

This project is provided as a learning and demo application. Adapt or extend it for your own projects as needed.

