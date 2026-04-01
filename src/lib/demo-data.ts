import {
  DEFAULT_DEMO_BUILD_ID,
  DEFAULT_DEMO_PROJECT_ID,
  DEFAULT_DEMO_WEBSITE_URL
} from "@/lib/constants";
import type { BuildJob, Project, UploadedAsset, User } from "@/lib/types";

export const demoUser: User = {
  id: "user_demo_owner",
  email: "demo@webtoapp.local",
  name: "Demo User"
};

export const demoProject: Project = {
  id: DEFAULT_DEMO_PROJECT_ID,
  userId: demoUser.id,
  appName: "Abdullah Demo App",
  packageName: "com.abdullah.demoapp",
  websiteUrl: DEFAULT_DEMO_WEBSITE_URL,
  iconUrl: "/uploads/demo-icon.svg",
  splashUrl: "/uploads/demo-splash.svg",
  versionName: "1.0.0",
  versionCode: 1,
  options: {
    themeColor: "#0F766E",
    showLoader: true,
    pullToRefresh: true,
    openExternalInBrowser: true,
    fileUploadSupport: true,
    orientation: "portrait",
    fullscreen: false
  },
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
};

export const demoBuild: BuildJob = {
  id: DEFAULT_DEMO_BUILD_ID,
  projectId: DEFAULT_DEMO_PROJECT_ID,
  status: "success",
  buildLog: [
    "Job accepted by backend API.",
    "Worker started build environment.",
    "Generating WebView wrapper template.",
    "Applying app metadata (name, package, icon, splash).",
    "Signing APK and packaging source archive.",
    "Build complete."
  ],
  apkUrl: "/downloads/abdullah-demo-app.apk",
  sourceZipUrl: "/downloads/abdullah-demo-app-source.zip",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString()
};

export const demoAssets: UploadedAsset[] = [
  {
    id: "asset_demo_icon",
    projectId: DEFAULT_DEMO_PROJECT_ID,
    type: "icon",
    fileUrl: "/uploads/demo-icon.svg"
  },
  {
    id: "asset_demo_splash",
    projectId: DEFAULT_DEMO_PROJECT_ID,
    type: "splash",
    fileUrl: "/uploads/demo-splash.svg"
  }
];
