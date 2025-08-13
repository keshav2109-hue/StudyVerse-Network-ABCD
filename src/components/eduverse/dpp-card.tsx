import Image from "next/image";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DppCardProps {
  title: string;
  pdfUrl: string;
}

export function DppCard({ title, pdfUrl }: DppCardProps) {
  return (
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
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
          <h3 className="text-sm font-semibold text-black line-clamp-2">{title}</h3>
        </div>
        <div className="bg-gray-100 rounded-full p-2 ml-2">
          <Download className="h-4 w-4 text-gray-500" />
        </div>
      </Card>
    </a>
  );
}
