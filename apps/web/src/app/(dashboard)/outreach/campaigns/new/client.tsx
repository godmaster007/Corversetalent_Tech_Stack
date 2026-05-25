"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Users, ListTree, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface Sequence {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  title: string | null;
}

export default function NewCampaignClient({ sequences, contacts }: { sequences: Sequence[], contacts: Contact[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sequenceId, setSequenceId] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleContact = (id: string) => {
    const newSet = new Set(selectedContacts);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedContacts(newSet);
  };

  const selectAll = () => {
    setSelectedContacts(new Set(contacts.map(c => c.id)));
  };

  const deselectAll = () => {
    setSelectedContacts(new Set());
  };

  const handleLaunch = async () => {
    if (!name || !sequenceId || selectedContacts.size === 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sequenceId,
          contactIds: Array.from(selectedContacts)
        })
      });

      if (res.ok) {
        router.push("/outreach/campaigns");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to launch campaign");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/outreach/campaigns" className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Campaign</h1>
            <p className="text-gray-400">Import prospects and launch a multi-channel sequence.</p>
          </div>
        </div>
        <button 
          onClick={handleLaunch}
          disabled={!name || !sequenceId || selectedContacts.size === 0 || isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Launch Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q3 VPs of Sales Outreach"
                className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <ListTree className="w-4 h-4 text-indigo-400" />
                Select Sequence
              </label>
              <select 
                value={sequenceId}
                onChange={(e) => setSequenceId(e.target.value)}
                className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">-- Choose a sequence --</option>
                {sequences.map(seq => (
                  <option key={seq.id} value={seq.id}>{seq.name}</option>
                ))}
              </select>
              {sequences.length === 0 && (
                <p className="text-xs text-red-400 mt-2">You must create a sequence first.</p>
              )}
            </div>
          </div>
          
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-blue-400" />
              Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Prospects Selected</span>
                <span className="text-white font-medium">{selectedContacts.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-blue-400 font-medium">{selectedContacts.size > 0 && name && sequenceId ? 'Ready to Launch' : 'Draft'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#151925]">
              <h3 className="text-lg font-semibold text-white">Select Prospects (CRM Contacts)</h3>
              <div className="flex gap-4">
                <button onClick={selectAll} className="text-sm text-blue-400 hover:text-blue-300 font-medium">Select All</button>
                <button onClick={deselectAll} className="text-sm text-gray-500 hover:text-gray-300 font-medium">Clear</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No contacts found in CRM. Import some from LinkedIn first!
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-[#11131a] sticky top-0">
                    <tr className="border-b border-gray-800 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="p-4 w-12 text-center">
                        <Check className="w-4 h-4 inline" />
                      </th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Title</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {contacts.map((contact) => (
                      <tr 
                        key={contact.id} 
                        className={`transition-colors cursor-pointer ${selectedContacts.has(contact.id) ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'hover:bg-[#23293b]'}`}
                        onClick={() => toggleContact(contact.id)}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedContacts.has(contact.id)}
                            onChange={() => {}}
                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900"
                          />
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-white">{contact.firstName} {contact.lastName}</p>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {contact.company || "-"}
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {contact.title || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
