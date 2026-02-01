
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  
  // Hỗ trợ: watch?v=, v/, shorts/, embed/, youtu.be/, và các tham số khác
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?)|(shorts\/))([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  const id = (match && match[8].length === 11) ? match[8] : null;
  return id;
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = getYouTubeId(url);
  // Sử dụng hqdefault làm dự phòng nếu maxresdefault không tồn tại (thường gặp ở video cũ/shorts)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}
