
import React from 'react';
import { AuditReport } from '../types';
import ScoreGauge from './ScoreGauge';
import RiskBadge from './RiskBadge';
import VideoPreview from './VideoPreview';

interface AuditReportViewProps {
  report: AuditReport;
  onReset: () => void;
  hidePreview?: boolean;
}

const AuditReportView: React.FC<AuditReportViewProps> = ({ report, onReset, hidePreview = false }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Conditional Video Preview Column */}
        {!hidePreview && report.videoUrl && (
          <div className="lg:col-span-7">
            <div className="shadow-2xl rounded-[2.5rem] overflow-hidden">
               <VideoPreview url={report.videoUrl} thumbnailUrl={report.thumbnailUrl} />
            </div>
          </div>
        )}
        
        {/* Results Overview Column */}
        <div className={hidePreview ? "lg:col-span-7" : "lg:col-span-5"}>
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              Kết quả phân tích <span className="text-indigo-600">Monetization</span>
            </h2>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Tóm tắt chuyên gia</h4>
              <p className="text-lg text-slate-700 leading-relaxed italic font-medium">
                "{report.summary}"
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {report.groundingSources?.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-100 transition border border-indigo-100 flex items-center gap-1 shadow-sm"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Score Column */}
        <div className={hidePreview ? "lg:col-span-5" : "lg:col-span-7"}>
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 h-full min-h-[400px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Chỉ số kiếm tiền an toàn</h3>
            <ScoreGauge score={report.monetizationScore} />
            <div className="mt-8 text-center w-full max-w-xs">
               <div className="flex justify-between text-sm font-bold text-slate-500 mb-2 uppercase tracking-tighter">
                 <span>Giá trị sáng tạo</span>
                 <span>{report.creativeValueScore}/10</span>
               </div>
               <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${report.creativeValueScore * 10}%` }}
                  />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <RiskBadge label="Rủi ro Nội dung lặp lại" level={report.reusedContentRisk} />
        <RiskBadge label="Rủi ro Giọng đọc AI" level={report.aiVoiceRisk} />
        <RiskBadge label="Rủi ro Hình ảnh lặp lại" level={report.visualRepetitionRisk} />
      </div>

      {/* Details and Strategy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Audit Checklist */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mr-4 border border-indigo-100">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Chi Tiết Kiểm Định
          </h3>
          <div className="space-y-4">
            {report.checklist.map((check, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 transition hover:bg-white hover:border-indigo-200 hover:shadow-lg">
                <div className={`mt-1 p-1.5 rounded-full shadow-sm ${check.passed ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-rose-100 text-rose-600 border border-rose-200'}`}>
                  {check.passed ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-base">{check.item}</h4>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">{check.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Strategy Recommendations */}
        <div className="bg-indigo-950 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
          <h3 className="text-2xl font-black mb-10 flex items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900/50 flex items-center justify-center mr-4 border border-indigo-800">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Chiến Lược Tối Ưu
          </h3>
          <ul className="space-y-8 relative z-10 flex-grow">
            {report.expertRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-5">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-900 flex items-center justify-center text-sm font-black border border-indigo-700 text-emerald-400 shadow-inner">
                  {idx + 1}
                </span>
                <p className="text-base text-indigo-50/90 leading-relaxed font-medium">{rec}</p>
              </li>
            ))}
          </ul>
          
          <div className="mt-12 p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative z-10 shadow-2xl">
            <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.4em] text-indigo-400">Kết luận chuyên môn</h4>
            <p className="text-2xl font-black text-white leading-tight">
              {report.monetizationScore >= 7 
                ? "Kênh của bạn đang ở vị thế RẤT TỐT. Tiếp tục phát huy bản sắc riêng." 
                : report.monetizationScore >= 4 
                ? "CẦN THẬN TRỌNG. Các chỉ số đang ở mức ranh giới của chính sách YouTube." 
                : "CẢNH BÁO CAO. Nội dung có nguy cơ bị gậy hoặc tắt kiếm tiền hàng loạt."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReportView;
