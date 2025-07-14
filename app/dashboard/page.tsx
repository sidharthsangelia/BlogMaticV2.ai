"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import VideoUploadForm from "@/components/forms/VideoUploadForm";
import BlogConfigForm from "@/components/forms/BlogConfigForm";
import { createJobAction } from "@/actions/createJob"; // Import the server action

export default function Dashboard() {
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleUploadComplete = (url) => {
    setUploadedFileUrl(url);
  };

  const handleConfigSubmit = async (config) => {
    if (!uploadedFileUrl) {
      alert("Please upload a video first!");
      return;
    }

    try {
      setProcessing(true);
      
      // Call the server action
      const result = await createJobAction(uploadedFileUrl, config);
      
      if (result.success) {
        // Redirect to job status page
        router.push(`/create/${result.jobId}`);
      } else {
        alert(`Failed to start processing: ${result.error}`);
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error starting job:", error);
      alert("Failed to start processing. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Your existing JSX remains the same */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <Link href="/posts" className="text-gray-600 hover:text-blue-600 transition-colors">
                All Posts
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Your Magic ✨
          </h1>
          <p className="text-xl text-gray-600">
            Upload your video and let our AI wizards transform it into an amazing blog post
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Upload Your Video</h2>
            </div>
            <VideoUploadForm onUploadComplete={handleUploadComplete} />
          </div>

          {uploadedFileUrl && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Configure Your Blog</h2>
              </div>
              <BlogConfigForm 
                onSubmit={handleConfigSubmit} 
                loading={processing}
              />
            </div>
          )}

          {processing && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 text-center animate-pulse">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    🧙‍♂️ The wizards are preparing their magic spells...
                  </h3>
                  <p className="text-gray-600">
                    You'll be whisked away to the enchanted status page shortly!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <span>💡</span>
              Pro Tips for Best Results
            </h3>
            <ul className="space-y-2 text-amber-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Videos with clear audio work best for transcription</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Choose your tone and audience carefully for better results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Longer videos (5+ minutes) create richer blog content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}