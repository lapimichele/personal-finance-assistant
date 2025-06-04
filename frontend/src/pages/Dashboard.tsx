import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserResponse } from '../types/auth';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-300"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a loading indicator, navigate is already handled in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Welcome, {user.firstName}!</h2>
        <p className="text-gray-700 dark:text-gray-300">Here's a summary of your financial overview.</p>
        {/* Add more dashboard content here */}
      </div>

      {/* Example of another card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h3>
          <p className="text-gray-700 dark:text-gray-300">View your account balances and activities.</p>
          {/* Add account summary content */}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <p className="text-gray-700 dark:text-gray-300">See your latest income and expenses.</p>
          {/* Add recent transactions content */}
        </div>
      </div>
    </div>
  );
} 