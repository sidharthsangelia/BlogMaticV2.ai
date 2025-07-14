"use client";

import { useState, useEffect } from "react";
import { JobStatus } from "@/lib/inngest/types";

export function useJobStatus(jobId: string | null) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jobData = await response.json();
        setJob(jobData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchJob();

    // Poll every 2 seconds until completed or failed
    const interval = setInterval(() => {
      if (job?.status === 'completed' || job?.status === 'failed') {
        clearInterval(interval);
        return;
      }
      fetchJob();
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status]);

  return { job, loading, error };
}