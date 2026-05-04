import { ScanRepository } from "../../domain/repositories/ScanRepository";
import { ScanResult } from "../../domain/entities/scan";
import { MockScanDatasource } from "../datasources/mock/MockScanDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

class ScanRepositoryBase implements ScanRepository {
  private readonly datasource = new MockScanDatasource();
  async scanReceipt(
    imageBase64: string,
    currency: string,
  ): Promise<ScanResult> {
    return this.datasource.scanReceipt(imageBase64, currency);
  }
}

export const ScanRepositoryImpl = withRepoLogging(
  "ScanRepositoryImpl",
  new ScanRepositoryBase(),
);
