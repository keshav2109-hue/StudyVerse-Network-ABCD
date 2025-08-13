
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TopicCardProps {
  title: string;
  imageUrl: string;
  imageHint: string;
}

export function TopicCard({
  title,
  imageUrl,
  imageHint,
}: TopicCardProps) {
  return (
    <Card className="flex items-center p-2.5 rounded-none shadow-none transition-transform duration-200 ease-in-out hover:scale-[1.02] border-0 border-b border-gray-200 last:border-b-0 bg-white">
      <Image
        src={imageUrl}
        alt=""
        aria-hidden="true"
        width={100}
        height={75}
        className="object-cover rounded-lg mr-4"
        data-ai-hint={imageHint}
        style={{ height: 'auto' }}
      />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-black line-clamp-2">{title}</h3>
      </div>
      <div className="bg-gray-100 rounded-full p-2 ml-2">
        <PlayCircle className="h-5 w-5 text-gray-600" />
      </div>
    </Card>
  );
}
