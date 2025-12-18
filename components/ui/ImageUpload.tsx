"use client";

import { UploadButton } from "@uploadthing/react";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploadProps {
  value?: string[]; // current uploaded image URLs
  onChange: (urls: string[]) => void;
  maxImages?: number; // optional max limit
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value = [], onChange, maxImages = 5 }) => {
  const canUploadMore = value.length < maxImages;

  return (
    <div>
      <UploadButton<typeof ourFileRouter, "carImage">
        endpoint="carImage"
        disabled={!canUploadMore}
        onClientUploadComplete={(res) => {
          const urls = res.map((file) => file.ufsUrl);
          onChange([...value, ...urls]);
        }}
        onUploadError={(err) => {
          console.error("Upload failed:", err.message);
        }}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((url, i) => (
          <img key={i} src={url} alt={`Uploaded ${i}`} className="w-24 h-24 object-cover rounded" />
        ))}
      </div>
    </div>
  );
};
