
import React, { useState, useCallback, useMemo } from 'react';
import { performMonetizationAudit } from './services/geminiService';
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

  const liveThumbnailUrl = useMemo(() => getYouTubeThumbnail(state.url), [state.url]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.url.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const report = await performMonetizationAudit(state.url);
      
      const enrichedReport = {
        ...report,
        thumbnailUrl: liveThumbnailUrl || undefined
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

  const handleReset = useCallback(() => {
    setState({
      url: '',
      isLoading: false,
      report: null,
      error: null
    });
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
        {!state.report ? (
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Phân tích AI thời gian thực
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Kiểm định <span className="text-transparent bg-clip-text bg-animate">Kiếm Tiền</span><br />
              Chuyên Sâu & Miễn Phí.
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Phát hiện "Nội dung được tái sử dụng", giọng đọc AI và thiếu giá trị sáng tạo chỉ trong vài giây.
            </p>

            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleAudit} className="relative group mb-12">
                <div className="relative flex items-center p-3 rounded-[2.5rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-slate-100 focus-within:ring-4 ring-indigo-500/20 transition-all duration-500">
                  <div className="pl-6 text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <input 
                    type="text" 
                    value={state.url}
                    onChange={(e) => setState(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="Dán link video YouTube..."
                    className="flex-grow bg-transparent px-4 py-5 text-xl outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                    disabled={state.isLoading}
                  />
                  <button 
                    type="submit"
                    disabled={state.isLoading || !state.url.trim()}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-3 shadow-xl shadow-indigo-200"
                  >
                    {state.isLoading ? 'Đang phân tích...' : 'Bắt đầu ngay'}
                  </button>
                </div>
                
                {state.error && (
                  <div className="mt-6 p-5 rounded-2xl bg-rose-50 text-rose-600 text-sm font-bold border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {state.error}
                  </div>
                )}
              </form>

              {/* Dynamic Video Card for immediate feedback */}
              {(state.url.length > 5 || state.isLoading) && (
                <div className="animate-in zoom-in slide-in-from-top-4 duration-500 mb-20 max-w-xl mx-auto">
                  <VideoPreview 
                    url={state.url} 
                    thumbnailUrl={liveThumbnailUrl || undefined} 
                    isScanning={state.isLoading} 
                  />
                  {!state.isLoading && liveThumbnailUrl && (
                    <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Nhấn "Bắt đầu ngay" để phân tích video này</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Phát hiện Nội dung được tái sử dụng", desc: "Thuật toán xác định tỷ lệ nội dung gốc so với nội dung lấy từ nguồn khác.", icon: "🔍" },
                { title: "Giọng đọc AI", desc: "Phân loại chất lượng lồng tiếng AI. Ưu tiên giọng có cảm xúc thật.", icon: "🎙️" },
                { title: "Audit Hình ảnh", desc: "Phát hiện ảnh tĩnh lặp lại gây nhàm chán và vi phạm chính sách.", icon: "🖼️" }
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
          </div>
        ) : (
          <AuditReportView report={state.report} onReset={handleReset} />
        )}
      </main>

      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 grayscale opacity-60">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black italic text-sm">Y</div>
            <span className="font-black text-lg tracking-tighter text-slate-900">Tạ Thúc Tài Chuyên Gia Kiểm Định</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            © 2026 • Hệ thống kiểm định chính sách chuyên dụng cho YouTube
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
