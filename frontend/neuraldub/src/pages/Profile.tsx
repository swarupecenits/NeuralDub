import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Bell, LogOut, Camera, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user, profile, updateProfile, logout, uploadAvatar, deleteAvatar } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    country: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(userData);
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile');
      setMessageType('error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size should be less than 5MB');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploadingImage(true);
    setMessage('');

    try {
      await uploadAvatar(file);
      setMessage('Profile image updated successfully!');
      setMessageType('success');
    } catch (error: any) {
      setMessage(error.message || 'Failed to upload image');
      setMessageType('error');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setMessage(''), 3000);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile image?')) return;

    setUploadingImage(true);
    setMessage('');

    try {
      await deleteAvatar();
      setMessage('Profile image removed successfully!');
      setMessageType('success');
    } catch (error: any) {
      setMessage(error.message || 'Failed to remove image');
      setMessageType('error');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const tabs = ['Profile', 'Settings', 'Security'];

  return (
    <main className="min-h-screen bg-[#0A1628] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Avatar and Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500/30"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              
              {/* Upload/Delete buttons overlay */}
              <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="p-2 bg-cyan-500 rounded-full hover:bg-cyan-600 transition disabled:opacity-50"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                {profile?.avatarUrl && (
                  <button
                    onClick={handleDeleteAvatar}
                    disabled={uploadingImage}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition disabled:opacity-50"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              
              {uploadingImage && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div>
              <h2 className="text-2xl font-bold text-white">{userData.name || user?.name || 'User'}</h2>
              <p className="text-gray-400">{user?.email || ''}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition disabled:opacity-50"
              >
                {profile?.avatarUrl ? 'Change photo' : 'Upload photo'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 px-1 font-medium transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Profile Information
              </h2>

              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  messageType === 'success' 
                    ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/50 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Country</label>
                  <input
                    type="text"
                    value={userData.country}
                    onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
                    placeholder="India"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Bio</label>
                  <textarea
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20" defaultChecked />
                <span className="text-white">Email notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20" defaultChecked />
                <span className="text-white">Project updates</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20" />
                <span className="text-white">Marketing emails</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0D1F36] border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Security Settings
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full bg-[#0A1628] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                  <Button>Update Password</Button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-semibold mb-4">Sign Out</h3>
                <Button variant="secondary" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out From All Devices
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default Profile;
