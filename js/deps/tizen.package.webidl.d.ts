interface PackageId extends String {}
interface PackageManagerObject {
  package: PackageManager;
}

interface Tizen extends PackageManagerObject {}
interface PackageManager {
  install(path: String, progressCallback: PackageProgressCallback, errorCallback: ErrorCallback): void;
  uninstall(id: PackageId, progressCallback: PackageProgressCallback, errorCallback: ErrorCallback): void;
  getPackagesInfo(successCallback: PackageInformationArraySuccessCallback, errorCallback: ErrorCallback): void;
  getPackageInfo(id: PackageId): PackageInformation;
  setPackageInfoEventListener(eventCallback: PackageInformationEventCallback): void;
  unsetPackageInfoEventListener(): void;
}

interface PackageInformation {
  id: PackageId;
  name: String;
  iconPath: String;
  version: String;
  totalSize: Number;
  dataSize: Number;
  lastModified: Date;
  author: String;
  description: String;
  appIds: ApplicationId[];
}

interface PackageInformationArraySuccessCallback {
  onsuccess(informationArray: PackageInformation[]): void;
}

interface PackageProgressCallback {
  onprogress(id: PackageId, progress: Number): void;
  oncomplete(id: PackageId): void;
}

interface PackageInformationEventCallback {
  oninstalled(info: PackageInformation): void;
  onupdated(info: PackageInformation): void;
  onuninstalled(id: PackageId): void;
}
