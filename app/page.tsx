"use client";

import { useState } from "react";
import {
  transcribeWithWhisper,
  generateBlogFromVideo,
} from "@/actions/transcribe";
import { UploadButton } from "@/utils/uploadthing";
import Link from "next/link";
import Post from "@/components/Post";
import { blogJsonToHtml } from "@/utils/jsonToHtml";

export default function Home() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [blogHtml, setBlogHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadComplete = async (ufsUrl: string) => {
    try {
      setLoading(true);
      setTranscript(null);
      setBlogHtml(null);

      const text = await transcribeWithWhisper({ url: ufsUrl, language: "en" });
      setTranscript(text);

      const response = await generateBlogFromVideo(ufsUrl, "en");
      
      console.log("Full response from server:", response);
      console.log("blogPostHtml type:", typeof response.blogPostHtml);
      
      const blogData = response.blogPostHtml;
      
      if (!blogData || typeof blogData !== 'object') {
        throw new Error(`Expected object, got ${typeof blogData}`);
      }
      
      if (!blogData.content || !Array.isArray(blogData.content)) {
        throw new Error("Missing or invalid content array in blog data");
      }
      
      console.log("Converting to HTML...");
      const html = blogJsonToHtml(blogData);
      console.log("Generated HTML length:", html.length);
      console.log("Generated HTML preview:", html.substring(0, 200) + "...");
      
      setBlogHtml(html);
      setLoading(false);
    } catch (err: any) {
      console.error("Full error:", err);
      alert("Failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 p-8">
      {/* nav */}
      <nav className="flex gap-6 rounded-md bg-red-100 px-6 py-3 shadow-sm">
        <Link href="/admin" className="hover:underline">
          Admin
        </Link>
        <Link href="/posts" className="hover:underline">
          All Posts
        </Link>
      </nav>

      {/* uploader */}
      <UploadButton
        endpoint="videoUploader"
        onClientUploadComplete={(files) => {
          const { ufsUrl } = files[0];
          handleUploadComplete(ufsUrl);
        }}
        onUploadError={(e) => alert(`ERROR! ${e.message}`)}
      />

      {loading && <p className="text-blue-600">Processing… please wait ⏳</p>}

      {transcript && (
        <section className="w-full max-w-2xl space-y-2">
          <h2 className="text-xl font-semibold">Transcript</h2>
          <pre className="whitespace-pre-wrap rounded border p-3 bg-gray-50 text-sm">
            {transcript}
          </pre>
        </section>
      )}

      {blogHtml && (
        <>
          <section className="w-full max-w-2xl space-y-2">
            <h2 className="text-xl font-semibold">
              Generated Blog Post (Editable)
            </h2>
            <Post
              content={blogHtml}
              onContentChange={(val) => setBlogHtml(val)}
            />
          </section>
          
          {/* Debug section - remove this once working */}
          <section className="w-full max-w-2xl space-y-2">
            <h2 className="text-xl font-semibold">Debug: HTML Preview</h2>
            <div 
              className="border p-3 bg-white prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blogHtml }}
            />
          </section>
        </>
      )}
    </div>
  );
}