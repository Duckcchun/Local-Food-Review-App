import { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { validateImageFile, createPreviewUrl, compressImage, uploadImage } from '../../utils/imageUpload';

interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  isUploading: boolean;
  error?: string;
}

interface ImageUploaderProps {
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Called when the list of uploaded URLs changes */
  onImagesChange: (urls: string[]) => void;
  /** Initial images (already uploaded) */
  initialImages?: string[];
  /** User ID for storage path */
  userId?: string;
  /** Access token for authenticated uploads */
  accessToken?: string;
  /** If true, skip server upload and keep local preview URLs (for offline mode) */
  offlineMode?: boolean;
}

/**
 * Full-featured image uploader with:
 * - File picker with camera option on mobile
 * - Drag & drop support
 * - Client-side image compression & resize
 * - Upload progress with skeleton state
 * - Image preview grid with remove button
 * - Validation (type, size, count)
 */
export function ImageUploader({
  maxImages = 5,
  onImagesChange,
  initialImages = [],
  userId = 'anonymous',
  accessToken,
  offlineMode = false,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>(() =>
    initialImages.map((url, i) => ({
      id: `existing-${i}`,
      file: new File([], ''),
      previewUrl: url,
      uploadedUrl: url,
      isUploading: false,
    }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateParent = useCallback((updatedImages: ImageFile[]) => {
    const urls = updatedImages
      .map(img => img.uploadedUrl || img.previewUrl)
      .filter(Boolean);
    onImagesChange(urls);
  }, [onImagesChange]);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;

    if (fileArray.length > remainingSlots) {
      toast.error(`최대 ${maxImages}장까지 업로드 가능합니다`);
      return;
    }

    // Validate all files first
    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || '유효하지 않은 파일입니다');
        return;
      }
    }

    // Create preview entries
    const newImages: ImageFile[] = fileArray.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      previewUrl: createPreviewUrl(file),
      isUploading: true,
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);

    // Upload each file
    const finalImages = [...updatedImages];
    for (let i = images.length; i < finalImages.length; i++) {
      const img = finalImages[i];
      try {
        if (offlineMode) {
          // In offline mode, compress locally and keep the preview URL
          await compressImage(img.file);
          finalImages[i] = { ...img, isUploading: false, uploadedUrl: img.previewUrl };
        } else {
          const url = await uploadImage(img.file, userId, accessToken);
          finalImages[i] = { ...img, isUploading: false, uploadedUrl: url };
        }
      } catch (error: any) {
        console.warn('Upload failed, using local preview:', error);
        // Fallback to local preview URL on upload failure
        finalImages[i] = {
          ...img,
          isUploading: false,
          uploadedUrl: img.previewUrl,
          error: '업로드 실패 (로컬 저장됨)',
        };
      }
    }

    setImages([...finalImages]);
    updateParent(finalImages);

    const successCount = finalImages.filter(img => !img.isUploading).length - images.length;
    if (successCount > 0) {
      toast.success(`${successCount}장의 사진이 추가되었습니다`);
    }
  }, [images, maxImages, userId, accessToken, offlineMode, updateParent]);

  const handleRemoveImage = useCallback((id: string) => {
    const img = images.find(i => i.id === id);
    if (img?.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(img.previewUrl);
    }

    const updated = images.filter(i => i.id !== id);
    setImages(updated);
    updateParent(updated);
    toast.success("사진이 삭제되었습니다");
  }, [images, updateParent]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square group">
              {image.isUploading ? (
                // Upload skeleton
                <div className="w-full h-full rounded-[1rem] bg-gray-100 animate-pulse flex items-center justify-center">
                  <Loader2 size={24} className="text-[#6b8e6f] animate-spin" />
                </div>
              ) : (
                <>
                  <img
                    src={image.previewUrl}
                    alt="업로드된 이미지"
                    className="w-full h-full object-cover rounded-[1rem] border-2 border-[#d4c5a0]"
                  />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg 
                              hover:bg-red-50 border border-gray-200 transition-all
                              opacity-80 group-hover:opacity-100"
                    aria-label="이미지 삭제"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                  {/* Error indicator */}
                  {image.error && (
                    <div className="absolute bottom-1 left-1 right-1 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-0.5">
                      <span className="text-[10px] text-yellow-700">{image.error}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-[1rem] border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? 'border-[#6b8e6f] bg-[#f0f9f4] scale-[1.02]'
              : 'border-[#d4c5a0] hover:border-[#6b8e6f] hover:bg-[#f9f6ed]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="이미지 파일 선택"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-5 flex flex-col items-center gap-2"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0f9f4] flex items-center justify-center">
                <Camera size={20} className="text-[#6b8e6f]" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fff4e0] flex items-center justify-center">
                <ImageIcon size={20} className="text-[#f5a145]" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-[#2d3e2d]">
                {isDragging ? '여기에 놓으세요!' : '사진 추가하기'}
              </p>
              <p className="text-xs text-[#9ca89d] mt-1">
                {images.length}/{maxImages}장 • 터치하거나 파일을 드래그하세요
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Limit reached */}
      {!canAddMore && (
        <p className="text-xs text-center text-[#9ca89d]">
          최대 {maxImages}장까지 업로드 가능합니다
        </p>
      )}
    </div>
  );
}
