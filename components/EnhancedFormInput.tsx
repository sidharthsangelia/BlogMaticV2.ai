import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getFormData } from '@/actions/getFormData';

export default function EnhancedFormInputs() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Content Variation */}

      <form action={getFormData}>
      <div className="space-y-3">
        <Label htmlFor="variation" className="text-sm font-medium">
          Content Variation
        </Label>
        <Slider
          id="variation"
          name="variation"
          defaultValue={[70]}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Stay close to transcript</span>
          <span>Maximum exploration</span>
        </div>
      </div>

      {/* Writing Tone */}
      <div className="space-y-3">
        <Label htmlFor="tone" className="text-sm font-medium">
          Writing Tone
        </Label>
        <Select name="tone">
          <SelectTrigger>
            <SelectValue placeholder="Select tone style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friendly">Friendly & Conversational</SelectItem>
            <SelectItem value="professional">Professional & Formal</SelectItem>
            <SelectItem value="informative">Educational & Informative</SelectItem>
            <SelectItem value="sophisticated">Sophisticated & Elegant</SelectItem>
            <SelectItem value="persuasive">Persuasive & Engaging</SelectItem>
            <SelectItem value="technical">Technical & Detailed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target Audience */}
      <div className="space-y-3">
        <Label htmlFor="audience" className="text-sm font-medium">
          Target Audience
        </Label>
        <Select name="audience">
          <SelectTrigger>
            <SelectValue placeholder="Choose your audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Public</SelectItem>
            <SelectItem value="students">Students & Beginners</SelectItem>
            <SelectItem value="professionals">Industry Professionals</SelectItem>
            <SelectItem value="executives">Business Executives</SelectItem>
            <SelectItem value="technical">Technical Experts</SelectItem>
            <SelectItem value="academics">Academics & Researchers</SelectItem>
          </SelectContent>
        </Select>
      </div></form>
    </div>
    
  );
}