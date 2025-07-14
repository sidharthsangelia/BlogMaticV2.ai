"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";

interface VideoUploadFormProps {
  onUploadComplete: (url: string) => void;
}

export default function VideoUploadForm({ onUploadComplete }: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">Step 1: Upload Video</h2>
      
      <UploadButton
        endpoint="videoUploader"
        onClientUploadComplete={(files) => {
          const { ufsUrl } = files[0];
          setUploadedUrl(ufsUrl);
          onUploadComplete(ufsUrl);
          setIsUploading(false);
        }}
        onUploadError={(e) => {
          alert(`ERROR! ${e.message}`);
          setIsUploading(false);
        }}
        onUploadBegin={() => setIsUploading(true)}
      />
      
      {isUploading && (
        <p className="text-blue-600 text-sm">📤 Uploading video...</p>
      )}
      
      {uploadedUrl && (
        <p className="text-green-600 text-sm">✓ Video uploaded successfully!</p>
      )}
    </div>
  );
}