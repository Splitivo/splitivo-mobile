import { ScanResult } from "../../../domain/entities/scan";
import scanResultData from "../../mocks/scan-result.json";
import { simulateDelay } from "../../utils/delay";

export class MockScanDatasource {
  async scanReceipt(
    _imageBase64: string,
    _currency: string,
  ): Promise<ScanResult> {
    await simulateDelay(800, 1500); // Simulate longer OCR processing
    return scanResultData as ScanResult;
  }
}
