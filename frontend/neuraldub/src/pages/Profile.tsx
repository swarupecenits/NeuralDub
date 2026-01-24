import type React from 'react'
import { useState } from 'react'
import { User, Mail, Lock, Bell, Globe, Trash2, Download } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Alert from '../components/Alert'
import Tabs from '../components/Tabs'

export default function Profile() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    bio: 'Content creator and translator',
  })

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <div className="space-y-6">
          <Card title="Profile Information" icon={User}>
            <div className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <Button variant="secondary">Change Avatar</Button>
              </div>

              <Input
                label="Full Name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />

              <Input
                label="Email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />

              <Input
                label="Phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />

              <Select
                label="Country"
                options={[
                  { value: 'us', label: 'United States' },
                  { value: 'uk', label: 'United Kingdom' },
                  { value: 'ca', label: 'Canada' },
                  { value: 'in', label: 'India' },
                ]}
                value="us"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
                  rows={4}
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                />
              </div>

              <Button className="w-full">Save Changes</Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      content: (
        <div className="space-y-6">
          <Card title="Change Password" icon={Lock}>
            <div className="space-y-4">
              <Alert type="info" message="Update your password to keep your account secure" />

              <Input
                label="Current Password"
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Enter current password"
              />

              <Input
                label="New Password"
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                placeholder="Enter new password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Confirm new password"
              />

              <Button className="w-full">Update Password</Button>
            </div>
          </Card>

          <Card title="Two-Factor Authentication" icon={Lock}>
            <div className="space-y-4">
              <Alert
                type="warning"
                message="Two-factor authentication is not enabled. Enable it for enhanced security."
              />
              <Button variant="outline" className="w-full">
                Enable 2FA
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <Card title="Notification Preferences" icon={Bell}>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-1">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-300">Email notifications for job completion</span>
              </label>
              <p className="text-xs text-slate-400 ml-7">
                Receive updates when your translations are complete
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-1">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-slate-300">Weekly usage summary</span>
              </label>
              <p className="text-xs text-slate-400 ml-7">
                Get a summary of your weekly usage and statistics
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-1">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-slate-300">Product updates and news</span>
              </label>
              <p className="text-xs text-slate-400 ml-7">
                Stay informed about new features and improvements
              </p>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mb-1">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-slate-300">Marketing emails</span>
              </label>
              <p className="text-xs text-slate-400 ml-7">
                Receive special offers and promotional content
              </p>
            </div>

            <Button className="w-full mt-4">Save Preferences</Button>
          </div>
        </Card>
      ),
    },
  ]

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your profile and preferences</p>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Danger Zone</h2>
          <Card className="border-red-500/30 bg-red-500/5">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-300 mb-2">Download Your Data</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Download a copy of all your personal data
                </p>
                <Button variant="secondary" size="sm">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>

              <div className="border-t border-red-500/20 pt-4">
                <h3 className="font-semibold text-red-300 mb-2">Delete Account</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="danger" size="sm">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
