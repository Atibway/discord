"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: keyof typeof ourFileRouter;
}

const getFileTypeSuffix = (url: string | null) => {
  if (!url) return '';
  if (url.endsWith("/image")) return "/image";
  if (url.endsWith("/pdf")) return "/pdf";
  return '';
};

export const FileUpload = ({
  onChange,
  endpoint,
  value,
}: FileUploadProps) => {

  const filetype = getFileTypeSuffix(value);

  if (value && filetype === "/image") {
    return (
      <div className="relative w-20 h-20">
        <Image
          src={value.replace("/image", "")}
          alt="uploaded file"
          fill
          className="rounded-full"
        />
        <button
          onClick={() => onChange("")}
          className="bg-red-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && filetype === "/pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

        <a
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          href={value.replace("/pdf", "")}
          title={value}
          style={{
            display: "block",
            maxWidth: "200px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value.replace("/pdf", "")}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white rounded-full p-1 absolute -top-2 -right-2 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res.length > 0) {
          const uploadedFile = res[0];
          const typeSuffix = uploadedFile.type.includes('pdf') ? '/pdf' : (uploadedFile.type.startsWith('image/') ? '/image' : '');
          const renamedUrl = `${uploadedFile.url}${typeSuffix}`;
          onChange(renamedUrl);
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
      onBeforeUploadBegin={(files) => {
        return files.map((file) => {
          const extension = file.name.split(".").pop();
          const newName = `renamed-${Date.now()}.${extension}`;
          return new File([file], newName, { type: file.type });
        });
      }}
      onUploadProgress={(res) => {
        // Optional: Handle upload progress if needed
      }}
    />
  );
};
