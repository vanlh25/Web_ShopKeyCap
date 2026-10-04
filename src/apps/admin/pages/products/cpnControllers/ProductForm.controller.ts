import { useState, useRef } from "react";
import { useCloudMediaUpload } from "../../../../../shared/features/cloudMedia/hooks/useCloudMediaUpload";
import { useToastStore } from "../../../../../core/store/useToastStore";

export const useProductFormController = () => {
    const toast = useToastStore(state => state.addToast);
    const cloudMediaUpload = useCloudMediaUpload();
    const [isUploading, setIsUploading] = useState(false);
    const urlToFileNameRef = useRef<Map<string, string>>(new Map());

    const getFileNameFromUrl = (url: string): string => {
        if (!url) return "";
        if (urlToFileNameRef.current.has(url)) {
            return urlToFileNameRef.current.get(url)!;
        }
        try {
            const parsed = new URL(url);
            const lastSegment = parsed.pathname.substring(parsed.pathname.lastIndexOf("/") + 1);
            return decodeURIComponent(lastSegment);
        } catch {
            const clean = url.split("?")[0].split("#")[0];
            const lastSegment = clean.substring(clean.lastIndexOf("/") + 1);
            return decodeURIComponent(lastSegment);
        }
    };

    const handleUploadImage = async (files: FileList | null, setValue: (field: string, value: any) => void) => {
        if (!files || files.length === 0) return;
        
        setIsUploading(true);
        try {
            const result = await cloudMediaUpload.upload(Array.from(files));
            if (result && result.length > 0) {
                setValue('imageUrl', result[0].url);
                toast("Tải ảnh đại diện thành công", "success");
            }
        } catch (error: any) {
            console.error("Upload failed", error);
            const msg = error?.message || "Lỗi tải ảnh lên";
            toast(msg, "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadGallery = async (files: FileList | null, setValue: (field: string, value: any) => void, currentGallery: string[] = []) => {
        if (!files || files.length === 0) return;

        const selectedFiles = Array.from(files);

        // 1. Kiểm tra trùng lặp tên file trong danh sách vừa chọn
        const batchNameMap = new Map<string, number>();
        const duplicatesInBatch: string[] = [];

        for (const file of selectedFiles) {
            const cleanName = file.name.trim();
            const lowerName = cleanName.toLowerCase();
            const count = (batchNameMap.get(lowerName) || 0) + 1;
            batchNameMap.set(lowerName, count);
            if (count === 2) {
                duplicatesInBatch.push(cleanName);
            }
        }

        if (duplicatesInBatch.length > 0) {
            toast(
                `Phát hiện tệp tin trùng tên trong danh sách vừa chọn: ${duplicatesInBatch.join(", ")}. Vui lòng kiểm tra lại!`,
                "error"
            );
            return;
        }

        // 2. Kiểm tra trùng lặp tên file với các ảnh đã có trong thư viện Gallery
        const existingNamesMap = new Map<string, string>();
        for (const url of currentGallery) {
            const fn = getFileNameFromUrl(url);
            if (fn) {
                existingNamesMap.set(fn.toLowerCase(), fn);
            }
        }

        const duplicatesWithExisting: string[] = [];
        for (const file of selectedFiles) {
            const cleanName = file.name.trim();
            if (existingNamesMap.has(cleanName.toLowerCase())) {
                duplicatesWithExisting.push(cleanName);
            }
        }

        if (duplicatesWithExisting.length > 0) {
            const uniqueDupes = Array.from(new Set(duplicatesWithExisting));
            toast(
                `Ảnh sau đã tồn tại trong thư viện ảnh sản phẩm: ${uniqueDupes.join(", ")}. Không thể tải lên ảnh trùng lặp!`,
                "error"
            );
            return;
        }

        setIsUploading(true);
        try {
            const result = await cloudMediaUpload.upload(selectedFiles);
            if (result && result.length > 0) {
                // Lưu lại tên file gốc tương ứng với URL để kiểm tra cho các lần tải sau
                result.forEach((res, index) => {
                    if (selectedFiles[index]) {
                        urlToFileNameRef.current.set(res.url, selectedFiles[index].name.trim());
                    }
                });

                const newUrls = result.map(res => res.url);
                setValue('thumbnailUrl', [...currentGallery, ...newUrls]);
                toast(`Tải lên thành công ${result.length} ảnh`, "success");
            }
        } catch (error: any) {
            console.error("Upload gallery failed", error);
            const msg = error?.message || "Lỗi tải ảnh Gallery";
            toast(msg, "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveGalleryImage = (index: number, setValue: (field: string, value: any) => void, currentGallery: string[]) => {
        const removedUrl = currentGallery[index];
        if (removedUrl) {
            urlToFileNameRef.current.delete(removedUrl);
        }
        const newGallery = [...currentGallery];
        newGallery.splice(index, 1);
        setValue('thumbnailUrl', newGallery);
    };

    return {
        isUploading,
        handleUploadImage,
        handleUploadGallery,
        handleRemoveGalleryImage
    };
};
