
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubjectCard } from "@/components/eduverse/subject-card";

const subjects = [
    {
        title: "Science",
        topicCount: 1,
        slug: "science",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/28070448615_WhatsApp%20Image%202025-04-25%20at%204.25.51%20PM.jpeg",
        imageHint: "atom science",
    },
    {
        title: "Maths",
        topicCount: 1,
        slug: "maths",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/50239338613_Maths.jpeg",
        imageHint: "calculus math",
    },
    {
        title: "Social Science",
        topicCount: 1,
        slug: "social-science",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/60137688614_Social%20Science.jpeg",
        imageHint: "globe geography",
    },
    {
        title: "English",
        topicCount: 1,
        slug: "english",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/724718721778_English.jpeg",
        imageHint: "book english",
    },
];

export default function Abhay2025Page() {
    const router = useRouter();
    const [loadingSubject, setLoadingSubject] = useState<string | null>(null);

    const handleSubjectClick = (slug: string, href: string) => {
        setLoadingSubject(slug);
        router.push(href);
    };

    return (
        <main className="min-h-screen bg-gray-50 text-foreground">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-xl mx-auto px-4">
                    <div className="flex items-center justify-center h-16">
                        <h1 className="text-2xl font-bold text-gray-800 animate-pulse">
                            Abhay Batch - 2025
                        </h1>
                    </div>
                </div>
            </header>
            <div className="max-w-xl mx-auto px-4 py-5">
                <div className="grid grid-cols-1 gap-4">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.slug}
                            title={subject.title}
                            topicCount={subject.topicCount}
                            slug={subject.slug}
                            imageUrl={subject.imageUrl}
                            imageHint={subject.imageHint}
                            originPath="/abhay2025"
                            isLoading={loadingSubject === subject.slug}
                            onClick={(href) => handleSubjectClick(subject.slug, href)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
