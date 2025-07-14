"use client";
import { JobStatus } from "@/lib/services/jobManager"; // Changed import path
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface JobStatusCardProps {
  jobId: string; // Changed to accept jobId instead of job object
}

export default function JobStatusCard({ jobId }: JobStatusCardProps) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Polling function to get job status
    const pollJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('Job not found');
        }
        
        const jobData = await response.json();
        setJob(jobData);
        setLoading(false);
        
        // Keep polling if job is not completed
        if (jobData.status !== 'completed' && jobData.status !== 'failed') {
          setTimeout(pollJob, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setLoading(false);
      }
    };

    pollJob();
  }, [jobId]);

  const getStatusMessage = (status: string) => {
    const messages = {
      uploading: [
        "🧙‍♂️ The digital wizards are carefully storing your video spell...",
        "📤 Magical file carriers are transporting your masterpiece...",
        "🌟 Your video is floating through the cloud dimension..."
      ],
      processing: [ // Added processing status
        "🎧 AI miners are extracting golden words from your audio...",
        "🔍 Language detectives are deciphering every syllable...",
        "📝 Word wizards are translating sounds into text magic..."
      ],
      transcribing: [
        "🎧 AI miners are extracting golden words from your audio...",
        "🔍 Language detectives are deciphering every syllable...",
        "📝 Word wizards are translating sounds into text magic..."
      ],
      generating: [
        "✨ Content sorcerers are weaving your blog post spell...",
        "🎭 Creative genies are crafting your perfect article...",
        "🌙 Moon scribes are writing your story under starlight..."
      ],
      completed: [
        "🎉 Ta-da! Your magical blog post is ready to enchant readers!",
        "🏆 Mission accomplished! Your content masterpiece awaits!",
        "🌈 Success! Your words are now ready to inspire the world!"
      ],
      failed: [
        "😅 Oops! The digital gremlins caused some mischief...",
        "🔧 The magic spell needs a little debugging...",
        "🌧️ Technical storm passed through, but we'll try again!"
      ]
    };

    const statusMessages = messages[status as keyof typeof messages] || [
      "🔄 Mystery magic is happening behind the scenes..."
    ];
    
    return statusMessages[Math.floor(Math.random() * statusMessages.length)];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-emerald-600";
      case "failed": return "text-rose-600";
      case "uploading": return "text-blue-600";
      case "processing": return "text-purple-600"; // Added processing
      case "transcribing": return "text-purple-600";
      case "generating": return "text-amber-600";
      default: return "text-indigo-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed": return "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200";
      case "failed": return "bg-gradient-to-r from-rose-50 to-red-50 border-rose-200";
      case "uploading": return "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200";
      case "processing": return "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200"; // Added processing
      case "transcribing": return "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200";
      case "generating": return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200";
      default: return "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500";
      case "failed": return "bg-rose-500";
      case "uploading": return "bg-blue-500";
      case "processing": return "bg-purple-500"; // Added processing
      case "transcribing": return "bg-purple-500";
      case "generating": return "bg-amber-500";
      default: return "bg-indigo-500";
    }
  };

  // Loading state
  if (loading || !job) {
    return (
      <div className="w-full max-w-2xl rounded-xl p-6 border-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <div className="font-medium text-lg text-indigo-600">
            🔍 Searching for your magical job...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl rounded-xl p-6 border-2 transition-all duration-500 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    } ${getStatusBg(job.status)} shadow-lg hover:shadow-xl`}>
      
      {/* Status Message */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`font-medium text-lg ${getStatusColor(job.status)} leading-relaxed`}>
            {getStatusMessage(job.status)}
          </div>
          <span className="text-sm text-gray-500 bg-white/50 px-2 py-1 rounded-full">
            {job.progress}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${getProgressColor(job.status)} rounded-full`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
          
          {/* Progress Labels */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Started</span>
            <span>In Progress</span>
            <span>Complete</span>
          </div>
        </div>
        
        {/* Error Message */}
        {job.error && (
          <div className="bg-rose-100 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚨</span>
              <div>
                <div className="font-medium">Something went wrong!</div>
                <div className="text-sm">{job.error}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Completion Message with Results */}
        {job.status === "completed" && (
          <div className="space-y-4">
            <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎊</span>
                <div className="font-medium">Your content is ready to shine!</div>
              </div>
            </div>
            
            {/* Show Results */}
            <div className="space-y-4">
              {/* Transcript Preview */}
              {job.transcript && (
                <div className="bg-white/70 rounded-lg p-4 border border-white/50">
                  <h4 className="font-medium text-gray-800 mb-2">📝 Transcript Preview</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {job.transcript.substring(0, 200)}...
                  </p>
                </div>
              )}
              
              {/* Blog Preview */}
              {job.blogHtml && (
                <div className="bg-white/70 rounded-lg p-4 border border-white/50">
                  <h4 className="font-medium text-gray-800 mb-2">📄 Blog Post Preview</h4>
                  <div 
                    className="text-sm text-gray-600 line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: job.blogHtml.substring(0, 300) + '...' 
                    }}
                  />
                </div>
              )}
              
              {/* Action Button */}
              <button 
                onClick={() => window.open(`/job/${job.id}/results`, '_blank')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                🚀 View Full Results
              </button>
            </div>
          </div>
        )}
        
        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-white/30">
          <span>⏰</span>
          <span>Journey started: {new Date(job.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}