
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Copy, KeyRound, ShieldCheck, AlertTriangle } from 'lucide-react';

const TOKEN_STORAGE_KEY = 'eduverse-secure-token';

export default function MainEduPage() {
  const [token, setToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Security check: Ensure the user came from the intended page
    if (searchParams.get('from') === '/generatesecurekey') {
      setIsVerified(true);
      // Generate a random token
      const generatedToken = Math.random().toString(36).substring(2, 11).toUpperCase();
      setToken(generatedToken);
      
      // Store the token in localStorage to be verified on the next page
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, generatedToken);
      }
    } else {
      setIsVerified(false);
    }
  }, [searchParams]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token).then(() => {
      alert('Token copied to clipboard!');
    }, () => {
      alert('Failed to copy token.');
    });
  };

  const handleGetAccess = () => {
    router.push('/eduauth');
  };

  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-orange-100 font-sans">
        <div className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur bg-white/60 border border-white/30 text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Verification Required
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            You cannot access this page directly. Please start the verification process to get a token.
          </p>
          <button
            onClick={() => router.push('/generatesecurekey')}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Start Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 font-sans">
      <div className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur bg-white/60 border border-white/30 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
            <KeyRound className="w-8 h-8 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Your Secure Token is Ready
            </h1>
        </div>
        <p className="text-gray-600 mb-6">
          Copy the token below and proceed to the final step to unlock access.
        </p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center justify-between shadow-inner">
          <span className="font-mono text-xl tracking-widest text-gray-700">{token}</span>
          <button onClick={handleCopy} title="Copy Token" className="text-gray-500 hover:text-green-500">
            <Copy className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={handleGetAccess}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          Get Access by Pasting Token
        </button>
      </div>
    </div>
  );
}
