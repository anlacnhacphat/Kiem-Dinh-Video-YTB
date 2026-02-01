
import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const percentage = (score / 10) * 100;
  const strokeDasharray = `${percentage}, 100`;
  
  let colorClass = "text-emerald-500";
  if (score < 4) colorClass = "text-rose-500";
  else if (score < 7) colorClass = "text-amber-500";

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
        <path
          className="text-slate-200 stroke-current"
          strokeWidth="3"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
          strokeWidth="3"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-5xl font-bold ${colorClass}`}>{score}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Score / 10</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
