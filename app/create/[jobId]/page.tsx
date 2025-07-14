"use client";

import { useParams } from "next/navigation";
import { useJobStatus } from "@/hooks/useJobStatus";
import JobStatusCard from "@/components/JobStatusCard";
import Post from "@/components/Post";

export default function JobStatusPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { job, loading, error } = useJobStatus(jobId);

  if (loading && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading job status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Processing Your Video</h1>
      
      <JobStatusCard jobId={jobId} />

      {/* Show transcript when available */}
      {job.transcript && (
        <section className="w-full max-w-2xl space-y-2">
          <h2 className="text-xl font-semibold">Transcript</h2>
          <pre className="whitespace-pre-wrap rounded border p-3 bg-gray-50 text-sm max-h-60 overflow-y-auto">
            {job.transcript}
          </pre>
        </section>
      )}

      {/* Show blog post when completed */}
      {job.status === "completed" && job.blogHtml && (
        <section className="w-full max-w-2xl space-y-2">
          <h2 className="text-xl font-semibold">Generated Blog Post</h2>
          <Post
            content={job.blogHtml}
            onContentChange={(val) => {
              // Handle content changes if needed
              console.log("Content changed:", val);
            }}
          />
        </section>
      )}
    </div>
  );
}