import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FAEDCD] flex items-center justify-center text-[#D4A373] mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mb-2">
        Page Not Found • 404
      </h1>
      <p className="text-xs md:text-sm text-[#686558] max-w-md mb-6 leading-relaxed">
        The winter garment or atelier room you are searching for does not seem to exist.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Storefront</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
