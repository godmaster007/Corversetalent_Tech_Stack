"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, ListTree } from "lucide-react";

export default function OutreachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4 border-b border-gray-800">
        <h1 className="text-3xl font-bold mb-6">Outreach Orchestrator</h1>
        
        <div className="flex gap-6">
          <Link 
            href="/outreach/campaigns"
            className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors ${
              pathname.includes("/campaigns") 
                ? "border-blue-500 text-blue-400" 
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
            }`}
          >
            <Mail className="w-5 h-5" />
            Campaigns
          </Link>
          <Link 
            href="/outreach/sequences"
            className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors ${
              pathname.includes("/sequences") 
                ? "border-blue-500 text-blue-400" 
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
            }`}
          >
            <ListTree className="w-5 h-5" />
            Sequence Builder
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
