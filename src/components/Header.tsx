
import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-brand-500" />
          <h1 className="text-xl font-semibold text-brand-600">Meeting Time Savior</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">How It Works</Button>
          <Button>Analyze Meetings</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
