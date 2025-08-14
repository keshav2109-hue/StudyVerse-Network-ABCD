
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubjectCard } from "@/components/eduverse/subject-card";

const subjects = [
    {
        title: "Business Studies",
        topicCount: 1,
        slug: "business-studies",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/627728423781_BST.jpeg",
        imageHint: "business chart",
    },
    {
        title: "Accountancy",
        topicCount: 1,
        slug: "accountancy",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/360629323799_Account.jpeg",
        imageHint: "ledger accounts",
    },
    {
        title: "Economics",
        topicCount: 1,
        slug: "economics",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/56643923786_Economic.jpeg",
        imageHint: "economy graph",
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
        title: "English",
        topicCount: 1,
        slug: "english",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/73786089152_English.jpeg",
        imageHint: "book english",
    },
    {
        title: "Hindi",
        topicCount: 1,
        slug: "hindi",
        imageUrl:
            "https://dxixtlyravvxx.cloudfront.net/540/admin_v1/category_management/subject/666600923850_Hindi.jpeg",
        imageHint: "hindi language",
    },
];

export default function CommercePage() {
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
                            Eduverse 2.0 Commerce
                        </h1>
                    </div>
                </div>
            </header>
            <div className="max-w-xl mx-auto px-4 py-5">
                <div className="grid grid-cols-1 gap-4">
                    <SubjectCard
                        title="Live Classes"
                        topicCount={0}
                        slug="live"
                        imageUrl="https://i.postimg.cc/rsKZhQbz/image.png"
                        imageHint="live class"
                        href="/live"
                        isLoading={loadingSubject === 'live'}
                        onClick={(href) => handleSubjectClick('live', href)}
                    />
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.slug}
                            title={subject.title}
                            topicCount={subject.topicCount}
                            slug={subject.slug}
                            imageUrl={subject.imageUrl}
                            imageHint={subject.imageHint}
                            originPath="/commerce"
                            isLoading={loadingSubject === subject.slug}
                            onClick={(href) => handleSubjectClick(subject.slug, href)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
