"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EnhancedFormInputs from "@/components/EnhancedFormInput";

interface BlogConfigFormProps {
  onSubmit: (config: {
    variation: number;
    tone: string;
    audience: string;
  }) => void;
  loading?: boolean;
}

export default function BlogConfigForm({ onSubmit, loading }: BlogConfigFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const config = {
      variation: Number(formData.get("variation") || "70"),
      tone: formData.get("tone") as string || "professional",
      audience: formData.get("audience") as string || "general",
    };
    
    onSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold">Step 2: Configure Your Blog</h2>
      
      <EnhancedFormInputs />
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Processing... ⏳" : "Generate Blog Post"}
      </Button>
    </form>
  );
}