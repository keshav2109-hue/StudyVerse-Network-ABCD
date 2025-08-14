
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, Users, Youtube, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

const features = [
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: 'Expert-Led Classes',
    description: 'Learn from the best educators with years of experience in their fields.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: 'Comprehensive Material',
    description: 'Access detailed notes, DPPs, and video lectures for every topic.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Community Support',
    description: 'Join a thriving community of learners to solve doubts and stay motivated.',
  },
];

export default function HomePage() {
  const router = useRouter();

  const handleExploreCourses = () => {
    router.push('/generatesecurekey');
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Image
            src="https://i.postimg.cc/rsKZhQbz/image.png"
            alt="EduVerse 2.O Logo"
            width={120}
            height={120}
            className="mx-auto mb-6 rounded-2xl shadow-lg"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EduVerse 2.O</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Your Gateway to Unlocking Academic Excellence.
          </p>
          <Button
            onClick={handleExploreCourses}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full transition-transform hover:scale-105"
          >
            Explore Courses
          </Button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow rounded-xl">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            EduVerse 2.O is dedicated to providing high-quality, accessible education for all. We believe in empowering students with the knowledge and skills they need to succeed in their academic journey and beyond. Our platform is built on the principle of making learning an engaging and effective experience.
          </p>
        </div>
      </section>

      {/* Join Community Section */}
      <section id="community" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-8">
            Connect with fellow students and our educators. Get your doubts cleared, share resources, and be a part of our growing family!
          </p>
          <div className="flex justify-center gap-6">
            <a href="https://www.youtube.com/@EduVerse_Network" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                <Youtube className="w-6 h-6 mr-2" />
                YouTube
              </Button>
            </a>
            <a href="https://t.me/EduVerse_Network" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">
                <Send className="w-6 h-6 mr-2" />
                Telegram
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
