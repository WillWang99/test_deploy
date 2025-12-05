import React, { useState, useEffect } from 'react';
import { Organization, ReportData } from '../types';
import { Button } from './Button';
import { analyzeImageForReport } from '../services/geminiService';

interface ReportFormProps {
  type: 'finding' | 'looting';
  onBack: () => void;
  onSubmit: (data: ReportData) => void;
}

const ORG_LIST: Organization[] = [
  { id: '1', name: 'Apsara National Authority', selected: true },
  { id: '2', name: 'Ministry of Culture & Fine Arts', selected: true },
  { id: '3', name: 'Heritage Police', selected: false },
  { id: '4', name: 'S-Robot Team', selected: true },
];

export const ReportForm: React.FC<ReportFormProps> = ({ type, onBack, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>(ORG_LIST);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError(null);
      },
      (err) => {
        console.error("Error getting location", err);
        if (err.code === 1) {
          setLocationError("Location permission denied.");
        } else if (window.isSecureContext === false) {
           setLocationError("GPS requires HTTPS or localhost.");
        } else {
          setLocationError("Unable to retrieve location.");
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      // Auto-analyze removed in favor of manual button
    }
  };

  const handleAnalyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeImageForReport(image, type);
      setDescription(prev => {
        const separator = prev ? '\n\n' : '';
        return `${prev}${separator}AI Analysis: ${analysis}`;
      });
    } catch (err) {
      console.error(err);
      alert("Could not analyze image. Please ensure you are online.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleOrg = (id: string) => {
    setOrganizations(orgs => 
      orgs.map(org => org.id === id ? { ...org, selected: !org.selected } : org)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload a photo of the site.");
      return;
    }
    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onSubmit({
        image,
        imagePreview,
        description,
        location,
        organizations: organizations.filter(o => o.selected),
        timestamp: Date.now(),
        type
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-t-3xl shadow-2xl overflow-hidden mt-4">
      <div className={`p-4 ${type === 'finding' ? 'bg-heritage-500' : 'bg-red-800'} text-white flex items-center gap-4`}>
        <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold">Report {type === 'finding' ? 'New Finding' : 'Looting Activity'}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">1. Evidence Photo</label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <input 
              type="file" 
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {imagePreview ? (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium z-20 pointer-events-none">
                  Tap to change
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Tap to take photo</span>
              </div>
            )}
          </div>
          
          {/* AI Analyze Button */}
          {imagePreview && (
            <div className="flex justify-end mt-2">
              <button 
                type="button"
                onClick={handleAnalyzeImage}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-heritage-100 to-heritage-200 text-heritage-800 rounded-lg text-sm font-semibold shadow-sm hover:from-heritage-200 hover:to-heritage-300 transition-all disabled:opacity-50 border border-heritage-300"
              >
                 {isAnalyzing ? (
                   <>
                    <svg className="animate-spin -ml-1 h-4 w-4 text-heritage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                   </>
                 ) : (
                   <>
                    <svg className="w-4 h-4 text-heritage-700" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                    Auto-Describe with AI
                   </>
                 )}
              </button>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div className="space-y-2">
           <label className="block text-sm font-medium text-gray-700">2. Location</label>
           <div className={`flex items-center gap-3 p-3 rounded-lg border ${locationError ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
             <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
             {location ? (
               <span className="text-sm">GPS Attached: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
             ) : (
               <span className="text-sm">{locationError || "Acquiring GPS..."}</span>
             )}
           </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">3. Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you found or tap 'Auto-Describe' above..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heritage-500 focus:border-transparent outline-none h-32 resize-none"
          />
        </div>

        {/* Organization Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">4. Notify Organizations</label>
          <div className="grid grid-cols-1 gap-2">
            {organizations.map(org => (
              <label key={org.id} className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${org.selected ? 'bg-heritage-50 border-heritage-500 ring-1 ring-heritage-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="checkbox" 
                  checked={org.selected}
                  onChange={() => toggleOrg(org.id)}
                  className="w-5 h-5 text-heritage-600 rounded focus:ring-heritage-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">{org.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <Button 
          variant={type === 'finding' ? 'primary' : 'danger'} 
          fullWidth 
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          Submit Report
        </Button>
      </div>
    </div>
  );
};