import { advanceBuildJob } from "@/lib/build-simulator";
import { DEFAULT_DEMO_PROJECT_ID } from "@/lib/constants";
import { demoAssets, demoBuild, demoProject, demoUser } from "@/lib/demo-data";
import type {
  BuildJob,
  DashboardProject,
  Project,
  ProjectInput,
  UploadedAsset,
  User
} from "@/lib/types";

const users: User[] = [{ ...demoUser }];
const projects: Project[] = [{ ...demoProject }];
const buildJobs: BuildJob[] = [{ ...demoBuild }];
const uploadedAssets: UploadedAsset[] = demoAssets.map((asset) => ({ ...asset }));

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function getProjectByIdInternal(projectId: string): Project | undefined {
  return projects.find((project) => project.id === projectId);
}

function syncBuildJob(job: BuildJob): BuildJob {
  if (!getProjectByIdInternal(job.projectId)) return job;
  return advanceBuildJob(job);
}

export function getDemoProjectId(): string {
  return DEFAULT_DEMO_PROJECT_ID;
}

export function listUsers(): User[] {
  return [...users];
}

export function listProjects(): Project[] {
  return projects.map((project) => ({ ...project }));
}

export function getProjectById(projectId: string): Project | undefined {
  const project = getProjectByIdInternal(projectId);
  if (!project) return undefined;
  return { ...project };
}

export function createProject(input: ProjectInput): Project {
  const project: Project = {
    id: createId("project"),
    userId: demoUser.id,
    appName: input.appName.trim(),
    packageName: input.packageName.trim(),
    websiteUrl: input.websiteUrl.trim(),
    iconUrl: input.iconFileName ? `/uploads/${input.iconFileName}` : undefined,
    splashUrl: input.splashFileName ? `/uploads/${input.splashFileName}` : undefined,
    versionName: input.versionName.trim(),
    versionCode: Number(input.versionCode),
    options: {
      themeColor: input.themeColor,
      showLoader: input.showLoader,
      pullToRefresh: input.pullToRefresh,
      openExternalInBrowser: input.openExternalInBrowser,
      fileUploadSupport: input.fileUploadSupport,
      orientation: input.orientation,
      fullscreen: input.fullscreen
    },
    createdAt: new Date().toISOString()
  };

  projects.unshift(project);

  if (input.iconFileName) {
    uploadedAssets.push({
      id: createId("asset"),
      projectId: project.id,
      type: "icon",
      fileUrl: project.iconUrl as string
    });
  }

  if (input.splashFileName) {
    uploadedAssets.push({
      id: createId("asset"),
      projectId: project.id,
      type: "splash",
      fileUrl: project.splashUrl as string
    });
  }

  return { ...project };
}

export function listBuildJobs(): BuildJob[] {
  return buildJobs.map((job) => ({ ...syncBuildJob(job) }));
}

export function listBuildJobsForProject(projectId: string): BuildJob[] {
  return buildJobs
    .filter((job) => job.projectId === projectId)
    .map((job) => ({ ...syncBuildJob(job) }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getBuildById(buildId: string): BuildJob | undefined {
  const job = buildJobs.find((item) => item.id === buildId);
  if (!job) return undefined;
  return { ...syncBuildJob(job) };
}

export function createBuildJob(projectId: string): BuildJob | undefined {
  const project = getProjectByIdInternal(projectId);
  if (!project) return undefined;

  const createdAt = new Date().toISOString();
  const job: BuildJob = {
    id: createId("build"),
    projectId: project.id,
    status: "queued",
    buildLog: ["Job accepted by backend API."],
    createdAt,
    updatedAt: createdAt
  };

  buildJobs.unshift(job);
  return { ...job };
}

export function getDashboardProjects(): DashboardProject[] {
  return projects.map((project) => {
    const latestBuild = listBuildJobsForProject(project.id)[0];
    return {
      project: { ...project },
      latestBuild
    };
  });
}

export function getProjectWithBuilds(projectId: string): {
  project?: Project;
  builds: BuildJob[];
} {
  const project = getProjectById(projectId);
  return {
    project,
    builds: project ? listBuildJobsForProject(project.id) : []
  };
}

export function listUploadedAssets(projectId: string): UploadedAsset[] {
  return uploadedAssets.filter((asset) => asset.projectId === projectId);
}
