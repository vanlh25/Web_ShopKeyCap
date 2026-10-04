import React, { useState, useEffect, useRef } from "react";
import type { OrderItemModel } from "../../../../features/order/models/order.model";
import type { AvailableReview } from "../../../../features/review";
import { useCloudMediaUpload } from "../../../../../../shared/features/cloudMedia/hooks/useCloudMediaUpload";

interface ReviewEditorProps {
    orderId: number;
    selectedItem?: OrderItemModel;
    existingReview?: AvailableReview;
    isSubmitting: boolean;
    onSubmitReview: (rating: number, content: string, imageUrls?: string[]) => void;
    onUpdateReview?: (reviewId: number, rating: number, content: string, imageUrls?: string[]) => void;
}

export const ReviewEditor: React.FC<ReviewEditorProps> = ({
    orderId,
    selectedItem,
    existingReview,
    isSubmitting,
    onSubmitReview,
    onUpdateReview
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [content, setContent] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [mediaError, setMediaError] = useState("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { upload, isUploading } = useCloudMediaUpload();

    const isVideoUrl = (url: string) => {
        return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
    };

    const resetToExisting = () => {
        if (existingReview) {
            setRating(existingReview.rating);
            setContent(existingReview.content);
            setImageUrls(existingReview.imageUrls || []);
        } else {
            setRating(5);
            setContent("");
            setImageUrls([]);
        }
        setError("");
        setMediaError("");
    };

    useEffect(() => {
        resetToExisting();
        setIsEditing(false);
    }, [selectedItem?.productId, existingReview]);

    if (!selectedItem) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center h-full min-h-100 text-slate-500">
                <span className="material-icons-outlined text-[48px] mb-4 text-slate-300">rate_review</span>
                <p>Vui lòng chọn sản phẩm để đánh giá</p>
            </div>
        );
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const selectedFiles: File[] = Array.from(e.target.files);

        if (imageUrls.length + selectedFiles.length > 5) {
            setMediaError("Tối đa 5 hình ảnh hoặc video đính kèm.");
            return;
        }

        setMediaError("");
        try {
            const uploadedMedias = await upload(selectedFiles);
            const newUrls = uploadedMedias.map((m) => m.url);
            setImageUrls((prev) => [...prev, ...newUrls]);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Tải media lên thất bại, vui lòng thử lại.";
            setMediaError(message);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveMedia = (indexToRemove: number) => {
        setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length < 10) {
            setError("Nội dung đánh giá phải có ít nhất 10 ký tự.");
            return;
        }
        if (content.trim().length > 1000) {
            setError("Nội dung đánh giá không được vượt quá 1000 ký tự.");
            return;
        }
        setError("");

        if (isEditing && existingReview?.id && onUpdateReview) {
            onUpdateReview(existingReview.id, rating, content, imageUrls);
            setIsEditing(false);
        } else {
            onSubmitReview(rating, content, imageUrls);
        }
    };

    const handleCancelEdit = () => {
        resetToExisting();
        setIsEditing(false);
    };

    const activeRating = hoverRating ?? rating;
    const canEdit = existingReview?.canEdit !== false;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 h-full flex flex-col shadow-xs overflow-hidden">
            {/* Product Header */}
            <div className="p-5 md:p-6 border-b border-slate-100 flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden shadow-2xs flex items-center justify-center p-1">
                    <img src={selectedItem.productImage} alt={selectedItem.productName} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug" title={selectedItem.productName}>
                        {selectedItem.productName}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium flex-wrap">
                        <span className="flex items-center gap-1">
                            <span className="material-icons-outlined text-[15px] text-slate-400">receipt_long</span>
                            Đơn hàng #{orderId}
                        </span>
                        {selectedItem.attributes && selectedItem.attributes.length > 0 && (
                            <span className="text-slate-400">
                                • {selectedItem.attributes.map(a => `${a.name}: ${a.value}`).join(' • ')}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-5 md:p-6 flex-1 flex flex-col">
                {existingReview && !isEditing ? (
                    /* VIEW MODE */
                    <div className="bg-slate-50/70 rounded-2xl p-5 md:p-6 border border-slate-200/80 flex flex-col h-full gap-5">
                        {/* Edit Window Notice */}
                        {canEdit ? (
                            <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/80 text-blue-900 rounded-xl text-xs font-medium border border-blue-100">
                                <span className="material-icons-outlined text-[18px] text-blue-600 shrink-0 mt-0.5">info</span>
                                <div className="leading-relaxed flex-1">
                                    Bạn có thể chỉnh sửa đánh giá trong vòng 30 ngày kể từ ngày đánh giá.
                                    <span className="text-blue-700 font-bold ml-1">(Còn lại: {existingReview.remainingDays ?? 30} ngày)</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2.5 p-3.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-medium border border-slate-200">
                                <span className="material-icons-outlined text-[18px] text-slate-500 shrink-0 mt-0.5">lock</span>
                                <div className="leading-relaxed flex-1">
                                    Đã hết thời hạn chỉnh sửa đánh giá (sau 30 ngày) hoặc đánh giá đã được khóa bởi quản trị viên.
                                </div>
                            </div>
                        )}

                        {/* Rating Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Đánh giá:</span>
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className="material-icons text-[22px]">
                                            {star <= existingReview.rating ? "star" : "star_border"}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0 whitespace-nowrap">
                                    {existingReview.rating === 5 && "5/5 - Tuyệt vời"}
                                    {existingReview.rating === 4 && "4/5 - Rất tốt"}
                                    {existingReview.rating === 3 && "3/5 - Bình thường"}
                                    {existingReview.rating === 2 && "2/5 - Không tốt"}
                                    {existingReview.rating === 1 && "1/5 - Rất tệ"}
                                </span>
                            </div>

                            <div className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                                <span className="material-icons-outlined text-[15px]">event</span>
                                <span>{new Date(existingReview.createdAt).toLocaleDateString("vi-VN")}</span>
                                {existingReview.updatedAt && existingReview.updatedAt !== existingReview.createdAt && (
                                    <span className="text-blue-600 font-semibold">(Đã chỉnh sửa)</span>
                                )}
                            </div>
                        </div>

                        {/* Content Display */}
                        <div className="flex flex-col gap-2 flex-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nội dung nhận xét:</span>
                            <div className="text-slate-800 bg-white p-4 rounded-xl border border-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-normal shadow-2xs">
                                {existingReview.content}
                            </div>
                        </div>

                        {/* Attached Images/Videos Display */}
                        {existingReview.imageUrls && existingReview.imageUrls.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <span className="material-icons-outlined text-[16px]">photo_library</span>
                                    Hình ảnh / Video đính kèm ({existingReview.imageUrls.length}):
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    {existingReview.imageUrls.map((url, idx) => (
                                        <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs group relative">
                                            {isVideoUrl(url) ? (
                                                <video src={url} className="w-full h-full object-cover" controls={false} />
                                            ) : (
                                                <img src={url} alt={`Review media ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Action */}
                        <div className="mt-auto pt-4 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-icons-outlined text-[15px] text-emerald-600">verified</span>
                                Đã mua hàng và xác thực từ KeyCapShop
                            </span>

                            {canEdit && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="shrink-0 whitespace-nowrap px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs hover:shadow-md flex items-center gap-2 cursor-pointer"
                                >
                                    <span className="material-icons-outlined text-[18px]">edit</span>
                                    <span>Chỉnh sửa đánh giá</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    /* EDIT / CREATE FORM */
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        {isEditing && (
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <span className="material-icons-outlined text-blue-600 text-[20px]">edit_note</span>
                                    Chỉnh sửa đánh giá của bạn
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                                >
                                    Hủy chỉnh sửa
                                </button>
                            </div>
                        )}

                        {/* Star Rating Picker */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-slate-900 mb-2">Chất lượng sản phẩm</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        onClick={() => setRating(star)}
                                        className={`transition-transform hover:scale-110 focus:outline-none ${
                                            star <= activeRating ? "text-amber-400" : "text-slate-200 hover:text-amber-200"
                                        }`}
                                    >
                                        <span className="material-icons text-[40px]">star</span>
                                    </button>
                                ))}
                            </div>
                            <div className="text-sm text-amber-600 mt-1 font-medium">
                                {activeRating === 5 && "Tuyệt vời!"}
                                {activeRating === 4 && "Rất tốt"}
                                {activeRating === 3 && "Bình thường"}
                                {activeRating === 2 && "Không tốt"}
                                {activeRating === 1 && "Rất tệ"}
                            </div>
                        </div>

                        {/* Review Content Textarea */}
                        <div className="mb-5 flex-1 flex flex-col">
                            <label htmlFor="content" className="block text-sm font-medium text-slate-900 mb-2">
                                Nội dung đánh giá
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Hãy chia sẻ những điều bạn thích hoặc chưa thích về sản phẩm này nhé (tối thiểu 10 ký tự)..."
                                className={`flex-1 min-h-32 w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none bg-slate-50 focus:bg-white transition-colors text-sm ${
                                    error ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-300"
                                }`}
                                minLength={10}
                                maxLength={1000}
                            />
                            {error && <p className="text-rose-500 text-sm mt-1.5 font-medium">{error}</p>}
                            <div className="text-right text-xs text-slate-400 mt-1.5">
                                {content.length}/1000 ký tự
                            </div>
                        </div>

                        {/* Image / Video Attachments */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-900 mb-2 flex items-center justify-between">
                                <span>Hình ảnh / Video thực tế</span>
                                <span className="text-xs text-slate-400 font-normal">Tối đa 5 file</span>
                            </label>

                            <div className="flex flex-wrap gap-3 items-center">
                                {imageUrls.map((url, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                                        {isVideoUrl(url) ? (
                                            <video src={url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={url} alt={`attachment-${idx}`} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedia(idx)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                                            title="Xóa tệp này"
                                        >
                                            <span className="material-icons text-[14px]">close</span>
                                        </button>
                                    </div>
                                ))}

                                {imageUrls.length < 5 && (
                                    <button
                                        type="button"
                                        disabled={isUploading}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? (
                                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-icons-outlined text-[24px]">add_photo_alternate</span>
                                                <span className="text-[10px] mt-1 font-medium">Thêm</span>
                                            </>
                                        )}
                                    </button>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {mediaError && <p className="text-rose-500 text-xs mt-1.5 font-medium">{mediaError}</p>}
                        </div>

                        {/* Submit / Cancel Buttons */}
                        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={isSubmitting || isUploading}
                                    className="shrink-0 whitespace-nowrap px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
                                >
                                    Hủy bỏ
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading || content.trim().length < 10}
                                className="shrink-0 whitespace-nowrap px-7 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang lưu...
                                    </>
                                ) : isEditing ? (
                                    <>
                                        <span className="material-icons-outlined text-[18px]">save</span>
                                        Lưu thay đổi
                                    </>
                                ) : (
                                    <>
                                        <span className="material-icons-outlined text-[18px]">send</span>
                                        Gửi đánh giá
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

