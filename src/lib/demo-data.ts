import {
  CURRENT_USER_ID,
  DEFAULT_DEMO_BUILD_ID,
  DEFAULT_DEMO_PROJECT_ID,
  DEFAULT_DEMO_WEBSITE_URL
} from "@/lib/constants";
import type { BuildJob, Project, UploadedAsset, User } from "@/lib/types";

export const demoUser: User = {
  id: CURRENT_USER_ID,
  email: "demo@webtoapp.local",
  name: "Demo User"
};

const communityUserOne: User = {
  id: "user_public_jane",
  email: "jane@public.example",
  name: "Jane Community"
};

const communityUserTwo: User = {
  id: "user_public_fahad",
  email: "fahad@public.example",
  name: "Fahad Studio"
};

export const seedUsers: User[] = [demoUser, communityUserOne, communityUserTwo];

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
  visibility: "public",
  isPermanent: true,
  downloadsCount: 138,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
};

const communityProjectOne: Project = {
  id: "project_public_store_01",
  userId: communityUserOne.id,
  appName: "Storefront Wrapper",
  packageName: "com.community.storefront",
  websiteUrl: "https://example.com/",
  iconUrl: "/uploads/demo-icon.svg",
  versionName: "1.2.4",
  versionCode: 12,
  options: {
    themeColor: "#155E75",
    showLoader: true,
    pullToRefresh: true,
    openExternalInBrowser: true,
    fileUploadSupport: false,
    orientation: "portrait",
    fullscreen: false
  },
  visibility: "public",
  isPermanent: true,
  downloadsCount: 91,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString()
};

const communityProjectTwo: Project = {
  id: "project_public_news_02",
  userId: communityUserTwo.id,
  appName: "News Feed App",
  packageName: "com.fahad.newsfeed",
  websiteUrl: "https://news.ycombinator.com/",
  iconUrl: "/uploads/demo-icon.svg",
  versionName: "2.0.0",
  versionCode: 21,
  options: {
    themeColor: "#0F766E",
    showLoader: false,
    pullToRefresh: true,
    openExternalInBrowser: true,
    fileUploadSupport: true,
    orientation: "auto",
    fullscreen: true
  },
  visibility: "public",
  isPermanent: true,
  downloadsCount: 57,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
};

export const seedProjects: Project[] = [
  demoProject,
  communityProjectOne,
  communityProjectTwo
];

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

const communityBuildOne: BuildJob = {
  id: "build_public_store_01",
  projectId: communityProjectOne.id,
  status: "success",
  buildLog: [
    "Job accepted by backend API.",
    "Worker started build environment.",
    "Applying icon and wrapper settings.",
    "Build complete."
  ],
  apkUrl: "/downloads/generated-app.apk",
  sourceZipUrl: "/downloads/generated-app-source.zip",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
};

const communityBuildTwo: BuildJob = {
  id: "build_public_news_02",
  projectId: communityProjectTwo.id,
  status: "success",
  buildLog: [
    "Job accepted by backend API.",
    "Worker started build environment.",
    "Generating final APK artifact.",
    "Build complete."
  ],
  apkUrl: "/downloads/generated-app.apk",
  sourceZipUrl: "/downloads/generated-app-source.zip",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString()
};

export const seedBuilds: BuildJob[] = [demoBuild, communityBuildOne, communityBuildTwo];

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

export const seedAssets: UploadedAsset[] = demoAssets;
