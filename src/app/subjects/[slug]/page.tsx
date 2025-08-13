
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryNavigation } from "@/components/eduverse/category-navigation";
import { TopicCard } from "@/components/eduverse/topic-card";
import { ChevronRight, Download, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { DppCard } from "@/components/eduverse/dpp-card";

interface Lecture {
  id: string;
  title: string;
  notesTitle: string;
  notesLink: string;
  videoEmbedType: string;
  videoEmbedUrl: string;
}

interface Topic {
  name: string;
  lectures: Lecture[];
}

interface SubjectData {
  [key: string]: Topic[];
}

interface Dpp {
  id: string;
  title: string;
  subject: string;
  pdf_url: string;
  download_url: string;
}

interface DppData {
  [key: string]: Dpp[];
}

async function getSubjectData(
  slug: string,
  originPath: string
): Promise<{ subjectName: string; topics: Topic[] }> {
  const subjectNames: { [key: string]: string } = {
    physics: "Physics",
    maths: "Maths",
    chemistry: "Chemistry",
    biology: "Biology",
    english: "English",
    hindi: "Hindi",
    "business-studies": "Business Studies",
    accountancy: "Accountancy",
    economics: "Economics",
    "social-science": "Social Science",
    science: "Science",
    sanskrit: "Sanskrit",
    it: "Information Technology",
    mathematics: "Mathematics",
  };

  const subjectName = subjectNames[slug] || "Subject";

  try {
    let url = "";
    const isClass11SpecialSubject = (originPath === '/pcmb' || originPath === '/commerce') && ['maths', 'mathematics', 'english', 'hindi'].includes(slug);

    if (isClass11SpecialSubject) {
      url = "https://eduverseapi.vercel.app/eduverse/api/11/mathsenglishhindi";
    } else if (originPath === '/pcmb') {
      url = "https://eduverseapi.vercel.app/eduverse/api/11/science";
    } else if (originPath === '/commerce') {
      url = "https://eduverseapi.vercel.app/eduverse/api/11/commerce";
    } else if (originPath === '/edu10') {
      url = "https://eduverseapi.vercel.app/eduverse/api/10";
    } else if (originPath === '/edu9') {
      url = "https://eduverseapi.vercel.app/eduverse/api/9";
    }

    if (url) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }
      const data: SubjectData = await res.json();
      
      let formattedSlug: string;
      if (slug === 'maths' || slug === 'mathematics') {
        formattedSlug = 'Mathematics';
      } else if (slug === 'business-studies') {
        formattedSlug = 'Business Studies';
      } else if (slug === 'accountancy') {
        formattedSlug = 'Accountancy';
      } else if (slug === 'social-science') {
          formattedSlug = 'Social Science';
      } else if (slug === 'science') {
          formattedSlug = 'Science';
      } else if (slug === 'sanskrit') {
          formattedSlug = 'Sanskrit';
      } else if (slug === 'it') {
          formattedSlug = 'IT';
      }
      else {
        formattedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
      }
      
      const topics = data[formattedSlug] || [];
      return { subjectName, topics };
    }
  } catch (error) {
    console.error(error);
  }

  return { subjectName, topics: [] };
}

async function getDppData(
  slug: string,
  originPath: string
): Promise<Dpp[]> {
    try {
        let url = "";
        if (originPath === '/pcmb') {
            url = "https://eduverseapi.vercel.app/eduverse/api/dpp/11science";
        } else if (originPath === '/commerce') {
            url = "https://eduverseapi.vercel.app/eduverse/api/dpp/11commerce";
        } else if (originPath === '/edu10') {
            url = "https://eduverseapi.vercel.app/eduverse/api/dpp/10";
        } else if (originPath === '/edu9') {
            url = "https://eduverseapi.vercel.app/eduverse/api/dpp/9";
        }
        
        const subjectNameMap: { [key: string]: string } = {
            'maths': 'Mathematics',
            'mathematics': 'Mathematics',
            'business-studies': 'Business Studies',
            'physics': 'Physics',
            'chemistry': 'Chemistry',
            'biology': 'Biology',
            'accountancy': 'Accountancy',
            'economics': 'Economics',
            'social-science': 'Social Science',
            'science': 'Science',
            'sanskrit': 'Sanskrit',
            'it': 'Information Technology',
            'hindi': 'Hindi',
            'english': 'English',
        };

        if (url) {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) {
                throw new Error(`Failed to fetch DPP data from ${url}`);
            }
            const data: Dpp[] = await res.json();
            
            const subjectToFilter = subjectNameMap[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1));

            return data.filter(dpp => dpp.subject === subjectToFilter);
        }
    } catch (error) {
        console.error(error);
    }
    return [];
}


export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = params;
  const from = typeof searchParams.from === 'string' ? searchParams.from : '/pcmb';
  const { subjectName, topics } = await getSubjectData(slug, from);
  const dpps = await getDppData(slug, from);

  const subjectImages: { [key: string]: string } = {
    physics:
      "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/395380615606_Physics.jpeg",
    chemistry:
      "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/203426323782_Chemestry.jpeg",
    biology:
      "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/22273823798_Biology.jpeg",
    maths:
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/50239338613_Maths.jpeg",
    mathematics:
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/50239338613_Maths.jpeg",
    english:
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/73786089152_English.jpeg",
    hindi:
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/666600923850_Hindi.jpeg",
    "business-studies":
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/627728423781_BST.jpeg",
    accountancy:
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/360629323799_Account.jpeg",
    economics:
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/56643923786_Economic.jpeg",
    "social-science": 
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/60137688614_Social%20Science.jpeg",
    science: 
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/28070448615_WhatsApp%20Image%202025-04-25%20at%204.25.51%20PM.jpeg",
    sanskrit: 
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/371831425330_Sanskrit.jpeg",
    it: 
        "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/290274114891_Artificial%20Intelligence-2.png",
  };
  const defaultImageUrl = "https://placehold.co/100x75.png";
  
  const allLectures = topics.flatMap(topic => topic.lectures).reverse();
  const lecturesWithVideo = allLectures.filter(lecture => lecture.videoEmbedUrl);
  const lecturesWithNotes = allLectures.filter(lecture => lecture.notesLink);

  return (
    <div className="min-h-screen bg-gray-50 text-foreground">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center text-sm text-gray-500">
              <Link href={from} className="hover:text-gray-700">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-semibold text-gray-800">{subjectName}</span>
            </div>
          </div>
        </div>
      </header>
      <CategoryNavigation>
        <div className="grid grid-cols-1 gap-px bg-gray-100 border-t">
            {lecturesWithVideo.length > 0 ? (
                lecturesWithVideo.map((lecture, index) => {
                  const watchUrl = `/eduverseplay?videoUrl=${encodeURIComponent(lecture.videoEmbedUrl)}`;

                  return (
                    <Link href={watchUrl} key={`${lecture.id}-${lecture.title}-video-${index}`} className="no-underline">
                      <TopicCard
                        title={lecture.title}
                        imageUrl={subjectImages[slug] || defaultImageUrl}
                        imageHint={slug}
                      />
                    </Link>
                  )
                })
            ) : (
              <div className="text-center text-gray-500 mt-10 p-4 bg-white">
                No videos available for this subject yet.
              </div>
            )}
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-100 border-t">
            {lecturesWithNotes.length > 0 ? (
                lecturesWithNotes.map((lecture, index) => (
                    <a
                        href={lecture.notesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={`${lecture.id}-${lecture.title}-note-${index}`}
                        className="group block"
                    >
                        <Card className="flex items-center p-2.5 rounded-xl shadow-md transition-transform duration-200 ease-in-out group-hover:scale-[1.02] border bg-white">
                            <Image
                                src="https://theeduverse.xyz/images/Ev.jpg"
                                alt="Eduverse"
                                width={80}
                                height={60}
                                className="object-contain rounded-lg mr-4"
                                style={{ height: 'auto' }}
                            />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-black line-clamp-2">{lecture.notesTitle || lecture.title}</h3>
                            </div>
                            <div className="bg-gray-100 rounded-full p-2 ml-2">
                                <Download className="h-4 w-4 text-gray-500" />
                            </div>
                        </Card>
                    </a>
                ))
            ) : (
                <div className="text-center text-gray-500 mt-10 p-4 bg-white">
                    No notes available for this subject yet.
                </div>
            )}
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 bg-gray-100 border-t">
            {dpps.length > 0 ? (
                dpps.map((dpp, index) => (
                    <DppCard
                        key={`${dpp.title}-${index}`}
                        title={dpp.title}
                        pdfUrl={dpp.download_url}
                    />
                ))
            ) : (
                <div className="text-center text-gray-500 mt-10 p-4 bg-white">
                    No DPPs available for this subject yet.
                </div>
            )}
        </div>
      </CategoryNavigation>
      <main className="max-w-xl mx-auto px-4 py-5">
      </main>
    </div>
  );
}
