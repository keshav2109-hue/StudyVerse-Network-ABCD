
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BatchCard } from '@/components/eduverse/batch-card';
import { Loader } from 'lucide-react';

const batches = [
    {
        name: 'Aarambh 2024-25 Batch',
        href: '/edu10aarambh',
        imageUrl: 'https://i.ytimg.com/vi/cFK4To0gr7Y/hq720.jpg',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'class 10 batch',
    },
    {
        name: 'Prarambh Batch | Science Class 11',
        href: '/pcmb',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/183130728609_Prarambh%20BATCh%20Science%20Class%2011.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'science batch',
    },
    {
        name: 'Prarambh Batch | Commerce Class 11',
        href: '/commerce',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/737975028610_Prarambh%20BATCh%20Commerce%2011.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'commerce batch',
    },
    {
        name: 'Aarambh 2.0 | Class 10th Batch 25-26',
        href: '/edu10',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/285939929246_10th%20aarambh%202.0%20banner%20app.jpg',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'class 10 batch',
    },
    {
        name: 'Aarambh 2.0 | Class 9th Batch 25-26',
        href: '/edu9',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/152792333113_9th%20aarambh%202.0%20banner%20app.jpg',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'class 9 batch',
    },
    {
        name: 'Abhay 2025',
        href: '/abhay2025',
        imageUrl: 'https://i.postimg.cc/6T6Fv0Zm/image.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'class batch',
    },
    {
        name: 'Abhay Class 9th 2025',
        href: '/abhay9-2025',
        imageUrl: 'https://i.postimg.cc/SR7Fbsxh/78589124373-67499f10f203a-abhay-9th-new-1.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '',
        imageHint: 'class 9 batch',
    }
];

export default function VerifiedUserPage() {
    const router = useRouter();
    const [loadingBatch, setLoadingBatch] = useState<string | null>(null);

    const handleBatchClick = (href: string) => {
        setLoadingBatch(href);
        // The loading state will be visible for a moment before navigation.
        router.push(href);
    };

    return (
        <main className="min-h-screen bg-gray-50 text-foreground">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-16">
                        <h1 className="text-2xl font-bold text-gray-800">
                            EduVerse 2.O
                        </h1>
                    </div>
                </div>
            </header>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <p className="text-center text-gray-600 mb-6">You have successfully verified your access. Please select your batch to continue.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {batches.map((batch) => (
                        <BatchCard
                            key={batch.name}
                            name={batch.name}
                            href={batch.href}
                            imageUrl={batch.imageUrl}
                            validity={batch.validity}
                            price={batch.price}
                            originalPrice={batch.originalPrice}
                            imageHint={batch.imageHint}
                            isLoading={loadingBatch === batch.href}
                            onClick={() => handleBatchClick(batch.href)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
