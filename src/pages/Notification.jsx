import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Trash2, Check } from 'lucide-react';
import UserLayout from '../components/UserLayout';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to view notifications');
        setLoading(false);
        return;
      }

      // Decode the JWT token to get the user ID
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id; // Changed from userId to id to match token structure

      const response = await axios.get(`http://localhost:5003/notifications/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format from server');
      }
      
      const notifications = response.data.data.notifications || [];
      setNotifications(notifications);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to notification server. Please check your connection.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notifications');
      }
      setNotifications([]);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to mark notifications as read');
        return;
      }
      
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id;
      
      const response = await axios.patch(
        `http://localhost:5003/notifications/${notificationId}/markAsRead`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        ));
      } else {
        throw new Error(response.data.message || 'Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.response?.data?.message || 'Failed to mark notification as read. Please try again.');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to delete notifications');
        return;
      }
      
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id;
      
      const response = await axios.delete(`http://localhost:5003/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { userId } // Adding userId to request body for deletion
      });

      if (response.data.success) {
        setNotifications(notifications.filter(notif => notif._id !== notificationId));
      } else {
        throw new Error(response.data.message || 'Failed to delete notification');
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err.response?.data?.message || 'Failed to delete notification. Please try again.');
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) return (
    <UserLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A00]"></div>
      </div>
    </UserLayout>
  );

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-[#FF7A00] mr-2" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications to display
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg shadow-sm border ${
                  notification.read ? 'bg-white' : 'bg-orange-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

export default Notification;