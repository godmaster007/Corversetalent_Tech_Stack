"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Save, Loader2, MessageSquare, PenTool } from "lucide-react";

export default function AIGeneratorPage() {
  const [activeTab, setActiveTab] = useState<"post" | "comment">("post");

  // Post State
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("Standard Text Post");
  
  // Comment State
  const [postContent, setPostContent] = useState("");
  
  // Shared State
  const [tone, setTone] = useState("Professional and Insightful");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    if (activeTab === "post" && !topic) return;
    if (activeTab === "comment" && !postContent) return;

    setIsGenerating(true);
    setGeneratedContent("");
    setSaved(false);

    try {
      const payload = activeTab === "post" 
        ? { type: "post", topic, format, tone }
        : { type: "comment", postContent, tone };

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedContent(data.content);
      } else {
        alert(data.error || "Failed to generate content");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToLibrary = async () => {
    if (!generatedContent) return;
    setIsSaving(true);

    try {
      const payload = {
        content: generatedContent,
        topic: activeTab === "post" ? topic : "LinkedIn Comment",
        format: activeTab === "post" ? format : "Comment",
        tone,
        status: "draft"
      };

      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save to library");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          AI Content Engine
        </h1>
        <p className="text-gray-400">
          Generate high-converting LinkedIn posts and engagement comments powered by Google Gemini.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("post")}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            activeTab === "post" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-[#1a1f2e] text-gray-400 hover:text-white border border-gray-800"
          }`}
        >
          <PenTool className="w-5 h-5" />
          Post Generator
        </button>
        <button
          onClick={() => setActiveTab("comment")}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            activeTab === "comment" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-[#1a1f2e] text-gray-400 hover:text-white border border-gray-800"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Comment Generator
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Pane: Controls */}
        <div className="lg:col-span-5 space-y-6 bg-[#1a1f2e] p-6 rounded-2xl border border-gray-800 shadow-xl">
          
          {activeTab === "post" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">What do you want to post about?</label>
                <textarea 
                  className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[120px]"
                  placeholder="e.g. Why SDRs are transitioning into full cycle AEs, and why founders should adapt to this hiring trend..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                <select 
                  className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-3 text-white outline-none"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option>Standard Text Post</option>
                  <option>Carousel Outline</option>
                  <option>Poll Question & Context</option>
                  <option>Story / Anecdote</option>
                  <option>Controversial Take</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Paste the target post here</label>
              <textarea 
                className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[160px]"
                placeholder="Paste the LinkedIn post you want to comment on..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
            <select 
              className="w-full bg-[#11131a] border border-gray-700 rounded-xl p-3 text-white outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Professional and Insightful</option>
              <option>Bold and Challenging</option>
              <option>Data-driven and Analytical</option>
              <option>Empathetic and Human</option>
              <option>Humorous / Witty</option>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || (activeTab === "post" ? !topic : !postContent)}
            className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
              (isGenerating || (activeTab === "post" ? !topic : !postContent))
                ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {activeTab === "post" ? "Generate Post" : "Generate Comment"}
              </>
            )}
          </button>
        </div>

        {/* Right Pane: Preview */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          <div className="flex-1 bg-[#1a1f2e] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-gray-200">Generated Preview</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={copyToClipboard}
                  disabled={!generatedContent}
                  className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button 
                  onClick={saveToLibrary}
                  disabled={!generatedContent || isSaving || saved}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saved ? "Saved" : "Save to Library"}
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              {generatedContent ? (
                <div className="h-full w-full bg-[#11131a] p-6 rounded-xl overflow-y-auto whitespace-pre-wrap text-gray-300 font-sans leading-relaxed border border-gray-800">
                  {generatedContent}
                </div>
              ) : (
                <div className="h-full w-full border-2 border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-500 p-8 text-center">
                  {isGenerating ? "Gemini is writing..." : `Your generated ${activeTab} will appear here.`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
