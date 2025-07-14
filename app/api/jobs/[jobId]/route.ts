// app/api/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { JobManager } from "@/lib/services/jobManager";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  
  try {
    // Query your database instead of Inngest
    const job = await JobManager.getJob(jobId);
    
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}