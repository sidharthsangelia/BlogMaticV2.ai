"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface ImageKitUploadProps {
  onUploadComplete: (url: string) => void;
}

const ImageKitUpload = ({ onUploadComplete }: ImageKitUploadProps) => {
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null | undefined>(null);
  const [audioFileUrl, setAudioFileUrl] = useState<string | null | undefined>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        // transformation: {
        //   post: [{ type: "transformation", value: "vc-none" }], // <-- no “tr:”
        // },

        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },

        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
      setFileUrl(uploadResponse.url);
      console.log("File URL:", uploadResponse.url);
      if (uploadResponse.url) {
        const audioUrl = uploadResponse.url.replace(
          /\/([^/]+)$/,
          "/tr:vc-none/$1"
        );
const url = uploadResponse.url 
        setAudioFileUrl(audioUrl);
        onUploadComplete(url);
      }
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg border p-4 shadow-sm">
      {/* file picker + button */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          className="flex-1 cursor-pointer rounded border px-2 py-1 text-sm"
        />
        <button
          onClick={handleUpload}
          className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
        >
          Upload
        </button>
      </div>

      {/* progress */}
      <progress
        value={progress}
        max={100}
        className="h-2 w-full overflow-hidden rounded bg-gray-200"
      />

      {/* URLs */}
      {fileUrl && (
        <div className="space-y-1 text-xs">
          <p>
            <span className="font-medium">Video URL:</span>{" "}
            <a href={fileUrl} target="_blank" className="underline">
              {fileUrl}
            </a>
          </p>
          <p>
            <span className="font-medium">Audio URL:</span>{" "}
            <a href={audioFileUrl!} target="_blank" className="underline">
              {audioFileUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageKitUpload;
