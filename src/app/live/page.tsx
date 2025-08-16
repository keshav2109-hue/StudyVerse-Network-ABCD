
'use client';

import { LiveBadge } from "@/components/eduverse/live-badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";

interface LiveClassInfo {
  pageTitle: string;
  class1Subject: string;
  class2Subject: string;
  classTimeLabel: string;
  classTimeLabel2: string;
  class1LiveStreamUrl: string;
  class2LiveStreamUrl: string;
  class1Visible: boolean;
  class2Visible: boolean;
  class1Times: { startTime: string; endTime: string };
  class2Times: { startTime: string; endTime: string };
}

interface LiveData {
  [key: string]: LiveClassInfo;
}

interface CompletedClass {
    id: string;
    title: string;
    file_url: string;
    course_name: string;
    thumbnail_url: string;
}

interface ClassDetails {
  subject: string;
  pageTitle: string;
  liveStreamUrl: string;
  times?: { startTime: string; endTime: string };
  timeLabel?: string;
  status: 'live' | 'upcoming' | 'ended';
  thumbnailUrl?: string;
}

async function getLiveAndUpcomingClasses(): Promise<LiveData> {
  try {
    const res = await fetch("/api/live", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch live classes");
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function getCompletedClasses(): Promise<CompletedClass[]> {
    try {
        const res = await fetch("/api/completed-live", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch completed classes");
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}


function getClassStatus(startTime: string, endTime: string): 'live' | 'upcoming' | 'ended' {
  try {
    const now = new Date();
    const startTimeStr = startTime.substring(11, 19);
    const endTimeStr = endTime.substring(11, 19);

    const [startHours, startMinutes, startSeconds] = startTimeStr.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = endTimeStr.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, startSeconds, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, endSeconds, 0);

    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    if (now >= startDate && now <= endDate) return 'live';
    if (now < startDate) return 'upcoming';
    return 'ended';

  } catch (error) {
    console.error("Error checking time:", error);
    return 'ended';
  }
}

export default function LivePage() {
  const [liveData, setLiveData] = useState<LiveData>({});
  const [completedData, setCompletedData] = useState<CompletedClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setForceRender] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [live, completed] = await Promise.all([
          getLiveAndUpcomingClasses(),
          getCompletedClasses()
      ]);
      setLiveData(live);
      setCompletedData(completed);
      setLoading(false);
    }
    fetchData();
    
    const dataInterval = setInterval(fetchData, 60000); 
    const renderInterval = setInterval(() => setForceRender({}), 1000); 

    return () => {
        clearInterval(dataInterval);
        clearInterval(renderInterval);
    }
  }, []);

  const allClassDetails = useMemo(() => {
    const details: ClassDetails[] = [];
    Object.values(liveData).forEach(liveClass => {
      if (liveClass.class1Visible && liveClass.class1Subject) {
        details.push({
          subject: liveClass.class1Subject,
          pageTitle: liveClass.pageTitle,
          liveStreamUrl: liveClass.class1LiveStreamUrl,
          times: liveClass.class1Times,
          timeLabel: liveClass.classTimeLabel,
          status: getClassStatus(liveClass.class1Times.startTime, liveClass.class1Times.endTime),
        });
      }
      if (liveClass.class2Visible && liveClass.class2Subject) {
        details.push({
          subject: liveClass.class2Subject,
          pageTitle: liveClass.pageTitle,
          liveStreamUrl: liveClass.class2LiveStreamUrl,
          times: liveClass.class2Times,
          timeLabel: liveClass.classTimeLabel2,
          status: getClassStatus(liveClass.class2Times.startTime, liveClass.class2Times.endTime),
        });
      }
    });
    return details;
  }, [liveData]);


  const liveClasses = useMemo(() => allClassDetails.filter(c => c.status === 'live'), [allClassDetails]);
  const upcomingClasses = useMemo(() => allClassDetails.filter(c => c.status === 'upcoming'), [allClassDetails]);
  const endedClasses = useMemo(() => {
      const endedFromLive = allClassDetails.filter(c => c.status === 'ended');
      const fromCompletedApi: ClassDetails[] = completedData.map(c => ({
          subject: c.title,
          pageTitle: c.course_name,
          liveStreamUrl: c.file_url,
          status: 'ended',
          thumbnailUrl: c.thumbnail_url
      }));
      return [...endedFromLive, ...fromCompletedApi];
  }, [allClassDetails, completedData]);


  const renderClass = useCallback((details: ClassDetails, index: number) => {
    const isLive = details.status === 'live';
    const isClickable = details.status !== 'upcoming';
    const imageUrl = details.thumbnailUrl || "https://i.postimg.cc/rsKZhQbz/image.png";

    const cardContent = (
      <Card className={`relative flex items-center p-2.5 rounded-xl shadow-md transition-transform duration-200 ease-in-out ${isClickable ? 'group-hover:scale-[1.02]' : 'opacity-70'} border bg-white`}>
        {isLive && (
          <div className="absolute top-2 left-2 z-10">
            <LiveBadge />
          </div>
        )}
        <Image
          src={imageUrl}
          alt={details.subject}
          width={80}
          height={60}
          className="object-contain rounded-lg mr-4"
          style={{ height: 'auto' }}
          onError={(e) => { e.currentTarget.src = "https://i.postimg.cc/rsKZhQbz/image.png"; }}
        />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-black flex items-center gap-2">
            {details.subject}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{details.pageTitle}</p>
          {details.timeLabel && <p className="text-xs text-gray-500 mt-0.5">{details.timeLabel}</p>}
        </div>
        <div className="bg-gray-100 rounded-full p-2 ml-2">
          {isLive ? <PlayCircle className="h-5 w-5 text-gray-600" /> : details.status === 'upcoming' ? <Clock className="h-5 w-5 text-gray-600" /> : <Video className="h-5 w-5 text-gray-600" />}
        </div>
      </Card>
    );

    if (isClickable) {
      return (
        <Link href={`/eduverseplay?videoUrl=${encodeURIComponent(details.liveStreamUrl)}`} className="group block" key={`${details.subject}-${index}`}>
          {cardContent}
        </Link>
      );
    }
    
    return <div className="group block" key={`${details.subject}-${index}`}>{cardContent}</div>;
  }, []);

  const renderTabContent = (classes: ClassDetails[], type: string) => {
      if (loading) {
          return (
             <div className="text-center text-gray-500 mt-10 p-4 bg-white rounded-xl shadow-md">
                Loading {type} classes...
             </div>
          )
      }
      if (classes.length === 0) {
          return (
             <div className="text-center text-gray-500 mt-10 p-4 bg-white rounded-xl shadow-md">
                No {type} classes are available right now.
             </div>
          )
      }
      return (
          <div className="grid grid-cols-1 gap-4">
              {classes.map(renderClass)}
          </div>
      )
  }

  return (
    <main className="min-h-screen bg-gray-50 text-foreground">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Live Classes
            </h1>
          </div>
        </div>
      </header>
      <div className="max-w-xl mx-auto px-4 py-5">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="mt-4">
            {renderTabContent(liveClasses, 'live')}
          </TabsContent>
          <TabsContent value="upcoming" className="mt-4">
            {renderTabContent(upcomingClasses, 'upcoming')}
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            {renderTabContent(endedClasses, 'completed')}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
