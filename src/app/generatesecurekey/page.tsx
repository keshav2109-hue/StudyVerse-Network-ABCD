
'use client';

import { KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from 'next/navigation';

// You can easily change the external link by modifying this constant.
const EXTERNAL_LINK = "https://linkcents.com/";

export default function GenerateSecureKeyPage() {
  const router = useRouter();

  const handleGenerateClick = () => {
    // Set a flag in localStorage to indicate the user has started the process correctly.
    localStorage.setItem('generateKeyClicked', 'true');
    // When the user is sent to the external site, we assume the external
    // site will eventually redirect them back to /mainedu with a query param.
    window.location.href = EXTERNAL_LINK;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 font-sans">
      <div className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur bg-white/60 border border-white/30 text-center animate-fadeIn">
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
      </div>
    </div>
  );
}
