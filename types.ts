export type ViewState = 'home' | 'report-finding' | 'report-looting' | 'success' | 'profile';

export interface Organization {
  id: string;
  name: string;
  selected: boolean;
}

export interface ReportData {
  image: File | null;
  imagePreview: string | null;
  description: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  organizations: Organization[];
  timestamp: number;
  type: 'finding' | 'looting';
}

export interface UserProfile {
  name: string;
  points: number;
  rank: string;
  history: ReportData[];
}
