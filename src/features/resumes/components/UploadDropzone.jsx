import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { useUploadResume } from "../hooks/useUploadResume";
import toast from "react-hot-toast";
import { cn } from "../../../lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { mutate: uploadResume, isPending, progress } = useUploadResume();

  const validateAndUpload = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Only PDF and DOCX are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    uploadResume(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    validateAndUpload(file);
    // Reset input so same file can be selected again if it failed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        "relative flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors sm:min-h-[220px] sm:p-12",
        isDragging
          ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-900/20"
          : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-900",
        isPending && "pointer-events-none opacity-60"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isPending && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.docx"
        className="hidden"
      />
      
      <div className="flex cursor-pointer flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-zinc-200/50 p-4 dark:bg-zinc-800/50">
          <UploadCloud className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            <span className="text-indigo-600 dark:text-indigo-400">Click to upload</span>{" "}
            <span className="hidden sm:inline">or drag and drop</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            PDF or DOCX (max. 5MB)
          </p>
        </div>
      </div>

      {isPending && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80">
          <div className="w-full max-w-64 space-y-2 px-4 text-center">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Uploading... {progress}%
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300 ease-out dark:bg-indigo-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
