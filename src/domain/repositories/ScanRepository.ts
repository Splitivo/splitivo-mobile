import { ScanResult } from "../entities/scan";

export interface ScanRepository {
  scanReceipt(imageBase64: string, currency: string): Promise<ScanResult>;
}
