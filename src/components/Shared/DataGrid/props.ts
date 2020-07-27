import { IPaginationParams } from 'interfaces/pagination';
import { MdiReactIconComponentType } from 'mdi-react';

export interface IDataGridProps {
  params: IPaginationParams;
  loading: boolean;
  mergeParams: (newParams: Partial<IPaginationParams>) => void;
  handleRefresh: () => void;
  columns: { field: string; label: string }[];
  error: any;
  results: any[];
  refresh: () => void;
  total: number;
  actions?: { text: string; icon: MdiReactIconComponentType; handler: (obj: any) => void }[];
  handleDismissError?: () => void;
}
