
import React, { useState, useCallback, useMemo } from 'react';
import { performMonetizationAudit, generateSuggestedComment } from './services/geminiService';
import { AuditReport, AppState } from './types';
import AuditReportView from './components/AuditReportView';
import { getYouTubeThumbnail } from './utils/youtube';
import VideoPreview from './components/VideoPreview';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    url: '',
    isLoading: false,
    report: null,
    error: null,
  });

  const [isGeneratingComment, setIsGeneratingComment] = useState(false);
  const [suggestedComment, setSuggestedComment] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);

  const liveThumbnailUrl = useMemo(() => getYouTubeThumbnail(state.url), [state.url]);

  const handleAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!state.url.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, report: null }));
    setSuggestedComment(""); // Xóa bình luận cũ khi kiểm định mới

    try {
      const report = await performMonetizationAudit(state.url);
      
      const enrichedReport = {
        ...report,
        thumbnailUrl: liveThumbnailUrl || undefined,
        videoUrl: state.url 
      };

      setState(prev => ({ ...prev, isLoading: false, report: enrichedReport }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Không thể thực hiện kiểm định. Vui lòng thử lại sau hoặc kiểm tra lại link/nội dung." 
      }));
    }
  };

  const handleCreateComment = async () => {
    if (!state.url.trim()) return;
    setIsGeneratingComment(true);
    setSuggestedComment("");
    setState(prev => ({ ...prev, error: null }));

    try {
      const comment = await generateSuggestedComment(state.url);
      setSuggestedComment(comment);
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, error: "Không thể tạo bình luận lúc này. Vui lòng kiểm tra lại link video." }));
    } finally {
      setIsGeneratingComment(false);
    }
  };

  const handleCopy = () => {
    if (!suggestedComment) return;
    navigator.clipboard.writeText(suggestedComment);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleReset = useCallback(() => {
    setState({
      url: '',
      isLoading: false,
      report: null,
      error: null
    });
    setSuggestedComment("");
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black italic text-xl shadow-lg shadow-indigo-200">Y</div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-slate-900 leading-none">Tạ Thúc Tài<span className="text-indigo-600"></span></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chuyên Gia Kiểm Định</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-bold">Chuyên gia YouTube</span>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className={`max-w-5xl mx-auto px-6 transition-all duration-700 ${state.report || suggestedComment ? 'py-10' : 'py-16'}`}>
          
          {/* Hero Section */}
          {!state.report && !suggestedComment && (
            <div className="text-center animate-in fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Phân tích & Hỗ trợ AI thời gian thực
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Kiểm định <span className="text-transparent bg-clip-text bg-animate">Kiếm Tiền</span><br />
                & Soạn Bình Luận.
              </h1>
              
              <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                Xác minh chính sách YouTube hoặc tạo bình luận tâm huyết 100 chữ khen ngợi chủ kênh chỉ với một cú click.
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Search Form with 2 Buttons */}
            <div className="relative group mb-12">
              <form onSubmit={handleAudit} className="relative flex flex-col md:flex-row items-center p-3 rounded-[2.5rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-100 focus-within:ring-4 ring-indigo-500/20 transition-all duration-500 gap-3">
                <div className="pl-6 text-slate-400 hidden md:block">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                  type="text" 
                  value={state.url}
                  onChange={(e) => setState(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Dán link video YouTube..."
                  className="flex-grow bg-transparent px-4 py-4 md:py-5 text-lg md:text-xl outline-none text-slate-800 placeholder:text-slate-400 font-medium w-full"
                  disabled={state.isLoading || isGeneratingComment}
                />
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <button 
                    type="button"
                    onClick={handleCreateComment}
                    disabled={state.isLoading || isGeneratingComment || !state.url.trim()}
                    className="bg-emerald-50 text-emerald-600 px-6 py-4 md:py-5 rounded-[2rem] font-black text-sm uppercase tracking-wider hover:bg-emerald-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-emerald-100 whitespace-nowrap"
                  >
                    {isGeneratingComment ? (
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : '✨ Tạo Bình Luận'}
                  </button>
                  <button 
                    type="submit"
                    disabled={state.isLoading || isGeneratingComment || !state.url.trim()}
                    className="bg-indigo-600 text-white px-8 py-4 md:py-5 rounded-[2rem] font-black text-sm uppercase tracking-wider hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 whitespace-nowrap"
                  >
                    {state.isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : '🚀 Kiểm định'}
                  </button>
                </div>
              </form>
              
              {(state.report || suggestedComment) && (
                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={handleReset}
                    className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-colors"
                  >
                    Làm mới nội dung
                  </button>
                </div>
              )}

              {state.error && (
                <div className="mt-6 p-5 rounded-2xl bg-rose-50 text-rose-600 text-sm font-bold border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  {state.error}
                </div>
              )}
            </div>

            {/* Video Preview - Persistent Position */}
            {(state.url.length > 5 || state.isLoading || isGeneratingComment || state.report || suggestedComment) && (
              <div className="animate-in zoom-in slide-in-from-top-4 duration-500 mb-12 max-w-xl mx-auto">
                <VideoPreview 
                  url={state.url} 
                  thumbnailUrl={state.report?.thumbnailUrl || liveThumbnailUrl || undefined} 
                  isScanning={state.isLoading || isGeneratingComment} 
                />
              </div>
            )}
          </div>

          {/* Suggested Comment Result Area */}
          {suggestedComment && (
            <div className="max-w-3xl mx-auto mb-16 p-1 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 via-indigo-500 to-purple-600 shadow-2xl animate-in zoom-in duration-500">
              <div className="bg-white rounded-[2.4rem] p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-100 text-xl shadow-sm border border-emerald-200">✨</span> 
                    Bình luận khen ngợi tâm huyết
                  </h3>
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                      copySuccess ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95'
                    }`}
                  >
                    {copySuccess ? 'Đã sao chép!' : 'Sao chép ngay'}
                  </button>
                </div>
                <div className="relative bg-slate-50/80 p-8 rounded-3xl border border-slate-100 shadow-inner group">
                  <div className="absolute -left-3 -top-3 text-6xl text-emerald-200 font-serif opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">“</div>
                  <p className="text-slate-700 leading-relaxed font-bold text-lg md:text-xl whitespace-pre-wrap italic relative z-10 px-4">
                    {suggestedComment}
                  </p>
                  <div className="absolute -right-3 -bottom-3 text-6xl text-emerald-200 font-serif opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">”</div>
                </div>
                <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Nội dung đã được AI tối ưu hóa dựa trên thông tin thực tế từ video của chủ kênh
                </p>
              </div>
            </div>
          )}

          {/* Report Results or Features Section */}
          {state.report ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <AuditReportView report={state.report} onReset={handleReset} hidePreview={true} />
            </div>
          ) : (
            !state.isLoading && !isGeneratingComment && !suggestedComment && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in duration-1000">
                {[
                  { title: "Phát hiện Re-up", desc: "Xác định tỷ lệ nội dung gốc và khả năng bị quét chính sách.", icon: "🔍" },
                  { title: "Giọng AI & Phụ đề", desc: "Phân tích chất lượng âm thanh và mức độ đầu tư vào lồng tiếng.", icon: "🎙️" },
                  { title: "Tạo Bình Luận", desc: "Tự động soạn thảo lời khen tâm huyết ~100 chữ giúp tăng tương tác.", icon: "✍️" }
                ].map((feature, i) => (
                  <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 text-left group">
                    <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="font-black text-slate-800 text-xl mb-3 group-hover:text-indigo-600 transition tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 grayscale opacity-60">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black italic text-sm">Y</div>
            <span className="font-black text-lg tracking-tighter text-slate-900">Tạ Thúc Tài Chuyên Gia YouTube</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 • Hệ thống hỗ trợ sáng tạo nội dung & kiểm định chuyên sâu
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
