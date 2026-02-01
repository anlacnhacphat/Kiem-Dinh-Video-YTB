
export enum RiskLevel {
  LOW = 'THẤP',
  MEDIUM = 'TRUNG BÌNH',
  HIGH = 'CAO',
  CRITICAL = 'NGHIÊM TRỌNG'
}

export interface AuditCheck {
  item: string;
  passed: boolean;
  comment: string;
}

export interface AuditReport {
  monetizationScore: number;
  summary: string;
  reusedContentRisk: RiskLevel;
  aiVoiceRisk: RiskLevel;
  visualRepetitionRisk: RiskLevel;
  creativeValueScore: number;
  checklist: AuditCheck[];
  expertRecommendations: string[];
  groundingSources?: { title: string; uri: string }[];
  thumbnailUrl?: string;
  videoUrl?: string; // Lưu trữ link gốc để hiển thị Preview đồng nhất
}

export interface AppState {
  url: string;
  isLoading: boolean;
  report: AuditReport | null;
  error: string | null;
}
