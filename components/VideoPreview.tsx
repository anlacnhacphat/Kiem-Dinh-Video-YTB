
import React, { useState, useEffect } from 'react';
import { getYouTubeId } from '../utils/youtube';

interface VideoPreviewProps {
  url: string;
  thumbnailUrl?: string;
  isScanning?: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ url, thumbnailUrl, isScanning }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoId = getYouTubeId(url);

  useEffect(() => {
    setIsImageLoaded(false);
    setHasError(false);
  }, [url]);

  const resolvedThumbnail = thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

  // Kiểm tra xem input có phải là một URL không
  const isUrl = /^(http|https):\/\/[^ "]+$/.test(url.trim());
  // Chỉ báo lỗi nếu là URL nhưng không lấy được Video ID
  const isInvalidYTLink = isUrl && !videoId && !thumbnailUrl;

  // Nếu không phải URL và cũng không có videoId, không hiển thị gì cả (tránh gây nhiễu khi gõ text)
  if (!isUrl && !videoId && !isScanning) return null;

  return (
    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-slate-900 group transition-all duration-500">
      
      {/* Trạng thái Link không hợp lệ */}
      {(hasError || isInvalidYTLink) && !isScanning && (
        <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-slate-300 font-bold mb-1">Link không thể xem trước</h4>
          <p className="text-slate-500 text-sm">Hệ thống vẫn sẽ cố gắng phân tích nội dung văn bản bạn đã nhập.</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {!isImageLoaded && !hasError && !isInvalidYTLink && !isScanning && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
             <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Đang tải bản xem trước</span>
          </div>
        </div>
      )}

      {/* Ảnh Thumbnail */}
      {resolvedThumbnail && !isInvalidYTLink && (
        <img 
          src={resolvedThumbnail} 
          alt="Bản xem trước video" 
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-1000 ${
            isScanning ? 'scale-110 blur-sm opacity-50' : 'group-hover:scale-105'
          } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      
      {/* Hiệu ứng quét khi đang phân tích */}
      {isScanning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-[scan_2s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[4px] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-400/20 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <span className="text-indigo-200 text-[11px] font-black uppercase tracking-[0.5em] animate-pulse mt-8">Đang trích xuất dữ liệu...</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/10 transition-colors pointer-events-none"></div>
      
      {/* Footer Actions */}
      {!isInvalidYTLink && (isImageLoaded || isScanning) && (
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
          {isScanning ? (
            <div className="inline-block px-4 py-2 rounded-xl bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">
              Đang phân tích chính sách YouTube
            </div>
          ) : (
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/95 hover:bg-white backdrop-blur text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-xl transition-all active:scale-95 group/link ${
                isImageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } transition-all duration-700 delay-300`}
            >
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Xem video gốc
            </a>
          )}
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10%); }
          100% { transform: translateY(110%); }
        }
      `}</style>
    </div>
  );
};

export default VideoPreview;
