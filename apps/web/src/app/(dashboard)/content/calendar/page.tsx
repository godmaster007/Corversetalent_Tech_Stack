import { prisma } from "@corversetalent/db";
import { Calendar, BookOpen, Clock, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";

export default async function ContentLibraryPage() {
  // Fetch all posts, ordered by newest first
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-500" />
            Content Library & Calendar
          </h1>
          <p className="text-gray-400">
            Manage your generated LinkedIn posts and engagement comments.
          </p>
        </div>
        <Link 
          href="/content/generator"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
        >
          Generate New Content
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <FileText className="w-16 h-16 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-200 mb-2">No content saved yet</h2>
          <p className="text-gray-400 mb-6">Head over to the AI Generator to start creating highly engaging LinkedIn content.</p>
          <Link 
            href="/content/generator"
            className="px-6 py-3 bg-[#23293b] hover:bg-[#2d3446] text-white rounded-xl font-medium transition-colors"
          >
            Open Generator
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col h-[320px]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider ${
                    post.status === "published" ? "bg-green-500/10 text-green-400" :
                    post.status === "scheduled" ? "bg-blue-500/10 text-blue-400" :
                    "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.createdAt.toLocaleDateString()}
                </div>
              </div>
              
              <div className="mb-2">
                <h3 className="font-semibold text-gray-200 truncate" title={post.topic || "Comment"}>
                  {post.topic || "Engagement Comment"}
                </h3>
                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                  <span className="bg-[#11131a] px-2 py-0.5 rounded">{post.format || "Comment"}</span>
                  <span className="bg-[#11131a] px-2 py-0.5 rounded">{post.tone || "Insightful"}</span>
                </div>
              </div>

              <div className="flex-1 bg-[#11131a] rounded-xl p-4 mt-2 overflow-hidden relative border border-gray-800">
                <div className="absolute inset-0 p-4 overflow-y-auto text-sm text-gray-400 whitespace-pre-wrap font-sans">
                  {post.content}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#11131a] to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
