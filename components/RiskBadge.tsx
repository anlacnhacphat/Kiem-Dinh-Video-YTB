
import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  label: string;
  level: RiskLevel;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ label, level }) => {
  const getColors = () => {
    switch (level) {
      case RiskLevel.LOW: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      case RiskLevel.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case RiskLevel.CRITICAL: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border bg-white shadow-sm">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getColors()}`}>
        {level}
      </span>
    </div>
  );
};

export default RiskBadge;
