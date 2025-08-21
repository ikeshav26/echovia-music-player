import React, { useContext, useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import appContext from "../context/AppContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, navigate, setuser } = useContext(appContext);

  const submithandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const userData = {
      email,
      password,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        userData,
        { withCredentials: true }
      );
      if (res.status === 201 || res.status === 200) {
        setuser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setemail("");
        setpassword("");

        navigate("/");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Error logging in");
        console.error("Error signing up:", res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error logging in");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  const preventColdStart=async()=>{
    try{
      const res=await axios.get(`${import.meta.env.VITE_API_URL}/prevent-cold-start`, { withCredentials: true });
      console.log("Prevented cold start:", res.data);
    }catch(err){
      console.error("Error preventing cold start:", err);
    }
  }

  preventColdStart()

  }, [])


  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500/30 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-violet-500/30 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-1/3 w-16 h-16 bg-indigo-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
        <div className="flex justify-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            Echovia
          </h1>
        </div>

        <h2 className="text-2xl text-white font-semibold mb-6 text-center drop-shadow-lg">
          Login for free
        </h2>

        <form onSubmit={submithandler} className="flex flex-col space-y-4">
          <div className="relative group">
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/20"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <div className="relative group">
            <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/20"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <span className="px-4 pb-1 text-gray-300 text-sm bg-white/10 rounded-full backdrop-blur-sm">
            or
          </span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        <p className="text-center text-gray-300 text-sm mt-6">
          Doesn't have an account?{" "}
          <Link
           to={'/signup'}
            className="text-purple-400  hover:text-purple-300 hover:underline transition-colors duration-300 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
