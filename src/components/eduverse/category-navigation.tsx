"use client";

import { useState, useEffect, type ReactElement } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CATEGORIES = ["Video", "Notes", "DPP"];
const STORAGE_KEY = "eduverse-active-category";

export function CategoryNavigation({ children }: { children: ReactElement[] }) {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]); 

  useEffect(() => {
    const savedTab = localStorage.getItem(STORAGE_KEY);
    if (savedTab && CATEGORIES.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="flex bg-white px-2.5 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <TabsList className="bg-transparent p-0 h-auto">
          {CATEGORIES.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-sm text-gray-600 cursor-pointer py-2.5 px-2.5 mx-1.5 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-bold data-[state=active]:text-black rounded-none shadow-none"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children && CATEGORIES.map((category, index) => (
        <TabsContent key={category} value={category} className="mt-0">
          {children[index]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
