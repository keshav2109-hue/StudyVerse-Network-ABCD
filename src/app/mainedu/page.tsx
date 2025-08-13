
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Copy, KeyRound, ShieldCheck, AlertTriangle, Loader, RotateCw } from 'lucide-react';

const TOKEN_STORAGE_KEY = 'eduverse-secure-token';

function MainEduPageContent() {
  const [token, setToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the user came from the intended page AND clicked the button
    const fromGenerateKey = searchParams.get('from') === '/generatesecurekey';
    const hasClickedGenerate = localStorage.getItem('generateKeyClicked') === 'true';

    if (fromGenerateKey && hasClickedGenerate) {
      setIsVerified(true);
      
      // Clear the flag so it cannot be reused
      localStorage.removeItem('generateKeyClicked');

      // Generate a random token
      const generatedToken = Math.random().toString(36).substring(2, 11).toUpperCase();
      setToken(generatedToken);
      
      // Store the token in localStorage to be verified on the next page
      localStorage.setItem(TOKEN_STORAGE_KEY, generatedToken);

    } else if (fromGenerateKey && !hasClickedGenerate) {
      // User has bypassed the button click, show warning and redirect
      setIsBypassed(true);
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        router.push('/generatesecurekey');
      }, 5000);

      // Cleanup timeouts and intervals on component unmount
      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    } else {
        // User accessed the page directly, show a different error message
       setIsBypassed(true);
    }
  }, [searchParams, router]);

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

  if (isBypassed) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-white to-orange-100 font-sans">
        <div className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur bg-white/60 border border-white/30 text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Process Bypassed
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            You must start the process correctly. Redirecting you in {countdown} seconds...
          </p>
          <div className="flex items-center justify-center text-red-500 mb-6">
            <RotateCw className="w-6 h-6 animate-spin" />
          </div>
          <button
            onClick={() => router.push('/generatesecurekey')}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5" />
            Generate Key Now
          </button>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
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

export default function MainEduPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <MainEduPageContent />
        </Suspense>
    )
}
