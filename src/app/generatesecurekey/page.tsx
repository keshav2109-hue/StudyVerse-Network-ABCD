
'use client';

import { KeyRound, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const EXTERNAL_LINK = "https://linkcents.com/";

export default function GenerateSecureKeyPage() {
  const router = useRouter();
  const [hasValidKey, setHasValidKey] = useState(false);

  useEffect(() => {
    // Check if the auth cookie exists
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('eduverse_auth='));
    const verifiedTokenItem = localStorage.getItem('verifiedEduverseToken');

    if (authCookie && verifiedTokenItem) {
        try {
            const tokenData = JSON.parse(verifiedTokenItem);
            if (tokenData.expiresAt && tokenData.expiresAt > Date.now()) {
                setHasValidKey(true);
            } else {
                // Clean up expired token
                localStorage.removeItem('verifiedEduverseToken');
            }
        } catch (e) {
            // Clean up malformed token
            localStorage.removeItem('verifiedEduverseToken');
        }
    }
  }, []);

  const handleGenerateClick = () => {
    localStorage.setItem('generateKeyClicked', 'true');
    localStorage.setItem('generateKeyStartTime', Date.now().toString());
    window.location.href = EXTERNAL_LINK;
  };
  
  const handleGoToCourses = () => {
    router.push('/verifieduser');
  };

  const videoId = "AuEmR1DXyqU";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 font-sans p-4">

      {!hasValidKey && (
        <div className="w-[90%] max-w-md mb-6 p-4 rounded-2xl shadow-xl backdrop-blur bg-white/50 border border-white/30 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                <HelpCircle className="w-6 h-6 text-blue-500" />
                Need Help?
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              If you have any trouble generating a key, you can watch this video for help.
            </p>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
      )}

      <div className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur bg-white/60 border border-white/30 text-center animate-fadeIn">
        {hasValidKey ? (
          <>
            <div className="flex justify-center items-center gap-2 mb-4">
                <ShieldCheck className="w-8 h-8 text-green-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                You Already Have Access
                </h1>
            </div>
            <p className="text-gray-600 mb-6">
              Your secure key is currently active. You can proceed directly to your courses.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6 text-center shadow-inner">
              <p className="font-semibold text-green-700 text-lg">
                Your access is valid for 24 hours.
              </p>
              <p className="text-green-600 text-sm mt-1">
                After it expires, you will need to generate a new key.
              </p>
            </div>
            <button
              onClick={handleGoToCourses}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Go to Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center gap-2 mb-4">
                <KeyRound className="w-8 h-8 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                Generate Your Secure Key
                </h1>
            </div>
            <p className="text-gray-600 mb-6">
              You need to generate a secure key to access the course batches. This is a required step for verification.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center shadow-inner">
              <p className="font-semibold text-blue-700 text-lg">
                Your secure key will be valid for 24 hours.
              </p>
              <p className="text-blue-600 text-sm mt-1">
                After it expires, you will need to generate a new one.
              </p>
            </div>
            <button
              onClick={handleGenerateClick}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Generate Key
            </button>
          </>
        )}
      </div>
    </div>
  );
}
