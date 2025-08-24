import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowBigLeft, ArrowBigRight, Music } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const AllAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/albums/all-albums`, { withCredentials: true });
        setAlbums(Array.isArray(res.data) ? res.data : res.data.albums || []);
      } catch (err) {
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const latestALbums=albums.slice(0,8)



  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10  rounded-xl flex items-center justify-center ">
          <Music className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold">Latest Albums</h2>
      </div>
      <div className=" rounded-xl p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span className="ml-4 text-gray-400">Loading albums...</span>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-8">
            <Music className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">No albums found</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {latestALbums.map((album) => (
                <div
                  key={album._id}
                  className="group bg-white/6 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl cursor-pointer flex flex-col"
                  onClick={() => navigate(`/album/${album._id}`)}
                >
                  <div className="relative w-full aspect-square rounded-t-xl overflow-hidden flex items-center justify-center bg-black">
                    {album.thumbnailUrl ? (
                      <img src={album.thumbnailUrl} alt={album.name} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-90" />
                    ) : (
                      <Music className="w-10 h-10 sm:w-12 sm:h-12 text-white/60" />
                    )}
                  </div>
                  <div className="px-2 py-2 flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-white mb-1 truncate text-base">{album.name}</h3>
                    <p className="text-xs text-gray-400 mb-1">{album.artist || 'Unknown Artist'}</p>
                    <p className="text-xs text-gray-400 mb-1">{album.songs?.length || 0} songs</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link to="/all-albums">
                <button className="flex items-center justify-center gap-2 bg-white/6 hover:bg-white/10 hover:scale-103 cursor-pointer text-white px-5 py-2 rounded-lg text-base font-semibold transition-all duration-200">
                  See More Albums
                  <ArrowBigRight/>
                </button>
                
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAlbums;
