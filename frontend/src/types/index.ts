export interface Transaction {
  date: string;
  description: string;
  amount: number;
  status: string;
}

export interface Metadata {
  period?: string;
  account_holder?: string;
}

export interface ProcessedResult {
  page: number;
  transactions: Transaction[];
  metadata: Metadata;
} 