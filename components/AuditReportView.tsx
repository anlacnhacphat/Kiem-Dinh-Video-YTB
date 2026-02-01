
import React from 'react';
import { AuditReport } from '../types';
import ScoreGauge from './ScoreGauge';
import RiskBadge from './RiskBadge';
import VideoPreview from './VideoPreview';

interface AuditReportViewProps {
  report: AuditReport;
  onReset: () => void;
}

const AuditReportView: React.FC<AuditReportViewProps> = ({ report, onReset }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        {/* Left column: Video Preview and Summary */}
        <div className="lg:col-span-7 space-y-8">
          {report.thumbnailUrl && <VideoPreview url={report.thumbnailUrl} />}
          
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Kết quả phân tích <span className="text-indigo-600">Monetization</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed bg-white p-6 rounded-3xl border border-slate-100 shadow-sm italic">
              "{report.summary}"
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {report.groundingSources?.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-medium hover:bg-indigo-100 transition border border-indigo-100 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Main Score */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 h-full min-h-[400px]">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Chỉ số kiếm tiền an toàn</h3>
          <ScoreGauge score={report.monetizationScore} />
          <div className="mt-8 text-center">
             <div className="text-sm font-semibold text-slate-500 mb-2">Giá trị sáng tạo</div>
             <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${report.creativeValueScore * 10}%` }}
                />
             </div>
             <div className="mt-2 text-indigo-600 font-bold">{report.creativeValueScore}/10</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <RiskBadge label="Rủi ro Nội dung lặp lại" level={report.reusedContentRisk} />
        <RiskBadge label="Rủi ro Giọng đọc AI" level={report.aiVoiceRisk} />
        <RiskBadge label="Rủi ro Hình ảnh lặp lại" level={report.visualRepetitionRisk} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checklist Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Chi Tiết Kiểm Định
          </h3>
          <div className="space-y-4">
            {report.checklist.map((check, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100 transition hover:bg-white hover:border-indigo-200 hover:shadow-md">
                <div className={`mt-1 p-1 rounded-full ${check.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {check.passed ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{check.item}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{check.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-indigo-950 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h3 className="text-xl font-bold mb-8 flex items-center relative z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 flex items-center justify-center mr-3 border border-indigo-800">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Chiến Lược Tối Ưu
          </h3>
          <ul className="space-y-6 relative z-10">
            {report.expertRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-900 flex items-center justify-center text-xs font-bold border border-indigo-700 text-indigo-300">
                  {idx + 1}
                </span>
                <p className="text-sm text-indigo-100/90 leading-relaxed font-medium">{rec}</p>
              </li>
            ))}
          </ul>
          
          <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative z-10">
            <h4 className="text-[10px] font-bold mb-3 uppercase tracking-[0.3em] text-indigo-400">Đánh giá chung</h4>
            <p className="text-xl font-medium text-white leading-snug">
              {report.monetizationScore >= 7 
                ? "Kênh của bạn đang đi đúng hướng. Hãy tập trung xây dựng cộng đồng để tối ưu doanh thu." 
                : report.monetizationScore >= 4 
                ? "Nội dung đang ở ngưỡng nguy hiểm. Cần thay đổi phong cách dựng video và kịch bản ngay." 
                : "Hệ thống khuyến nghị tạm dừng re-up và xây dựng nội dung gốc để tránh bị quét vĩnh viễn."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button 
          onClick={onReset}
          className="group px-10 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg flex items-center gap-3"
        >
          <svg className="w-5 h-5 group-hover:-rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Kiểm định link khác
        </button>
      </div>
    </div>
  );
};

export default AuditReportView;
