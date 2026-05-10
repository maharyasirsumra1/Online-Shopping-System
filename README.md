# Online Shopping System (Advanced)

A full-stack advanced online shopping system with a comprehensive admin dashboard, product management, cart functionality, and user authentication.

## Features
- **Frontend**: Responsive UI built with React, Vite, TailwindCSS, and Framer Motion.
- **Backend**: Robust API built with Node.js, Express, and MySQL.
- **Authentication**: Secure JWT-based user authentication and bcrypt password hashing.
- **Admin Dashboard**: Full CRUD capabilities for products, categories, and user management.
- **File Uploads**: Supports multiple product image uploads.
- **Shopping Cart**: Fully functional cart and checkout process.

## Project Structure
- `frontend/` - React frontend application.
- `backend/` - Node.js and Express backend API.
- `package.json` - Root package for running client and server concurrently.

## Installation and Setup

### Prerequisites
- Node.js installed
- MySQL database server running

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/PuneethReddyHC/online-shopping-system-advanced.git
   cd online-shopping-system-advanced/Online-Shopping-System
   ```

2. **Install Dependencies**
   Run the following command in the root directory to install dependencies for both frontend and backend:
   ```bash
   npm run install-all
   ```

3. **Database Configuration**
   - Create a MySQL database (e.g., `onlineshop`).
   - Navigate to the `backend/` directory and configure your environment variables with your database credentials.

4. **Run the Application**
   From the root directory, start both the frontend and backend servers simultaneously:
   ```bash
   npm run dev
   ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
