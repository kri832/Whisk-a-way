Whisk-a-Way – Project Summary
=============================

Vision
------

Whisk‑a‑Way is a modern restaurant platform that lets guests:

- Explore curated menus across multiple locations
- Place online orders with a seamless cart and checkout flow
- Reserve tables at different branches
- Manage their profile, favorites, orders, and reservations

It mirrors the core sections and flows of the Dine Dash demo site, but is rebuilt with:

- A new brand identity based on the **Whisk‑a‑Way** logo and tagline **“Beyond the plate”**
- A maroon + white + navy visual theme
- Extra features like favorites and richer multi‑location support

High-Level Architecture
-----------------------

- **Backend (`backend/`)**
  - Node.js + Express REST API
  - MongoDB via Mongoose for persistence
  - JWT authentication and role‑based access control
  - Routes for authentication, menu, orders, reservations, and admin user management

- **Frontend (`frontend/`)**
  - React single‑page application
  - React Router for navigation between pages
  - Context API for auth and cart state
  - Axios‑based API client
  - Responsive UI themed around the Whisk‑a‑Way logo

Core Domain Concepts
--------------------

- **User**
  - Fields: name, email, password hash, role (`user` or `admin`), favorites, timestamps
  - Auth flows: register, login, fetch profile

- **MenuItem**
  - Fields: name, description, price, category, image, location, isSpecial, availability
  - Used in menu browsing, cart, orders, and favorites

- **Order**
  - Ties a user to multiple menu items with quantities and a status
  - Powers cart → checkout → confirmation flows

- **Reservation**
  - Captures table bookings across different Whisk‑a‑Way locations
  - Fields: user, branch, date, time, party size, notes, status

Frontend Pages & Sections
-------------------------

- `Home` – Hero banner with logo and “Beyond the plate” messaging, featured dishes, and location highlights.
- `Menu` – Menu browser with category and location filters, plus “Chef’s Specials”.
- `Cart` – Overview of selected items and totals.
- `Checkout` – Basic checkout form and order placement.
- `Auth` – Login and registration screens.
- `Profile` – User info, favorites list, and quick links.
- `MyOrders` – Order history.
- `MyReservations` – Reservation history.
- `OrderConfirmation` – Post‑checkout status screen.
- `Reservations` – Table booking form with branch selector.
- `Contact` – Contact form and location contact details.
- `AdminDashboard` – Admin panel for:
  - Creating users manually (guests or staff)
  - Adding menu items for any location
  - Viewing all reservations with guest details
  - Viewing all orders and updating their status using the `updateOrderStatus` control.

Extra Features vs. Original
---------------------------

Beyond mirroring the original site’s flows, Whisk‑a‑Way adds:

- **Favorites system** – Users can favorite menu items and view them in the Profile page.
- **Location‑aware browsing** – Menu items, reservations, and contact sections all support multiple branches (e.g. Downtown, Riverside, Seaside).
- **Richer storytelling** – The home page and copy reference the “Beyond the plate” concept to emphasize experiences, not just food.

Intended Use
------------

This codebase is designed as:

- A learning resource for full‑stack JavaScript (Node + React).
- A strong starting point for a restaurant or hospitality product.
- A customizable demo that can be re‑skinned for other brands.

For detailed setup and usage, see `README.md` and `QUICK_START_GUIDE.txt`.

