import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Database } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingSections = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage your notification preferences',
      color: 'from-[#4988C4] to-[#4988C4]',
      settings: [
        { 
          label: 'Enable Notifications', 
          value: notifications, 
          onChange: setNotifications,
          description: 'Receive alerts for new disease outbreaks'
        },
        { 
          label: 'Critical Alerts Only', 
          value: criticalAlerts, 
          onChange: setCriticalAlerts,
          description: 'Only notify for emergency severity cases'
        },
      ],
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize the look and feel',
      color: 'from-[#4988C4] to-[#0F2854]',
      settings: [
        { 
          label: 'Dark Mode', 
          value: darkMode, 
          onChange: setDarkMode,
          description: 'Switch between light and dark themes'
        },
      ],
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Control your data and privacy',
      color: 'from-[#E3FDFD] to-[#4988C4]',
      info: 'Your data is encrypted and stored securely. We never share your information with third parties.',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Control how your data is stored',
      color: 'from-[#4988C4] via-[#4988C4] to-[#0F2854]',
      info: 'Data is synchronized in real-time with our secure servers.',
    },
    {
      icon: Globe,
      title: 'Language & Region',
      description: 'Set your preferences',
      color: 'from-[#4988C4] to-[#4988C4]',
      info: 'Currently set to: English (India)',
    },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your preferences and account</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-foreground mb-1">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>

                {section.settings ? (
                  <div className="space-y-4 ml-16">
                    {section.settings.map((setting, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{setting.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setting.onChange(!setting.value)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            setting.value ? 'bg-primary' : 'bg-secondary'
                          }`}
                        >
                          <motion.div
                            animate={{ x: setting.value ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : section.info ? (
                  <div className="ml-16">
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-sm text-muted-foreground">{section.info}</p>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">CURA v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">© 2026 CURA. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
