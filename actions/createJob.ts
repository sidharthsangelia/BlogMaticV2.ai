// app/actions/createJob.js
"use server";

import { JobManager } from "@/lib/services/jobManager";
import { inngest } from "@/inngest/client";
import { nanoid } from "nanoid";

interface CreateJobConfig {
    [key: string]: any;
}

interface CreateJobResult {
    success: boolean;
    jobId?: string;
    error?: string;
}

export async function createJobAction(
    videoUrl: string,
    config: CreateJobConfig
): Promise<CreateJobResult> {
    try {
        // Create job
        const jobId: string = nanoid();
        await JobManager.createJob({
            id: jobId,
            videoUrl: videoUrl,
            userInputs: config,
        });

        // Trigger Inngest workflow
        await inngest.send({
            name: "video/uploaded",
            data: {
                id: jobId,
                videoUrl: videoUrl,
                userInputs: config,
                language: "en",
            },
        });

        return { success: true, jobId };
    } catch (error: any) {
        console.error("Error creating job:", error);
        return { success: false, error: error.message };
    }
}