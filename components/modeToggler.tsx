'use client';

import * as React from 'react';
import { Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@headlessui/react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [enabled, setEnabled] = React.useState(theme === 'dark');

  React.useEffect(() => {
    setEnabled(theme === 'dark');
  }, [theme]);

  const handleChange = (checked: any) => {
    setTheme(checked ? 'dark' : 'light');
    setEnabled(checked);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* <Sun className={`h-6 w-6 hidden md:block ${!enabled ? 'text-yellow-500 ' : 'text-gray-500'}`} /> */}
      <Switch
        checked={enabled}
        onChange={handleChange}
        className={`${enabled ? 'bg-gray-700' : 'bg-primary'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
      >
        <span className="sr-only">Enable dark mode</span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
      </Switch>
      <Moon className={`h-6 w-6 hidden md:block ${enabled ? 'text-yellow-500' : 'text-gray-500'}`} />
    </div>
  );
}
