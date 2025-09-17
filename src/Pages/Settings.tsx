import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Switch, Button, Select, SelectItem } from '@nextui-org/react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: <User className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      settings: [
        {
          label: 'Public Profile',
          description: 'Make your profile visible to other developers',
          type: 'switch',
          value: publicProfile,
          onChange: setPublicProfile,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      settings: [
        {
          label: 'Push Notifications',
          description: 'Receive notifications about messages and updates',
          type: 'switch',
          value: notifications,
          onChange: setNotifications,
        },
      ],
    },
    {
      title: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      settings: [
        {
          label: 'Dark Mode',
          description: 'Use dark theme across the application',
          type: 'switch',
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-red-500 to-orange-500',
      settings: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'button',
          buttonText: 'Enable 2FA',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen ml-16 lg:ml-64 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
            >
              {/* Section Header */}
              <div
                className={`p-6 border-b border-slate-700/50 bg-gradient-to-r ${section.color.replace('500', '500/10')}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center`}
                  >
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
              </div>

              {/* Settings Items */}
              <div className="p-6 space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{setting.label}</h3>
                      <p className="text-slate-400 text-sm">{setting.description}</p>
                    </div>
                    <div className="ml-4">
                      {setting.type === 'switch' && 'value' in setting && (
                        <Switch
                          isSelected={setting.value}
                          onValueChange={setting.onChange}
                          classNames={{
                            wrapper: 'bg-slate-600',
                          }}
                        />
                      )}
                      {setting.type === 'button' && 'buttonText' in setting && (
                        <Button
                          className={`bg-gradient-to-r ${section.color} text-white`}
                          size="sm"
                        >
                          {setting.buttonText}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Account Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              Account Management
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                  <Select
                    defaultSelectedKeys={['en']}
                    className="w-full"
                    classNames={{
                      trigger: 'bg-slate-700/50 border-slate-600 hover:border-slate-500',
                    }}
                  >
                    <SelectItem key="en" value="en">
                      English
                    </SelectItem>
                    <SelectItem key="es" value="es">
                      Spanish
                    </SelectItem>
                    <SelectItem key="fr" value="fr">
                      French
                    </SelectItem>
                    <SelectItem key="de" value="de">
                      German
                    </SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                  <Select
                    defaultSelectedKeys={['utc']}
                    className="w-full"
                    classNames={{
                      trigger: 'bg-slate-700/50 border-slate-600 hover:border-slate-500',
                    }}
                  >
                    <SelectItem key="utc" value="utc">
                      UTC
                    </SelectItem>
                    <SelectItem key="est" value="est">
                      EST
                    </SelectItem>
                    <SelectItem key="pst" value="pst">
                      PST
                    </SelectItem>
                    <SelectItem key="cet" value="cet">
                      CET
                    </SelectItem>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    Save Changes
                  </Button>
                  <Button variant="bordered" className="border-slate-600 text-slate-300">
                    Reset to Default
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Delete Account</h3>
                  <p className="text-slate-400 text-sm">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button color="danger" variant="bordered" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
