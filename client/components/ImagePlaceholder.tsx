import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  onUpload?: () => void;
  isLoading?: boolean;
  className?: string;
  showUploadButton?: boolean;
}

export default function ImagePlaceholder({
  onUpload,
  isLoading = false,
  className = "",
  showUploadButton = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative w-full flex items-center justify-center rounded-xl overflow-hidden",
        "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
        "border border-slate-700/50",
        className
      )}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse mb-3">
            <ImageIcon size={40} className="text-slate-500" />
          </div>
          <p className="text-xs text-slate-400">Loading image...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <ImageIcon size={40} className="text-slate-600 mb-3" />
          <p className="text-sm font-medium text-slate-300 mb-1">No photo added</p>
          {showUploadButton && onUpload && (
            <button
              onClick={onUpload}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-2 transition-colors underline"
            >
              Upload photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
