import React, { useState, useEffect } from 'react';
import { ViewState, ReportData, UserProfile } from './types';
import { ReportForm } from './components/ReportForm';
import { RegistrationForm } from './components/RegistrationForm';
import { Button } from './components/Button';

// Initial Mock User Data Structure (Name will be overwritten)
const INITIAL_USER_TEMPLATE: UserProfile = {
  name: "", 
  points: 0,
  rank: "Novice Guardian",
  history: []
};

// Mock data for community activity
const RECENT_ACTIVITY = [
  { id: 1, title: "Pottery fragments near stream", time: "25m ago", user: "Bopha" },
  { id: 2, title: "Looting pit spotted at midnight", time: "3h ago", user: "Sambath" },
  { id: 3, title: "Overgrown temple entrance found", time: "1d ago", user: "Visoth" }
];

// Rank Definition Logic
const getRank = (points: number): string => {
  if (points >= 1000) return "Heritage Guardian";
  return "Novice Guardian";
};

const App: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_TEMPLATE);
  const [lastReport, setLastReport] = useState<ReportData | null>(null);

  // Check for existing user on load
  useEffect(() => {
    const savedName = localStorage.getItem('s-robot-user-name');
    if (savedName) {
      const savedPoints = 1250; // Restore mock points for demo
      setUser({
        ...INITIAL_USER_TEMPLATE,
        name: savedName,
        points: savedPoints, 
        rank: getRank(savedPoints)
      });
      setIsRegistered(true);
    }
  }, []);

  const handleRegistration = (name: string) => {
    localStorage.setItem('s-robot-user-name', name);
    const initialPoints = 50; // Start with some welcome points
    setUser({
      ...INITIAL_USER_TEMPLATE,
      name: name,
      points: initialPoints, 
      rank: getRank(initialPoints)
    });
    setIsRegistered(true);
  };

  const handleReportSubmit = (data: ReportData) => {
    // Award points based on report type
    const pointsAwarded = data.type === 'finding' ? 500 : 1000; // More points for looting reports as they are urgent
    
    setLastReport(data);
    setUser(prev => {
      const newPoints = prev.points + pointsAwarded;
      return {
        ...prev,
        points: newPoints,
        rank: getRank(newPoints),
        history: [data, ...prev.history]
      };
    });
    setView('success');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Heritage Guard designed by S-Robot',
          text: 'Check out our FLL project for protecting heritage! Help us report findings and looting.',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard! Send this to your teammates.');
    }
  };

  const renderHome = () => (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-heritage-600 to-heritage-400 rounded-b-[3rem] z-0" />
      
      <div className="relative z-10 px-6 pt-12 pb-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Heritage Guard</h1>
            <p className="text-heritage-100">Welcome, {user.name}</p>
          </div>
          <div 
            onClick={() => setView('profile')}
            className="bg-white/20 backdrop-blur-md p-2 rounded-2xl flex items-center gap-2 cursor-pointer border border-white/30 hover:bg-white/30 transition-colors"
          >
             <div className="bg-yellow-400 p-1.5 rounded-full">
               <svg className="w-4 h-4 text-yellow-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
             </div>
             <span className="font-bold text-white pr-2">{user.points}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Make a Report</h2>
          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={() => setView('report-finding')}
                className="flex flex-col items-center justify-center p-6 bg-heritage-50 rounded-2xl border-2 border-heritage-100 hover:border-heritage-500 hover:bg-heritage-100 transition-all group"
             >
                <div className="w-16 h-16 bg-heritage-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-heritage-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <span className="font-bold text-heritage-900">Finding</span>
                <span className="text-xs text-heritage-600 mt-1">Artifacts</span>
             </button>

             <button 
                onClick={() => setView('report-looting')}
                className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border-2 border-red-100 hover:border-red-500 hover:bg-red-100 transition-all group"
             >
                <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <span className="font-bold text-red-900">Looting</span>
                <span className="text-xs text-red-600 mt-1">Emergency</span>
             </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 px-2">Recent Community Activity</h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-heritage-100 flex-shrink-0 flex items-center justify-center font-bold text-heritage-700">
                    {activity.user[0]}
                 </div>
                 <div>
                   <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                   <p className="text-xs text-gray-500">{activity.time} • By {activity.user}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
      <p className="text-gray-600 mb-8">
        Your report helps us preserve Cambodia's history. The authorities have been notified.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl w-full mb-8">
         <p className="text-sm text-yellow-800 font-medium mb-1">Points Earned</p>
         <p className="text-4xl font-bold text-yellow-600">+{lastReport?.type === 'finding' ? 500 : 1000}</p>
      </div>

      <Button fullWidth onClick={() => setView('home')}>Return Home</Button>
    </div>
  );

  const renderProfile = () => (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
       <div className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('home')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-heritage-200 rounded-full flex items-center justify-center text-3xl font-bold text-heritage-700 border-4 border-white shadow-lg uppercase">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-heritage-600 font-medium">{user.rank}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-heritage-50 p-4 rounded-xl border border-heritage-100">
               <p className="text-sm text-heritage-600 mb-1">Total Points</p>
               <p className="text-2xl font-bold text-heritage-800">{user.points}</p>
             </div>
             <div className="bg-green-50 p-4 rounded-xl border border-green-100">
               <p className="text-sm text-green-600 mb-1">Reports</p>
               <p className="text-2xl font-bold text-green-800">{user.history.length}</p>
             </div>
          </div>
       </div>

       <div className="p-6 space-y-6">
         <div>
            <h3 className="font-bold text-gray-900 mb-4">Rewards</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">🍚</div>
                    <div>
                      <p className="font-bold text-gray-900">Rice Sack (10kg)</p>
                      <p className="text-xs text-gray-500">2000 points</p>
                    </div>
                  </div>
                  <Button variant="outline" className="px-3 py-1.5 text-sm" disabled={user.points < 2000}>Redeem</Button>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">👕</div>
                    <div>
                      <p className="font-bold text-gray-900">Team T-Shirt</p>
                      <p className="text-xs text-gray-500">1000 points</p>
                    </div>
                  </div>
                  <Button variant="outline" className="px-3 py-1.5 text-sm" disabled={user.points < 1000}>Redeem</Button>
              </div>
            </div>
         </div>

         <div>
            <h3 className="font-bold text-gray-900 mb-4">Team Feedback</h3>
            <div className="bg-heritage-50 p-4 rounded-xl border border-heritage-100">
               <p className="text-sm text-heritage-800 mb-3">
                 Share this app with your S-Robot teammates to test features and gather feedback for the competition.
               </p>
               <div className="flex flex-col gap-3">
                 <Button variant="secondary" fullWidth onClick={handleShare}>
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                   Share App Link
                 </Button>
                 <a 
                   href="mailto:feedback@s-robot-fll.org?subject=App Feedback"
                   className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 border-2 border-heritage-500 text-heritage-600 hover:bg-heritage-100"
                 >
                   Send Feedback Email
                 </a>
               </div>
            </div>
         </div>
       </div>
    </div>
  );

  // Main Render Logic
  if (!isRegistered) {
    return <RegistrationForm onRegister={handleRegistration} />;
  }

  return (
    <div className="h-screen w-full bg-heritage-50 overflow-hidden font-sans">
      {view === 'home' && renderHome()}
      {view === 'success' && renderSuccess()}
      {view === 'profile' && renderProfile()}
      {(view === 'report-finding' || view === 'report-looting') && (
        <div className="fixed inset-0 z-50 bg-heritage-50">
          <ReportForm 
            type={view === 'report-finding' ? 'finding' : 'looting'} 
            onBack={() => setView('home')}
            onSubmit={handleReportSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default App;