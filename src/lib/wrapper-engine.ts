import type { Project } from "@/lib/types";

export interface AndroidWrapperConfig {
  appName: string;
  packageName: string;
  websiteUrl: string;
  versionName: string;
  versionCode: number;
  options: Project["options"];
}

export function createAndroidWrapperConfig(project: Project): AndroidWrapperConfig {
  return {
    appName: project.appName,
    packageName: project.packageName,
    websiteUrl: project.websiteUrl,
    versionName: project.versionName,
    versionCode: project.versionCode,
    options: project.options
  };
}
