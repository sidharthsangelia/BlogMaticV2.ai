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
import EnhancedFormInputs from "@/components/EnhancedFormInput";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [blogHtml, setBlogHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    variation: 70,
    tone: "",
    audience: "",
  });

  const handleUploadComplete = async (ufsUrl: string) => {
    // Only store the URL, don't process yet
    setUploadedFileUrl(ufsUrl);
    setTranscript(null);
    setBlogHtml(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!uploadedFileUrl) {
      alert("Please upload a video first!");
      return;
    }

    // Get form data
    const formDataObj = new FormData(e.currentTarget);
    const variation = formDataObj.get("variation") || "70";
    const tone = formDataObj.get("tone") || "professional";
    const audience = formDataObj.get("audience") || "general";

    try {
      setLoading(true);
      setTranscript(null);
      setBlogHtml(null);

      // Step 1: Transcribe
      const text = await transcribeWithWhisper({
        url: uploadedFileUrl,
        language: "en",
      });
      setTranscript(text);

      // Step 2: Generate blog with form parameters
      const response = await generateBlogFromVideo(uploadedFileUrl, "en", {
        variation: Number(variation),
        tone: tone as string,
        audience: audience as string,
      });
      console.log(variation, tone, audience);
      console.log("Full response from server:", response);
      console.log("blogPostHtml type:", typeof response.blogPostHtml);

      const blogData = response.blogPostHtml;

      if (!blogData || typeof blogData !== "object") {
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

      {/* Step 1: Upload Video */}
      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold">Step 1: Upload Video</h2>
        <UploadButton
          endpoint="videoUploader"
          onClientUploadComplete={(files) => {
            const { ufsUrl } = files[0];
            handleUploadComplete(ufsUrl);
          }}
          onUploadError={(e) => alert(`ERROR! ${e.message}`)}
        />
        {uploadedFileUrl && (
          <p className="text-green-600 text-sm">
            ✓ Video uploaded successfully!
          </p>
        )}
      </div>

      {/* Step 2: Configure & Process */}
      {uploadedFileUrl && (
        <form
          onSubmit={handleFormSubmit}
          className="w-full max-w-2xl space-y-6"
        >
          <h2 className="text-xl font-semibold">Step 2: Configure Your Blog</h2>

          <EnhancedFormInputs />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing... ⏳" : "Generate Transcript & Blog"}
          </Button>
        </form>
      )}

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
