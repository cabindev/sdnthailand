export interface AnnounceResult {
  id: string;
  procurementId: string;
  pdfFile: string;
  announcedDate: string;
}

export interface Procurement {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  coverImage?: string;
  pdfFile?: string;
  announceResult?: AnnounceResult;
}

export type ProcurementFormData = Omit<Procurement, 'id' | 'coverImage' | 'pdfFile' | 'announceResult'>;

export type AnnounceResultFormData = Omit<AnnounceResult, 'id' | 'announcedDate'>;