
'use client';

import { LiveBadge } from "@/components/eduverse/live-badge";
import { Card } from "@/components/ui/card";
import { PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

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

interface ClassDetails {
  subject: string;
  pageTitle: string;
  liveStreamUrl: string;
  times: { startTime: string; endTime: string };
  timeLabel: string;
  status: 'live' | 'upcoming' | 'ended';
}

async function getLiveClasses(): Promise<LiveData> {
  try {
    const res = await fetch(
      "/api/live",
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch live classes");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return {};
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
    
    if (now >= startDate && now <= endDate) {
        return 'live';
    }
    if (now < startDate) {
        return 'upcoming';
    }
    return 'ended';

  } catch (error) {
    console.error("Error checking time:", error);
    return 'ended';
  }
}


export default function LivePage() {
  const [liveData, setLiveData] = useState<LiveData>({});
  const [loading, setLoading] = useState(true);
  const [, setForceRender] = useState({});

  useEffect(() => {
    async function fetchData() {
      const data = await getLiveClasses();
      setLiveData(data);
      setLoading(false);
    }
    fetchData();
    
    const dataInterval = setInterval(fetchData, 30000); 
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

    const statusOrder = { 'live': 1, 'upcoming': 2, 'ended': 3 };
    return details.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [liveData]);

  const renderClass = (details: ClassDetails, index: number) => {
    const isLive = details.status === 'live';
    
    const renderIcon = () => {
      if (isLive) {
        return <PlayCircle className="h-5 w-5 text-gray-600" />;
      }
      return <Clock className="h-5 w-5 text-gray-600" />;
    };
    
    const isClickable = isLive;

    const cardContent = (
        <Card className={`relative flex items-center p-2.5 rounded-xl shadow-md transition-transform duration-200 ease-in-out ${isClickable ? 'group-hover:scale-[1.02]' : ''} border bg-white`}>
            {isLive && (
                <div className="absolute top-2 left-2">
                    <LiveBadge />
                </div>
            )}
            <Image
            src="https://i.postimg.cc/rsKZhQbz/image.png"
            alt="Eduverse"
            width={80}
            height={60}
            className="object-contain rounded-lg mr-4"
            style={{ height: 'auto' }}
            />
            <div className="flex-1">
            <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                {details.subject} | {details.pageTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{details.timeLabel}</p>
            </div>
            <div className="bg-gray-100 rounded-full p-2 ml-2">
            {renderIcon()}
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
    
    return <div className={`group block`} key={`${details.subject}-${index}`}>{cardContent}</div>;
  };

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
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center text-gray-500 mt-10 p-4 bg-white rounded-xl shadow-md">
              Loading live classes...
            </div>
          ) : allClassDetails.length > 0 ? (
             allClassDetails.map(renderClass)
          ) : (
            <div className="text-center text-gray-500 mt-10 p-4 bg-white rounded-xl shadow-md">
              No live classes are scheduled at the moment.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
