// lib/inngest/functions/processVideo.ts
import { inngest } from "../client";
import { transcribeWithWhisper } from "@/actions/transcribe";
import { JobManager } from "@/lib/services/jobManager";

export const processVideo = inngest.createFunction(
  { id: "process-video" },
  { event: "video/uploaded" },
  async ({ event, step }) => {
    const { id: jobId, videoUrl, userInputs, language } = event.data;

    // Update job status to processing
    await step.run("update-job-status", async () => {
      await JobManager.updateJob(jobId, {
        status: "processing",
        progress: 25 
      });
    });

    // Step 1: Transcribe video
    const transcript = await step.run("transcribe-video", async () => {
      try {
        const text = await transcribeWithWhisper({
          url: videoUrl,
          language,
        });
        return text;
      } catch (error) {
        await JobManager.updateJob(jobId, {
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    });

    // Update job with transcript
    await step.run("update-transcript", async () => {
      await JobManager.updateJob(jobId, {
        transcript,
        progress: 50,
      });
    });

    // Step 2: Generate blog
    await step.run("update-status-generating", async () => {
      await JobManager.updateJob(jobId, {
        status: "generating",
        progress: 75,
      });
    });

    const blogHtml = await step.run("generate-blog", async () => {
      try {
        // Import your existing blog generation function
        const { generateBlogFromVideo } = await import("@/actions/transcribe");
        
        const response = await generateBlogFromVideo(videoUrl, language, userInputs);
        
        // Convert to HTML using your existing function
        const { blogJsonToHtml } = await import("@/utils/jsonToHtml");
        const html = blogJsonToHtml(response.blogPostHtml);
        
        return html;
      } catch (error) {
        await JobManager.updateJob(jobId, {
          status: "failed",
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    });

    // Complete job
    await step.run("complete-job", async () => {
      await JobManager.updateJob(jobId, {
        status: "completed",
        progress: 100,
        blogHtml,
      });
    });

    return { jobId, transcript, blogHtml };
  }
);