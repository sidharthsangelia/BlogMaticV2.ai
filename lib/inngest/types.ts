export interface JobData {
  id: string;
  videoUrl: string;
  userInputs: {
    variation: number;
    tone: string;
    audience: string;
  };
  language: string;
}

export interface JobStatus {
  id: string;
  status: 'uploading' | 'transcribing' | 'generating' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  transcript?: string;
  blogHtml?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InngestEvents = {
  "video/uploaded": {
    data: JobData;
  };
  "job/transcription-complete": {
    data: {
      jobId: string;
      transcript: string;
    };
  };
  "job/blog-complete": {
    data: {
      jobId: string;
      blogHtml: string;
    };
  };
  "job/failed": {
    data: {
      jobId: string;
      error: string;
    };
  };
};