export interface ScanResult {
  merchantName: string;
  date: string;
  items: ScanItem[];
  tax: number;
  serviceCharge: number;
  total: number;
  currency: string;
}

export interface ScanItem {
  name: string;
  quantity: number;
  unitPrice: number;
}
