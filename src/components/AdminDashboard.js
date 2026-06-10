import React, { useEffect, useState } from 'react';
import { supabase } from '../main.js';
import { motion, animate, useAnimation } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.role === 'admin') {
          const { data: userList } = await supabase.auth.listUsers();
          setUsers(userList);
          setLoading(false);
        } else {
          setLoading(false);
          // Redirect or show error
        }
      } catch (err) {
        setLoading(false);
        // Handle error
      }
    };
    fetchUsers();
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-bold mb-2">{user.email}</h3>
                <p className="text-gray-600">{user.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;