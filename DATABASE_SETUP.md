# Database setup – Whisk-a-Way

The website needs **MongoDB** for users, menu, orders, and reservations. If the database is not working, follow one of the options below.

---

## Option A: MongoDB Atlas (cloud, free tier, no local install)

Good if you don’t have MongoDB installed or want it to work from anywhere.

1. **Create an account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free).

2. **Create a free cluster**
   - Create a new project and a **free** cluster (e.g. M0).
   - Wait until the cluster is ready.

3. **Create a database user**
   - In the left menu: **Database Access** → **Add New Database User**.
   - Choose **Password** and set a username and password. Remember them.
   - User privileges: **Atlas admin** or **Read and write to any database**.

4. **Allow network access**
   - In the left menu: **Network Access** → **Add IP Address**.
   - For local development you can use **Allow Access from Anywhere** (`0.0.0.0/0`). For production, restrict to your server IP.

5. **Get the connection string**
   - Go to **Database** → your cluster → **Connect** → **Connect your application**.
   - Copy the URI. It looks like:
     ```text
     mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `USERNAME` and `PASSWORD` with your database user.
   - Add a database name before the `?` (e.g. `whisk-a-way`):
     ```text
     mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/whisk-a-way?retryWrites=true&w=majority
     ```

6. **Put it in the backend `.env`**
   - Open `backend/.env`.
   - Set:
     ```env
     MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/whisk-a-way?retryWrites=true&w=majority
     JWT_SECRET=your-long-random-secret-string
     PORT=5001
     ```
   - If the password has special characters (e.g. `#`, `@`), encode them (e.g. use `%23` for `#`).

7. **Start backend and seed**
   ```bash
   cd backend
   npm start
   ```
   In another terminal:
   ```bash
   cd backend
   npm run seed
   ```

---

## Option B: MongoDB installed on your Mac (local)

Good if you prefer everything to run on your machine.

1. **Install MongoDB**
   - With Homebrew:
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     ```
   - Or download the installer from [MongoDB Community Server](https://www.mongodb.com/try/download/community).

2. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```
   Or run once:
   ```bash
   mongod --config /opt/homebrew/etc/mongod.conf
   ```
   (Path may be `/usr/local/etc/mongod.conf` on Intel Macs.)

3. **Configure the backend**
   - In `backend/.env`:
     ```env
     MONGO_URI=mongodb://localhost:27017/whisk-a-way
     JWT_SECRET=your-long-random-secret-string
     PORT=5001
     ```

4. **Start backend and seed**
   ```bash
   cd backend
   npm start
   ```
   In another terminal:
   ```bash
   cd backend
   npm run seed
   ```

---

## Check if the database is working

1. **Backend health check**
   - With the backend running, open in the browser or with curl:
     ```text
     http://localhost:5001/api/health
     ```
   - You should see something like:
     ```json
     { "ok": true, "database": "connected", "message": "API and database are ready" }
     ```
   - If you see `"database": "disconnected"` or status 503, the app cannot reach MongoDB.

2. **Common issues**
   - **Backend won’t start / “Failed to connect to MongoDB”**
     - **Atlas:** Check MONGO_URI (username, password, cluster host, database name). Ensure IP is allowed under Network Access.
     - **Local:** Ensure MongoDB is running (`brew services list` or `pgrep -l mongod`).
   - **Login / menu / orders don’t work**
     - Run `npm run seed` in the `backend` folder so users and menu exist.
     - Confirm `REACT_APP_API_URL` in `frontend/.env` points to your backend (e.g. `http://localhost:5001/api`).

3. **Port**
   - If your backend uses a different port (e.g. 5001), use that in the health URL and in `REACT_APP_API_URL`.

Once `/api/health` shows `"database": "connected"` and you’ve run `npm run seed`, the website’s database is working.
