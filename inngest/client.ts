import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "video-to-blog",
  name: "Video to Blog AI Platform",
})