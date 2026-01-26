import React, { useCallback, useMemo } from "react"; // Removed useState
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, FileText, XCircle } from "lucide-react"; // Added XCircle for error
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utility

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (rejections: FileRejection[]) => void; // New prop for errors
  acceptMultiple?: boolean;
  accept?: string;
  maxSize?: number;
  variant?: 'dropzone' | 'button';
  buttonText?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

export function FileUpload({ 
  onFilesSelected, 
  onFilesRejected,
  acceptMultiple = false, 
  accept = ".pdf",
  maxSize = 20 * 1024 * 1024,
  variant = 'dropzone',
  buttonText = 'Select Files',
  className = '',
  title = 'Drag and drop PDF files here',
  subtitle = 'or click to select PDF files',
  disabled = false
}: FileUploadProps) {

  // 1. FIX: Handle both Accepted and Rejected files
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
    // Agar file size bada hai ya format galat hai, parent ko batao
    if (fileRejections.length > 0 && onFilesRejected) {
      onFilesRejected(fileRejections);
    }
  }, [onFilesSelected, onFilesRejected]);

  // 2. FIX: Additive logic for mixed types (PDF + Image support)
  const acceptObject = useMemo(() => {
    const mapping: Record<string, string[]> = {};
    const acceptString = accept.toLowerCase();

    if (acceptString.includes('image') || acceptString.match(/\.(jpg|jpeg|png|webp|gif)/)) {
      mapping['image/*'] = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    }
    if (acceptString.includes('.docx') || acceptString.includes('word')) {
      mapping['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx'];
      mapping['application/msword'] = ['.doc'];
    }
    if (acceptString.includes('.xlsx') || acceptString.includes('excel')) {
      mapping['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx'];
      mapping['application/vnd.ms-excel'] = ['.xls'];
    }
    if (acceptString.includes('.pdf')) {
      mapping['application/pdf'] = ['.pdf'];
    }

    // Default fallback
    return Object.keys(mapping).length > 0 ? mapping : { 'application/pdf': ['.pdf'] };
  }, [accept]);
  
  // 3. FIX: Use native state from hook
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragReject // New: Detects if user is dragging a WRONG file
  } = useDropzone({
    onDrop,
    accept: acceptObject,
    multiple: acceptMultiple,
    maxSize,
    disabled
  });

  const maxSizeMB = Math.round(maxSize / (1024 * 1024));

  if (variant === 'button') {
    return (
      <div className={className}>
        <input {...getInputProps()} />
        <Button
          {...getRootProps()}
          variant="outline"
          size="lg"
          className={cn("px-6", disabled && "opacity-50 cursor-not-allowed")}
          disabled={disabled}
        >
          <Upload className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
        // Base Colors
        "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
        // Active Drag (Blue)
        isDragActive && !isDragReject && "border-blue-500 bg-blue-50 dark:bg-blue-950",
        // Reject Drag (Red) - User dragging invalid file
        isDragReject && "border-red-500 bg-red-50 dark:bg-red-950",
        // Hover state (only if not disabled)
        !disabled && !isDragActive && "hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gray-100",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="mb-4">
        {isDragReject ? (
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        ) : isDragActive ? (
          <FileText className="h-12 w-12 text-blue-500 mx-auto animate-bounce" />
        ) : (
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
        )}
      </div>
      
      <h3 className={cn(
        "text-xl font-semibold mb-2",
        isDragReject ? "text-red-500" : "text-gray-700 dark:text-gray-300"
      )}>
        {isDragReject 
          ? "File type not supported" 
          : isDragActive 
            ? "Drop to upload" 
            : title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {isDragReject ? "Please select a valid file" : subtitle}
      </p>
      
      {/* 4. FIX: pointer-events-none to prevent button conflict */}
      <Button className="bg-blue-600 text-white hover:bg-blue-700 pointer-events-none">
        {buttonText}
      </Button>
      
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
        Max size: {maxSizeMB}MB
      </p>
    </div>
  );
}
