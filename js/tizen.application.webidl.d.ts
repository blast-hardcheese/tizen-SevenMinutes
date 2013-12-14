  interface ApplicationId extends String {}
  interface ApplicationContextId extends String {}
interface ApplicationManagerObject {
    application: ApplicationManager;
}

  interface Tizen extends ApplicationManagerObject {}
interface ApplicationManager {
    getCurrentApplication(): Application;
    kill(contextId: ApplicationContextId, successCallback: SuccessCallback, errorCallback: ErrorCallback): void;
    launch(id: ApplicationId, successCallback: SuccessCallback, errorCallback: ErrorCallback): void;
    launchAppControl(appControl: ApplicationControl, id: ApplicationId, successCallback: SuccessCallback, errorCallback: ErrorCallback, replyCallback: ApplicationControlDataArrayReplyCallback): void;
    findAppControl(appControl: ApplicationControl, successCallback: FindAppControlSuccessCallback, errorCallback: ErrorCallback): void;
    getAppsContext(successCallback: ApplicationContextArraySuccessCallback, errorCallback: ErrorCallback): void;
    getAppContext(contextId: ApplicationContextId): ApplicationContext;
    getAppsInfo(successCallback: ApplicationInformationArraySuccessCallback, errorCallback: ErrorCallback): void;
    getAppInfo(id: ApplicationId): ApplicationInformation;
    getAppCerts(id: ApplicationId): ApplicationCertificate[];
    getAppSharedURI(id: ApplicationId): String;
    getAppMetaData(id: ApplicationId): ApplicationMetaData[];
    addAppInfoEventListener(eventCallback: ApplicationInformationEventCallback): Number;
    removeAppInfoEventListener(watchId: Number): void;
}

interface Application {
    appInfo: ApplicationInformation;
    contextId: ApplicationContextId;
    exit(): void;
    hide(): void;
    getRequestedAppControl(): RequestedApplicationControl;
}

interface ApplicationInformation {
    id: ApplicationId;
    name: String;
    iconPath: String;
    version: String;
    show: boolean;
    categories: String[];
    installDate: Date;
    size: Number;
    packageId: PackageId;
}

interface ApplicationContext {
    id: ApplicationContextId;
    appId: ApplicationId;
}

interface ApplicationControlData {
    key: String;
    value: String[];
}

interface ApplicationControl {
    operation: String;
    uri: String;
    mime: String;
    category: String;
    data: ApplicationControlData[];
}

interface RequestedApplicationControl {
    appControl: ApplicationControl;
    callerAppId: ApplicationId;
    replyResult(data: ApplicationControlData[]): void;
    replyFailure(): void;
}

interface ApplicationCertificate {
    type: String;
    value: String;
}

interface ApplicationMetaData {
    key: String;
    value: String;
}

interface ApplicationInformationArraySuccessCallback {
    onsuccess(informationArray: ApplicationInformation[]): void;
}

interface FindAppControlSuccessCallback {
    onsuccess(informationArray: ApplicationInformation[], appControl: ApplicationControl): void;
}

interface ApplicationContextArraySuccessCallback {
    onsuccess(contexts: ApplicationContext[]): void;
}

interface ApplicationControlDataArrayReplyCallback {
    onsuccess(data: ApplicationControlData[]): void;
    onfailure(): void;
}

interface ApplicationInformationEventCallback {
    oninstalled(info: ApplicationInformation): void;
    onupdated(info: ApplicationInformation): void;
    onuninstalled(id: ApplicationId): void;
}
