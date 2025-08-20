 
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BatchCard } from '@/components/eduverse/batch-card';
import { Loader, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const batches = [
    {
        name: 'Aarambh Batch | Class 9th',
        href: '/edu9',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/152792333113_9th%20aarambh%202.0%20banner%20app.jpg',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '₹2500',
        imageHint: 'class 9 batch',
        tags: ['9'],
    },
    {
        name: 'Aarambh Batch | Class 10th',
        href: '/edu10',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/285939929246_10th%20aarambh%202.0%20banner%20app.jpg',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '₹2500',
        imageHint: 'class10 batch',
        tags: ['10'],
    },
    {
        name: 'Prarambh Batch | Science Class 11',
        href: '/pcmb',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/183130728609_Prarambh%20BATCh%20Science%20Class%2011.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '₹3000',
        imageHint: 'science batch', 
        tags: ['11'],
    },
    {
        name: 'Prarambh Batch | Commerce Class 11',
        href: '/commerce',
        imageUrl: 'https://dxixtlyravvxx.cloudfront.net/540/admin_v1/bundle_management/course/737975028610_Prarambh%20BATCh%20Commerce%2011.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '₹3000',
        imageHint: 'commerce batch', 
        tags: ['11'],
    },
    {
        name: '9th Abhay Batch | 2024-25',
        href: '/abhay9-2025',
        imageUrl: 'https://i.postimg.cc/SR7Fbsxh/78589124373-67499f10f203a-abhay-9th-new-1.png',
        validity: '365 Days',
        price: 'Free',
        originalPrice: '₹1300',
        imageHint: 'class 9 batch',
        tags: ['9'],
    }, 
    {
        name: '10th Aarambh Batch | 2024-25',
        href: '/edu10aarambh',
        imageUrl: 'https://i.ytimg.com/vi/cFK4To0gr7Y/hq720.jpg',
        validity: '365 Days',
        price: 'Free', 
        originalPrice: '₹1999',
        imageHint: 'class 10 batch',
        tags: ['10'],
    }, 
    {
        name: '10th Abhay Batch | 2024-25',
        href: '/abhay2025',
        imageUrl: 'https://i.postimg.cc/pVKv3cLR/667423824369-IMG-9619.png',
        validity: '365 Days',
        price: 'Free', 
        originalPrice: '₹1299',
        imageHint: '10th class batch',       
        tags: ['10'],
    }, 
];

type FilterType = 'all' | '9' | '10' | '11';

export default function VerifiedUserPage() {
    const router = useRouter();
    const [loadingBatch, setLoadingBatch] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const handleBatchClick = (href: string) => {
        setLoadingBatch(href);
        router.push(href);
    };

    const filteredBatches = batches.filter(batch => {
        const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' || batch.tags.includes(activeFilter);
        return matchesSearch && matchesFilter;
    });

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
                
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for a batch..."
                            className="w-full pr-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant={activeFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={activeFilter === '9' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveFilter('9')}
                        >
                            Class 9
                        </Button>
                        <Button
                            variant={activeFilter === '10' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveFilter('10')}
                        >
                            Class 10
                        </Button>
                        <Button
                            variant={activeFilter === '11' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveFilter('11')}
                        >
                            Class 11
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredBatches.map((batch) => (
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
                {filteredBatches.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 col-span-full">
                        <p>No batches found matching your criteria.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
