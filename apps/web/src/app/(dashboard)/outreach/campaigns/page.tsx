import { prisma } from "@corversetalent/db";
import { Plus, Users, Send, MousePointerClick, Reply, Play, Pause, CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    include: {
      sequence: true,
      _count: {
        select: { members: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Campaign Management</h2>
          <p className="text-gray-400">Launch and monitor multi-channel outreach campaigns.</p>
        </div>
        <Link href="/outreach/campaigns/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Campaign
        </Link>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Prospects</p>
              <h3 className="text-3xl font-bold text-white">0</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Messages Sent</p>
              <h3 className="text-3xl font-bold text-white">0</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Open Rate</p>
              <h3 className="text-3xl font-bold text-white">0%</h3>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
              <Reply className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Reply Rate</p>
              <h3 className="text-3xl font-bold text-white">0%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#151925]">
          <h3 className="text-lg font-semibold text-white">Active Campaigns</h3>
        </div>
        
        {campaigns.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-400 max-w-md">
              Create a sequence and launch your first multi-channel outreach campaign.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="p-6">Campaign Name</th>
                  <th className="p-6">Sequence</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Prospects</th>
                  <th className="p-6">Metrics</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[#23293b] transition-colors">
                    <td className="p-6">
                      <p className="font-semibold text-white">{campaign.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Created {campaign.createdAt.toLocaleDateString()}</p>
                    </td>
                    <td className="p-6">
                      <span className="bg-[#11131a] px-3 py-1 rounded-lg text-sm text-gray-300 border border-gray-700">
                        {campaign.sequence?.name || "Unknown Sequence"}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        campaign.status === "active" ? "bg-green-500/10 text-green-400" :
                        campaign.status === "paused" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-gray-800 text-gray-400"
                      }`}>
                        {campaign.status === "active" && <Play className="w-3 h-3" />}
                        {campaign.status === "paused" && <Pause className="w-3 h-3" />}
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-medium text-white">{campaign._count.members}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span title="Opened"><MousePointerClick className="w-4 h-4 inline mr-1 text-purple-400"/> 0%</span>
                        <span title="Replied"><Reply className="w-4 h-4 inline mr-1 text-green-400"/> 0%</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
