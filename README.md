# 🚀 Job Portal Application

A specialized Node.js Express backend for a Job Portal system. This application manages user accounts and job-related data using MongoDB.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Environment Management:** Dotenv
* **Security:** Helmet, Express-Mongo-Sanitize, XSS-Clean

---

## ⚙️ Installation & Setup

1.  **Clone the project:**
    ```bash
    git clone  https://github.com/kaunghtetzaw139432/Job_Portal.git
    cd JOB-PORTAL
    ```

2.  **Install all dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup (.env):**
    Create a `.env` file in the root directory and add your configurations:
    ```env
    PORT=8080
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Start the server:**
    ```bash
    # For Development (using nodemon)
    npm run server
    
    # For Production
    npm start
    ```

---

## 🔑 Core API Endpoints

### 1. User Authentication (`/auth`)

* **Register User** (`POST /register`): Create a new user account.
    * **Fields:** `name`, `lastName`, `email`, `password`, `location`.
* **Login User** (`POST /login`): Authenticate and get access.
    * **Fields:** `email`, `password`.

### 2. Job Operations (`/job`)
* Supports full CRUD operations for job postings including:
    * **Company Name**
    * **Position**
    * **Status** (pending, reject, interview)
    * **Work Type** (full-time, part-time, internship, freelance)

---

## 📁 Folder Structure

```text
JOB-PORTAL/
├── controllers/    # Logical processing for routes
├── models/         # MongoDB schemas (User, Job)
├── routes/         # API path definitions
├── middleware/     # Auth and error handling filters
├── server.js       # Main entry point of the application
├── .gitignore      # Files excluded from GitHub
└── .env            # Private configuration variables
