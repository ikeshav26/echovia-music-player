import React, { useEffect, useState } from 'react'
import { Users, Mail, Shield, Edit3, Search, UserCheck } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";

const ChangeRole = () => {
  const [email, setemail] = useState("")
  const [newrole, setnewrole] = useState("user")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const roles = [
    { value: 'user', label: 'User', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { value: 'admin', label: 'Admin', color: 'text-green-400', bg: 'bg-green-500/10' },
    { value: 'majorAdmin', label: 'Major Admin', color: 'text-purple-400', bg: 'bg-purple-500/10' }
  ];

  const getRoleStyle = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj || { color: 'text-gray-400', bg: 'bg-gray-500/10' };
  };

  const handleChangeRole = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admins/change-role`, 
        { email, newRole:newrole }, 
        { withCredentials: true }
      );
      
      toast.success(`Role updated successfully for ${email}`);
      
     
      setemail("");
      setnewrole("user");
      
    
      fetchUsers();
      
    } catch (err) {
      console.error('Error changing role:', err);
      toast.error(err.response?.data?.message || 'Error updating role');
    } finally {
      setIsSubmitting(false);
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admins/all-users`, { withCredentials: true });
      setUsers(res.data.users || []);
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Error fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [])

  
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
     
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          User Role Management
        </h2>
        <p className="text-sm text-gray-400">Manage user roles and permissions across the platform</p>
      </div>

     
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Change User Role
        </h3>
        
        <form onSubmit={handleChangeRole} className="space-y-4">
         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              User Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter user email address"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Role
            </label>
            <select
              value={newrole}
              onChange={(e) => setnewrole(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value} className="bg-zinc-800 ">
                  {role.label}
                </option>
              ))}
            </select>
          </div>

       
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border border-white/20 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Updating Role...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Update Role
              </>
            )}
          </button>
        </form>
      </div>

    
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users ({filteredUsers.length})
          </h3>
          
         
          <div className="relative max-w-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
          
            <div className="hidden sm:flex sm:items-center sm:justify-between w-full text-sm text-gray-400 border-b border-white/10 pb-3 mb-4">
              <div className="flex-1 pr-4 font-medium">Username</div>
              <div className="flex-1 px-4 text-center font-medium">Email Address</div>
              <div className="flex-1 pl-4 text-right font-medium">Current Role</div>
            </div>

           
            {filteredUsers.map((user, index) => {
              const roleStyle = getRoleStyle(user.role);
              
              return (
                <div
                  key={user._id || index}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 border border-white/10"
                >
                 
                  <div className="sm:hidden">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-base mb-1 truncate">
                          {user.username || 'Unknown User'}
                        </h4>
                        <p className="text-sm text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.color} ml-3 flex-shrink-0`}>
                        {roles.find(r => r.value === user.role)?.label || user.role}
                      </span>
                    </div>
                  </div>

               
                  <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="font-semibold text-white text-base truncate">
                        {user.username || 'Unknown User'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 px-4 text-center">
                      <div className="text-gray-300 text-sm truncate">
                        {user.email}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pl-4 flex justify-end">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${roleStyle.bg} ${roleStyle.color}`}>
                        {roles.find(r => r.value === user.role)?.label || user.role}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChangeRole
