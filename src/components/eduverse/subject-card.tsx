
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SubjectCardProps {
  title: string;
  topicCount: number;
  imageUrl: string;
  imageHint: string;
  slug: string;
  originPath?: string;
  href?: string;
  isLoading?: boolean;
  onClick?: (href: string) => void;
}

export function SubjectCard({
  title,
  topicCount,
  imageUrl,
  imageHint,
  slug,
  originPath,
  href: customHref,
  isLoading,
  onClick,
}: SubjectCardProps) {
  const href = customHref || (originPath ? `/subjects/${slug}?from=${originPath}` : `/subjects/${slug}`);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className="group block no-underline" aria-label={`View ${title}`}>
      <Card className="flex items-center p-2.5 rounded-xl shadow-md transition-transform duration-200 ease-in-out group-hover:scale-[1.02] border-0">
        <Image
          src={imageUrl}
          alt=""
          aria-hidden="true"
          width={80}
          height={60}
          className="object-cover rounded-lg mr-4"
          data-ai-hint={imageHint}
          style={{ height: 'auto' }}
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-black">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {slug === 'live' ? 'Watch live classes' : `${topicCount} Topic${topicCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="bg-gray-100 rounded-full p-1">
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </Card>
    </Link>
  );
}
