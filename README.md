# 🎵 ECHOVIA - Music Streaming Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</div>

<div align="center">
  <h3>🎧 A modern, full-stack music streaming platform with real-time playback, playlist management, and admin controls</h3>
</div>

---

## 🌟 Live Demo

- **Project**: [https://echovia-music-player.vercel.app](https://echovia-music-player.vercel.app)
---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎵 Music Streaming
- **Real-time Audio Playback** with custom controls
- **YouTube Integration** for seamless music streaming
- **Playlist Management** (create, edit, delete, add songs)
- **Search Functionality** with instant results
- **Genre-based Browsing** for music discovery

### 🎨 User Interface
- **Glassmorphism Design** with modern UI/UX
- **Responsive Design** optimized for all devices
- **Mobile-friendly Sidebar** with overlay navigation
- **Dark Theme** with black, grey, and white aesthetics
- **Loading States** for all async operations
- **Custom Toast Notifications** matching app theme

### 👥 User Management
- **Authentication System** (Login/Signup/Logout)
- **Role-based Access Control** (User, Admin, Major Admin)
- **User Dashboard** with personalized features
- **Session Management** with persistent login

### ⚡ Performance
- **Cold Start Prevention** for serverless deployment
- **Optimized API Calls** with proper error handling
- **Lazy Loading** and code splitting
- **Cross-Origin Resource Sharing** (CORS) configured

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie parsing middleware
- **cors** - Cross-Origin Resource Sharing

### Deployment
- **Vercel** - Frontend deployment with custom domain
- **Render** - Backend deployment with serverless functions
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Media storage and optimization

---

## 📁 Project Structure

```
echovia/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MusicBar.jsx
│   │   │   ├── Song.jsx
│   │   │   └── ...
│   │   ├── pages/         # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── context/       # React Context for state management
│   │   │   └── AppContext.jsx
│   │   ├── assets/        # Static assets
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Public assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js     # Vite configuration
│
├── server/                # Backend Express application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   ├── connectDb.js
│   │   │   └── cloudinary.js
│   │   ├── controllers/   # Route controllers
│   │   │   ├── user.controller.js
│   │   │   ├── song.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/        # MongoDB models
│   │   │   ├── user.model.js
│   │   │   └── song.model.js
│   │   ├── routes/        # API routes
│   │   │   ├── user.routes.js
│   │   │   ├── song.routes.js
│   │   │   └── admin.routes.js
│   │   └── middlewares/   # Custom middleware
│   │       └── user.auth.js
│   ├── index.js           # Server entry point
│   ├── vercel.json        # Vercel deployment config
│   └── package.json
│
└── README.md              # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/ikeshav26/echovia.git
cd echovia
```

### 2. Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd ../server
npm install
```

### 3. Environment Configuration

Create `.env` files in both client and server directories:

**Client `.env`:**
```env
VITE_API_URL=http://localhost:5000
```

**Server `.env`:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the Application

**Development Mode:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🔐 Environment Variables

### Client Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

### Server Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/users/signup`
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/users/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### GET `/users/logout`
End user session and clear authentication.

### Music Endpoints

#### GET `/songs`
Retrieve all songs with pagination.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

#### POST `/songs/add` (Admin only)
Add a new song to the platform.

#### GET `/songs/search`
Search songs by title, artist, or genre.

**Query Parameters:**
- `q`: Search query string

### Playlist Endpoints

#### GET `/playlists/fetch`
Get user's playlists.

#### POST `/playlists/create`
Create a new playlist.

#### DELETE `/playlists/delete/:id`
Delete a playlist.

#### POST `/playlists/add-song/:playlistId`
Add a song to playlist.

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel --prod
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard
   - Add `VITE_API_URL` with your backend URL

### Backend Deployment (Render)

1. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.js"
       }
     ],
     "functions": {
       "index.js": {
         "maxDuration": 30
       }
     }
   }
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy as a web service

---

## 👥 User Roles

### 🔵 User (Default Role)
- **Permissions:**
  - Browse and stream music
  - Create and manage personal playlists
  - Search for songs and artists
  - Access user dashboard

### 🟡 Admin
- **Permissions:**
  - All user permissions
  - Add new songs to the platform
  - Manage song metadata
  - Access admin dashboard
  - View platform statistics

### 🔴 Major Admin
- **Permissions:**
  - All admin permissions
  - Manage user roles
  - System-wide configuration
  - Advanced analytics
  - Platform maintenance

---

## 🎯 Key Features Explained

### Music Streaming Engine
- **YouTube Integration**: Seamless streaming from YouTube with custom controls
- **Real-time Playback**: Instant play/pause, seek, and volume controls
- **Queue Management**: Add songs to queue, shuffle, and repeat modes

### Responsive Design
- **Mobile-First Approach**: Optimized for mobile devices
- **Glassmorphism UI**: Modern design with backdrop blur effects
- **Dark Theme**: Consistent black, grey, and white color scheme

### State Management
- **React Context**: Global state management for user, music, and UI state
- **Persistent Storage**: User preferences and playlist data stored locally
- **Real-time Updates**: Instant updates across components

---

## 🔧 Development Commands

### Client Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Server Commands
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm run build        # Prepare for deployment
```

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Keshav Sharma**
- GitHub: [@ikeshav26](https://github.com/ikeshav26)
- Website: [ikeshav.tech](https://ikeshav.tech)

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vercel** for seamless deployment
- **MongoDB** for reliable database hosting
- **Tailwind CSS** for beautiful styling utilities
- **YouTube** for music streaming capabilities

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/ikeshav26">Keshav Gilhotra</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
