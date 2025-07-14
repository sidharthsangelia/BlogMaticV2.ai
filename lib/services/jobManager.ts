// lib/services/jobManager.ts
import prisma from "@/lib/prisma";

export interface JobStatus {
  id: string;
  status: string;
  progress: number;
  videoUrl: string;
  transcript?: string | null;
  blogHtml?: string | null;
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  language?: string | null;
}

export class JobManager {
  static async createJob(jobData: {
    id: string;
    videoUrl: string;
    userInputs: any;
    language?: string;
  }): Promise<JobStatus> {
    const job = await prisma.job.create({
      data: {
        id: jobData.id,
        status: "uploading",
        progress: 0,
        videoUrl: jobData.videoUrl,
        language: jobData.language,
      }
    });

    return job;
  }

  static async getJob(jobId: string): Promise<JobStatus | null> {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    return job;
  }

  static async updateJob(
    jobId: string,
    updates: Partial<Omit<JobStatus, 'id' | 'createdAt'>>
  ): Promise<JobStatus | null> {
    try {
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          ...updates,
          updatedAt: new Date(),
          // Set completedAt when status is completed
          ...(updates.status === "completed" && { completedAt: new Date() }),
        }
      });

      return updatedJob;
    } catch (error) {
      console.error("Error updating job:", error);
      return null;
    }
  }

  static async getAllJobs(): Promise<JobStatus[]> {
    return await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}