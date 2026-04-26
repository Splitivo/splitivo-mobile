import { ScanRepository } from "../../domain/repositories/ScanRepository";
import { ScanResult } from "../../domain/entities/scan";
import { MockScanDatasource } from "../datasources/mock/MockScanDatasource";

const datasource = new MockScanDatasource();

export class ScanRepositoryImpl implements ScanRepository {
  async scanReceipt(
    imageBase64: string,
    currency: string,
  ): Promise<ScanResult> {
    return datasource.scanReceipt(imageBase64, currency);
  }
}
