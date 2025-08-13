
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader } from "lucide-react";

interface BatchCardProps {
  name: string;
  href: string;
  imageUrl: string;
  validity: string;
  price: string;
  originalPrice: string;
  imageHint: string;
  isLoading?: boolean;
  onClick: () => void;
}

export function BatchCard({
  name,
  href,
  imageUrl,
  validity,
  price,
  originalPrice,
  imageHint,
  isLoading,
  onClick,
}: BatchCardProps) {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isLoading) {
      onClick();
    }
  };

  return (
    <a href={href} onClick={handleClick} className="group block">
        <Card className="rounded-lg overflow-hidden shadow-lg transition-transform duration-200 ease-in-out group-hover:scale-105 bg-white">
            <div className="relative w-full aspect-[16/9]">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                />
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold text-base text-gray-800 truncate h-6">{name}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>Validity: {validity}</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">{price}</span>
                    <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
                </div>
                <Button className="w-full mt-4 bg-gray-800 text-white hover:bg-gray-900" disabled={isLoading}>
                    {isLoading ? <Loader className="animate-spin" /> : 'Enroll Now'}
                </Button>
            </CardContent>
        </Card>
    </a>
  );
}
