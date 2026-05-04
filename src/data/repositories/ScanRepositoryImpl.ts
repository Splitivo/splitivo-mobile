import { ScanRepository } from "../../domain/repositories/ScanRepository";
import { ScanResult } from "../../domain/entities/scan";
import { MockScanDatasource } from "../datasources/mock/MockScanDatasource";
import { withRepoLogging } from "../utils/withRepoLogging";

const datasource = new MockScanDatasource();

class ScanRepositoryBase implements ScanRepository {
  async scanReceipt(
    imageBase64: string,
    currency: string,
  ): Promise<ScanResult> {
    return datasource.scanReceipt(imageBase64, currency);
  }
}

export const ScanRepositoryImpl = withRepoLogging(
  "ScanRepositoryImpl",
  new ScanRepositoryBase(),
);
