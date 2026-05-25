"use client";

import { useState } from "react";
import { Plus, Mail, Eye, UserPlus, MessageSquare, Save, Trash2, ArrowRight } from "lucide-react";

type StepType = "email" | "linkedin_view" | "linkedin_connect" | "linkedin_message";

interface SequenceStep {
  id: string;
  type: StepType;
  delayDays: number;
  content: string;
  subject?: string;
}

const ICONS: Record<StepType, React.ReactNode> = {
  email: <Mail className="w-5 h-5 text-blue-400" />,
  linkedin_view: <Eye className="w-5 h-5 text-purple-400" />,
  linkedin_connect: <UserPlus className="w-5 h-5 text-indigo-400" />,
  linkedin_message: <MessageSquare className="w-5 h-5 text-pink-400" />
};

const LABELS: Record<StepType, string> = {
  email: "Send Email",
  linkedin_view: "View Profile",
  linkedin_connect: "Send Connection Request",
  linkedin_message: "Send LinkedIn Message"
};

export default function SequenceBuilderPage() {
  const [sequenceName, setSequenceName] = useState("Trigger-Based Client Outreach");
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: "1", type: "linkedin_view", delayDays: 0, content: "" },
    { id: "2", type: "linkedin_connect", delayDays: 2, content: "Hi {{first_name}}, came across your profile and was really impressed by the growth at {{company}}. Would love to connect!" },
    { id: "3", type: "email", delayDays: 3, subject: "Quick question about {{company}}'s GTM hiring", content: "Hi {{first_name}},\n\nI noticed you are currently hiring for a VP of Sales. As a boutique GTM recruiting agency, we specialize in..." }
  ]);

  const addStep = (type: StepType) => {
    setSteps([...steps, {
      id: Math.random().toString(36).substring(7),
      type,
      delayDays: 1,
      content: ""
    }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, field: keyof SequenceStep, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveSequence = async () => {
    // In a real implementation, POST to /api/sequences
    alert("Sequence saved successfully!");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <input 
            type="text" 
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="text-3xl font-bold bg-transparent border-none outline-none text-white focus:ring-0 p-0 mb-2 w-full"
            placeholder="Sequence Name"
          />
          <p className="text-gray-400">Build multi-channel outreach flows with automated delays.</p>
        </div>
        <button 
          onClick={saveSequence}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Sequence
        </button>
      </div>

      <div className="space-y-6 relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-800 -z-10" />

        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-6 relative">
            
            {/* Step Number Bubble */}
            <div className="w-16 h-16 rounded-2xl bg-[#1a1f2e] border border-gray-700 shadow-xl flex flex-col items-center justify-center shrink-0 z-10">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Day</span>
              <input 
                type="number" 
                value={step.delayDays}
                onChange={(e) => updateStep(step.id, "delayDays", parseInt(e.target.value) || 0)}
                className="bg-transparent text-white font-bold text-lg text-center w-full outline-none"
                min="0"
              />
            </div>

            {/* Step Content Card */}
            <div className="flex-1 bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl relative group">
              <button 
                onClick={() => removeStep(step.id)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#11131a] rounded-lg border border-gray-800">
                  {ICONS[step.type]}
                </div>
                <h3 className="text-lg font-semibold text-gray-200">{LABELS[step.type]}</h3>
              </div>

              {step.type === "email" && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject Line</label>
                  <input 
                    type="text" 
                    value={step.subject || ""}
                    onChange={(e) => updateStep(step.id, "subject", e.target.value)}
                    className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter email subject..."
                  />
                </div>
              )}

              {step.type !== "linkedin_view" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Body</label>
                  <textarea 
                    value={step.content}
                    onChange={(e) => updateStep(step.id, "content", e.target.value)}
                    className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-y"
                    placeholder="Use {{first_name}}, {{company}} as variables..."
                  />
                </div>
              )}

              {step.type === "linkedin_view" && (
                <div className="bg-[#11131a] border border-gray-800 rounded-xl p-4 text-gray-400 text-sm">
                  The extension will automatically navigate to the prospect's LinkedIn profile and spend 15-30 seconds viewing it to trigger a "Who Viewed Your Profile" notification.
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Step Button */}
        <div className="flex gap-6 pt-4">
          <div className="w-16 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 bg-[#1a1f2e] border border-dashed border-gray-700 rounded-2xl p-6 flex items-center gap-4">
            <span className="text-gray-400 font-medium mr-4">Add Step:</span>
            <button onClick={() => addStep("linkedin_view")} className="px-4 py-2 bg-[#11131a] hover:bg-[#23293b] text-gray-300 rounded-lg flex items-center gap-2 transition-colors border border-gray-800">
              <Eye className="w-4 h-4 text-purple-400" /> View
            </button>
            <button onClick={() => addStep("linkedin_connect")} className="px-4 py-2 bg-[#11131a] hover:bg-[#23293b] text-gray-300 rounded-lg flex items-center gap-2 transition-colors border border-gray-800">
              <UserPlus className="w-4 h-4 text-indigo-400" /> Connect
            </button>
            <button onClick={() => addStep("linkedin_message")} className="px-4 py-2 bg-[#11131a] hover:bg-[#23293b] text-gray-300 rounded-lg flex items-center gap-2 transition-colors border border-gray-800">
              <MessageSquare className="w-4 h-4 text-pink-400" /> Message
            </button>
            <button onClick={() => addStep("email")} className="px-4 py-2 bg-[#11131a] hover:bg-[#23293b] text-gray-300 rounded-lg flex items-center gap-2 transition-colors border border-gray-800">
              <Mail className="w-4 h-4 text-blue-400" /> Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
