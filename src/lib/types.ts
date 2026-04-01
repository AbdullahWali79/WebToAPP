export type BuildStatus = "queued" | "processing" | "success" | "failed";
export type OrientationMode = "portrait" | "landscape" | "auto";
export type UploadedAssetType = "icon" | "splash";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ProjectOptions {
  themeColor: string;
  showLoader: boolean;
  pullToRefresh: boolean;
  openExternalInBrowser: boolean;
  fileUploadSupport: boolean;
  orientation: OrientationMode;
  fullscreen: boolean;
}

export interface Project {
  id: string;
  userId: string;
  appName: string;
  packageName: string;
  websiteUrl: string;
  iconUrl?: string;
  splashUrl?: string;
  versionName: string;
  versionCode: number;
  options: ProjectOptions;
  createdAt: string;
}

export interface BuildJob {
  id: string;
  projectId: string;
  status: BuildStatus;
  buildLog: string[];
  apkUrl?: string;
  sourceZipUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedAsset {
  id: string;
  projectId: string;
  type: UploadedAssetType;
  fileUrl: string;
}

export interface ProjectInput {
  websiteUrl: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  themeColor: string;
  showLoader: boolean;
  pullToRefresh: boolean;
  openExternalInBrowser: boolean;
  fileUploadSupport: boolean;
  orientation: OrientationMode;
  fullscreen: boolean;
  iconFileName?: string;
  iconMimeType?: string;
  splashFileName?: string;
  splashMimeType?: string;
}

export interface DashboardProject {
  project: Project;
  latestBuild?: BuildJob;
}
