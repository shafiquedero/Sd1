
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PromptLibrary } from './components/PromptLibrary';
import { PhotoStudio } from './components/PhotoStudio';
import { VideoStudio } from './components/VideoStudio';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { AuthModal } from './components/AuthModal';
import { AILab } from './components/AILab';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { ViewState, User, UserRole, PaymentSettings } from './types';
import { Play, Sparkles, Camera, Film, Shield, Settings, X, Smartphone, Download } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [showDownloadPopup, setShowDownloadPopup] = useState(true);

  // Global Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    crypto: {
        enabled: true,
        usdtAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8bN89lcG5d',
        btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    local: {
        enabled: true,
        jazzcash: { number: '03001234567', title: 'Admin Jazz' },
        easypaisa: { number: '03451234567', title: 'Admin Easy' }
    }
  });

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    
    // Always redirect Admin to Admin Dashboard
    if (loggedInUser.role === UserRole.ADMIN) {
        setView(ViewState.ADMIN);
        return;
    }

    // If we are on a specific login page, redirect to Landing
    // If we are intercepting a protected route (like PhotoStudio), stay on that view
    if (currentView === ViewState.LOGIN || currentView === ViewState.ADMIN_LOGIN) {
        setView(ViewState.LANDING);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.LANDING);
  };

  const handleUsePrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setView(ViewState.PHOTO_STUDIO); 
  };

  const handleAddCredits = (amount: number) => {
    if (user) {
        // In a real app, this would hit an API endpoint
        setUser({
            ...user,
            credits: user.credits + amount
        });
        setView(ViewState.LANDING);
    }
  };

  const handleDeductCredits = (amount: number) => {
    if (user) {
        setUser({
            ...user,
            credits: Math.max(0, user.credits - amount)
        });
    }
  };
  
  const handleUpdateUser = (updatedUser: User) => {
      setUser(updatedUser);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.LOGIN:
        return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} />;
      
      case ViewState.ADMIN_LOGIN:
        return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} disableSignup={true} />;
      
      case ViewState.ADMIN:
        if (!user || user.role !== UserRole.ADMIN) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md w-full">
                <Shield size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
                <p className="text-slate-400 mb-6">This area is reserved for administrators only. Please sign in with an admin account.</p>
                <div className="space-y-3">
                    <button 
                        onClick={() => setView(ViewState.ADMIN_LOGIN)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                        Sign In as Admin
                    </button>
                    <button 
                        onClick={() => setView(ViewState.LANDING)}
                        className="w-full text-slate-400 hover:text-white py-2 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
              </div>
            </div>
          );
        }
        return <AdminDashboard onBack={() => setView(ViewState.LANDING)} paymentSettings={paymentSettings} onUpdatePaymentSettings={setPaymentSettings} />;
      
      case ViewState.DASHBOARD:
        if (!user) return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} />;
        return <UserDashboard user={user} setView={setView} onUpdateUser={handleUpdateUser} />;

      case ViewState.PRICING:
        // Pricing is visible, but actions inside might need auth (handled by handleAddCredits check or logic inside)
        return <Pricing onAddCredits={handleAddCredits} onBack={() => setView(ViewState.LANDING)} paymentSettings={paymentSettings} />;

      case ViewState.LIBRARY:
        if (!user) return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} />;
        return <PromptLibrary onUsePrompt={handleUsePrompt} setView={setView} />;

      case ViewState.PHOTO_STUDIO:
        if (!user) return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} />;
        return <PhotoStudio 
            initialPrompt={selectedPrompt} 
            onBack={() => setView(ViewState.LANDING)} 
            user={user}
            onDeductCredits={handleDeductCredits}
        />;
      
      case ViewState.VIDEO_STUDIO:
        if (!user) return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} />;
        return <VideoStudio 
            initialPrompt={selectedPrompt} 
            onBack={() => setView(ViewState.LANDING)} 
            user={user}
            onDeductCredits={handleDeductCredits}
        />;

      case ViewState.AI_LAB:
        if (!user) return <AuthModal onLogin={handleLogin} onCancel={() => setView(ViewState.LANDING)} />;
        return <AILab onBack={() => setView(ViewState.LANDING)} />;

      case ViewState.ABOUT:
        return <About onBack={() => setView(ViewState.LANDING)} />;

      case ViewState.LANDING:
      default:
        return (
          <div className="max-w-6xl mx-auto relative pb-10">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 py-10 md:py-24">
              <div className="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700 text-yellow-400 text-xs md:text-sm font-medium">
                  <Sparkles size={14} />
                  <span>Powered by Gemini 3.0 & Veo</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 leading-tight">
                  Turn words into <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">Video Reality</span>
                </h1>
                <p className="text-base md:text-lg text-slate-400 max-w-lg leading-relaxed mx-auto md:mx-0">
                  The ultimate creative suite. Generate breathtaking images with Gemini 3 Pro and cinematic videos with Veo 3.1.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => setView(ViewState.PHOTO_STUDIO)}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Camera size={20} /> Create Photos
                  </button>
                  <button 
                    onClick={() => setView(ViewState.VIDEO_STUDIO)}
                    className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-yellow-900/30 transition-all hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Film size={20} /> Create Videos
                  </button>
                </div>
              </div>
              <div className="flex-1 relative w-full mt-8 md:mt-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-yellow-600 rounded-2xl opacity-30 blur-2xl"></div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                   <img 
                     src="https://picsum.photos/800/600?random=10" 
                     alt="AI Art" 
                     className="w-full h-auto object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                   <div className="absolute bottom-6 left-6">
                      <p className="text-white font-bold text-lg">Cyberpunk City 2077</p>
                      <p className="text-slate-300 text-sm">Generated by Alice S.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 md:py-16 border-t border-slate-800">
              <div className="p-6 bg-emerald-900/10 rounded-2xl border border-slate-800 hover:bg-emerald-900/20 transition-colors cursor-pointer" onClick={() => setView(ViewState.PHOTO_STUDIO)}>
                 <div className="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                    <Camera size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">AI Photos</h3>
                 <p className="text-slate-400">Generate stunning visuals with customizable aspect ratios and resolution using Gemini 3 Pro.</p>
              </div>
              <div className="p-6 bg-yellow-900/10 rounded-2xl border border-slate-800 hover:bg-yellow-900/20 transition-colors cursor-pointer" onClick={() => setView(ViewState.VIDEO_STUDIO)}>
                 <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center text-yellow-400 mb-4">
                    <Film size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">AI Videos</h3>
                 <p className="text-slate-400">Create videos from text or animate existing images using Veo's cutting-edge model.</p>
              </div>
              <div className="p-6 bg-teal-900/10 rounded-2xl border border-slate-800 hover:bg-teal-900/20 transition-colors cursor-pointer" onClick={() => setView(ViewState.AI_LAB)}>
                 <div className="w-12 h-12 bg-teal-900/50 rounded-lg flex items-center justify-center text-teal-400 mb-4">
                    <Sparkles size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">AI Lab</h3>
                 <p className="text-slate-400">Explore real-time voice conversations, thinking models, and visual analysis.</p>
              </div>
            </div>

             {/* Admin Control Panel Button - Fixed Bottom Left - Hidden on Mobile to avoid clutter */}
            <div className="hidden md:block fixed bottom-6 left-6 md:left-[17.5rem] z-50">
               <button 
                  onClick={() => {
                      if (user?.role === UserRole.ADMIN) {
                          setView(ViewState.ADMIN);
                      } else {
                          setView(ViewState.ADMIN_LOGIN);
                      }
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 hover:border-yellow-500 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300"
               >
                  <Settings size={16} />
                  <span>Admin Control Panel</span>
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout currentView={currentView} setView={setView} user={user} onLogout={handleLogout}>
      {renderContent()}

      {/* Download App Popup */}
      {showDownloadPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowDownloadPopup(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-center pt-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-emerald-900/50">
                <Smartphone size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Get the App</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Experience smoother performance, offline mode, and exclusive AI features on our mobile app.
              </p>
              <div className="space-y-3">
                 <button className="w-full py-3 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Play size={18} className="fill-current" /> Google Play
                 </button>
                  <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <Smartphone size={18} /> App Store
                 </button>
              </div>
              <button 
                onClick={() => setShowDownloadPopup(false)} 
                className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Continue using website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Download Button (Center Bottom) */}
      {!showDownloadPopup && (
         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-bounce-subtle">
            <button 
              onClick={() => setShowDownloadPopup(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-yellow-500 rounded-full text-white font-bold shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 hover:scale-105 transition-all border border-emerald-500/50 backdrop-blur-md whitespace-nowrap"
            >
               <Download size={18} />
               <span>Download App</span>
            </button>
         </div>
      )}
    </Layout>
  );
};

export default App;
