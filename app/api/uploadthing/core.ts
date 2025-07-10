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
      console.log("📂 Public URL:", file.url); // ← use this in the client
      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,        // send back to client-side callback
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
