
'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { ShieldCheck, RefreshCw, ClipboardPaste, LockKeyhole, Loader } from 'lucide-react';

export default function EduAuthPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = () => {
    setError('');
    const input = document.getElementById('tokenInput') as HTMLInputElement;
    const value = input.value.trim();

    if (!value) {
      setError("Please enter your token!");
      return;
    }

    const storedToken = localStorage.getItem('eduverse-secure-token');

    if (value === storedToken) {
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      document.cookie = `eduverse_auth=true; expires=${new Date(expiryTime).toUTCString()}; path=/`;
      localStorage.setItem("verifiedEduverseToken", JSON.stringify({ expiresAt: expiryTime }));
      
      localStorage.removeItem('eduverse-secure-token');

      setIsVerified(true);
      setTimeout(() => {
        router.push('/verifieduser');
      }, 1500); // Redirect after 1.5 seconds
    } else {
      setError("Invalid or incorrect token. Please try again.");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const input = document.getElementById('tokenInput') as HTMLInputElement;
      if (input) {
        input.value = text;
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('Failed to paste. Please paste manually.');
    }
  };

  return (
    <>
      <Script src="https://unpkg.com/lucide@latest" strategy="afterInteractive" onLoad={() => {
        // @ts-ignore
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
      }} />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 font-sans">
        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out both; }
        `}</style>
        
        <div className="card w-[90%] max-w-md p-6 rounded-2xl shadow-2xl backdrop-blur bg-white/60 border border-white/30 text-center animate-fadeIn">
          {isVerified ? (
            <div className="flex flex-col items-center justify-center gap-4 text-green-600">
              <ShieldCheck className="w-16 h-16" />
              <h2 className="text-xl font-bold text-gray-800">Token Verified!</h2>
              <p className="text-gray-600">You are being redirected to Eduverse...</p>
              <Loader className="w-6 h-6 animate-spin mt-2" />
            </div>
          ) : (
            <>
              <img src="https://theeduverse.xyz/images/Ev.jpg" alt="EduVerse Logo" className="w-16 mx-auto mb-3 rounded-full shadow" />
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
                <LockKeyhole className="w-5 h-5" />
                EduVerse Access
              </h2>
              <p className="text-gray-500 text-sm mb-4">Paste your token to unlock access!</p>

              <div className="relative">
                <input id="tokenInput" type="text" placeholder="🔐 Your Token here" className="w-full px-4 py-3 pr-10 mb-4 rounded-xl bg-slate-100 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition-transform" />
                <button 
                    onClick={handlePaste} 
                    title="Paste Token" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
                >
                  <ClipboardPaste className="w-5 h-5" />
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <button onClick={handleVerify} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl mb-3 font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Verify Token
              </button>

            </>
          )}
        </div>
      </div>
    </>
  );
}
