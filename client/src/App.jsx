import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import appContext from "./context/AppContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreatePlaylist from "./pages/CreatePlaylist";
import MyPlaylists from "./pages/MyPlaylists";
import SongsInPlaylist from "./pages/SongsInPlaylist";
import SongData from "./components/SongData";
import UpdateSong from "./pages/UpdateSong";
import MusicBar from "./components/MusicBar";
import Genre from "./pages/Genre";
import AddToPlaylist from "./pages/AddToPlaylist";
import Result from "./pages/Result";
import { useEffect } from "react";
import axios from "axios";
import Album from "./pages/Album";
import AllAlbums from "./pages/AllAlbums";
import AddToAlbum from "./pages/AddToAlbum";
import SongPage from "./pages/SongPage";

const App = () => {
  const { user, audioRef, currentSong } = useContext(appContext);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/prevent-cold-start`,
          { withCredentials: true }
        );
        console.log("Prevented cold start:", res.data);
      } catch (err) {
        console.error("Error preventing cold start:", err);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  const location=useLocation()

  return (
    <div className="">
      {user && !location.pathname.startsWith('/song/') ? <Navbar /> : null}
      {user ? <Sidebar /> : null}
      {user ? <SongData /> : null}
      {user && !location.pathname.startsWith('/song/') ? <MusicBar/> : null}
      {user && (
        <audio
          ref={audioRef}
          src={currentSong?.streamUrl || currentSong?.audioUrl}
          preload="metadata"
          className="hidden"
        />
      )}

      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/user-dashboard"
          element={user ? <UserDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-dashboard"
          element={user ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-playlist"
          element={user ? <CreatePlaylist /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-playlists"
          element={user ? <MyPlaylists /> : <Navigate to="/login" />}
        />
        <Route
          path="/songs-in-playlist/:id"
          element={user ? <SongsInPlaylist /> : <Navigate to="/login" />}
        />
        <Route
          path="/update-song/:id"
          element={user ? <UpdateSong /> : <Navigate to="/login" />}
        />
        <Route
          path="/genre/:id"
          element={user ? <Genre /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-to-playlist/:id"
          element={user ? <AddToPlaylist /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-to-album/:id"
          element={user ? <AddToAlbum /> : <Navigate to="/login" />}
        />
        <Route
          path="/search/result"
          element={user ? <Result /> : <Navigate to="/login" />}
        />
        <Route path='/album/:id' element={user ? <Album /> : <Navigate to="/login" />} />
        <Route path='/all-albums' element={user ? <AllAlbums /> : <Navigate to="/login" />} />
        <Route path='/song/:id' element={user ? <SongPage /> : <Navigate to="/login" />} />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#27272a", 
            backdropFilter: "blur(16px)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          },
          success: {
            style: {
              background: "#27272a",
              color: "#ffffff",
              border: "1px solid rgba(34, 197, 94, 0.3)",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#27272a",
              color: "#ffffff",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
          loading: {
            style: {
              background: "#27272a",
              color: "#ffffff",
              border: "1px solid rgba(156, 163, 175, 0.3)",
            },
            iconTheme: {
              primary: "#9ca3af",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
