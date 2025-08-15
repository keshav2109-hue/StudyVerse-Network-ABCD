
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, Users, Youtube, Send, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CommunityPrompt } from '@/components/eduverse/community-prompt';
import { useToast } from '@/hooks/use-toast';

const features = [
  {
    icon: <Award className="w-8 h-8 text-cyan-400" />,
    title: 'Expert-Led Classes',
    description: 'Learn from the best educators with years of experience in their fields.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
    title: 'Comprehensive Material',
    description: 'Access detailed notes, DPPs, and video lectures for every topic.',
  },
  {
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    title: 'Community Support',
    description: 'Join a thriving community of learners to solve doubts and stay motivated.',
  },
];

const COMMUNITY_PROMPT_STORAGE_KEY = 'communityPromptLastShown';

export default function HomePage() {
  const router = useRouter();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Website Updated",
      description: "This website is now updated.",
    });
    
    const lastShownStr = localStorage.getItem(COMMUNITY_PROMPT_STORAGE_KEY);
    const lastShown = lastShownStr ? parseInt(lastShownStr, 10) : 0;
    const oneDay = 24 * 60 * 60 * 1000;

    if (Date.now() - lastShown > oneDay) {
      setIsPromptOpen(true);
      localStorage.setItem(COMMUNITY_PROMPT_STORAGE_KEY, Date.now().toString());
    }
  }, []);


  const handleExploreCourses = () => {
    router.push('/generatesecurekey');
  };

  return (
    <>
      <CommunityPrompt isOpen={isPromptOpen} onOpenChange={setIsPromptOpen} />
      <div className="bg-slate-900 min-h-screen text-white">
        {/* Hero Section */}
        <section className="text-center py-20 md:py-28 px-4 bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <Image
              src="https://i.postimg.cc/rsKZhQbz/image.png"
              alt="EduVerse 2.O Logo"
              width={120}
              height={120}
              className="mx-auto mb-6 rounded-2xl shadow-lg"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
              EduVerse 2.O
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Your Gateway to Unlocking Academic Excellence. High-quality education, completely free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleExploreCourses}
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-6 text-lg rounded-full transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
              >
                Explore Courses <ArrowRight className="ml-2" />
              </Button>
              <a href="https://t.me/BookVerse_ProBot" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 font-semibold px-8 py-6 text-lg rounded-full transition-transform hover:scale-105 w-full"
                >
                  Explore Books <BookOpen className="ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-choose-us" className="py-16 md:py-20 px-4 bg-slate-950/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-cyan-500/10 transition-shadow rounded-xl bg-slate-800/60 border-slate-700">
                  <CardHeader>
                    <div className="mx-auto bg-slate-700/50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 md:py-20 px-4 bg-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              EduVerse 2.O is dedicated to providing high-quality, accessible education for all. We believe in empowering students with the knowledge and skills they need to succeed in their academic journey and beyond. Our platform is built on the principle of making learning an engaging and effective experience.
            </p>
          </div>
        </section>

        {/* Join Community Section */}
        <section id="community" className="py-16 md:py-20 px-4 bg-slate-950/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-slate-300 mb-8">
              Connect with fellow students and our educators. Get your doubts cleared, share resources, and be a part of our growing family!
            </p>
            <div className="flex justify-center gap-6">
              <a href="https://www.youtube.com/@EduVerse_Network" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors">
                  <Youtube className="w-6 h-6 mr-2" />
                  YouTube
                </Button>
              </a>
              <a href="https://t.me/EduVerse_Network" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-full bg-sky-600 hover:bg-sky-700 text-white transition-colors">
                  <Send className="w-6 h-6 mr-2" />
                  Telegram
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
