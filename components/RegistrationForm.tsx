import React, { useState } from 'react';
import { Button } from './Button';

interface RegistrationFormProps {
  onRegister: (name: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRegister(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-heritage-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-heritage-600 to-heritage-500 rounded-b-[4rem] z-0" />
      
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-20 pb-8">
        {/* Header / Branding */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl shadow-heritage-900/20">
            <svg className="w-12 h-12 text-heritage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Heritage Guard</h1>
          <p className="text-heritage-100 text-lg">designed by S-Robot</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl flex-1 flex flex-col justify-center max-h-[400px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome!</h2>
          <p className="text-gray-500 text-center mb-8">Please enter your name to start.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 ml-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Sopheap"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-transparent outline-none text-lg transition-all text-gray-900 placeholder-gray-400"
                autoFocus
              />
            </div>

            <Button 
              type="submit" 
              fullWidth 
              variant="primary" 
              disabled={!name.trim()}
              className="text-lg py-4"
            >
              Register
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
           <p className="text-gray-400 text-sm">Protecting our history, together.</p>
        </div>
      </div>
    </div>
  );
};