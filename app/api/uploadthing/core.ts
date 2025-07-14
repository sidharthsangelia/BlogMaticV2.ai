import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/* ─────────────────────────  optional fake auth  ─────────────────────────── */
const auth = async (req: Request) => ({ id: "demo‑user" });

/* ───────────────────────────  File Router  ──────────────────────────────── */
export const ourFileRouter = {
  /* change route slug to “videoUploader” and accept video/mp4 */
  videoUploader: f({
    video: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // runs on the server after upload completes
      console.log("✅ Upload complete for user:", metadata.userId);
      console.log("📂 Public URL:", file.ufsUrl); // ← use this in the client
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,        // send back to client-side callback
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;


// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { inngest } from "@/lib/inngest/client";
// import { JobManager } from "@/lib/services/job-manager";
// import { nanoid } from "nanoid";

// const f = createUploadthing();

// export const ourFileRouter = {
//   videoUploader: f({ 
//     video: { maxFileSize: "512MB", maxFileCount: 1 } 
//   })
//     .middleware(async () => {
//       return { userId: "user_123" }; // Add auth later
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete:", file.url);
      
//       // Don't process immediately - just return the URL
//       // Processing will be triggered from the frontend
//       return { 
//         uploadedBy: metadata.userId,
//         ufsUrl: file.url // Keep your existing property name
//       };
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;