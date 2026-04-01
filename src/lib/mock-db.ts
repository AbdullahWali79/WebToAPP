import { advanceBuildJob } from "@/lib/build-simulator";
import { CURRENT_USER_ID, DEFAULT_DEMO_PROJECT_ID } from "@/lib/constants";
import { seedAssets, seedBuilds, seedProjects, seedUsers } from "@/lib/demo-data";
import type {
  BuildJob,
  DashboardProject,
  GlobalStats,
  Project,
  ProjectInput,
  ProjectVisibility,
  ShowcaseProject,
  UploadedAsset,
  User
} from "@/lib/types";

const users: User[] = seedUsers.map((user) => ({ ...user }));
const projects: Project[] = seedProjects.map((project) => ({ ...project }));
const buildJobs: BuildJob[] = seedBuilds.map((build) => ({
  ...build,
  buildLog: [...build.buildLog]
}));
const uploadedAssets: UploadedAsset[] = seedAssets.map((asset) => ({ ...asset }));

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function projectExists(projectId: string): boolean {
  return projects.some((project) => project.id === projectId);
}

function getProjectByIdInternal(projectId: string): Project | undefined {
  return projects.find((project) => project.id === projectId);
}

function getUserByIdInternal(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

function getBuildByIdInternal(buildId: string): BuildJob | undefined {
  return buildJobs.find((build) => build.id === buildId);
}

function syncBuildJob(job: BuildJob): BuildJob {
  if (!projectExists(job.projectId)) return job;
  return advanceBuildJob(job);
}

function cloneBuild(build: BuildJob): BuildJob {
  return { ...build, buildLog: [...build.buildLog] };
}

function latestBuildForProject(projectId: string): BuildJob | undefined {
  const latest = buildJobs
    .filter((build) => build.projectId === projectId)
    .map((build) => syncBuildJob(build))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  return latest ? cloneBuild(latest) : undefined;
}

function cloneProject(project: Project): Project {
  return { ...project, options: { ...project.options } };
}

function uniqueClonePackageName(sourcePackageName: string): string {
  const suffix = `clone${Math.floor(Math.random() * 900 + 100)}`;
  return `${sourcePackageName}.${suffix}`;
}

function includeProjectByViewer(project: Project, viewerUserId: string): boolean {
  return project.userId === viewerUserId || project.visibility === "public";
}

export function getDemoProjectId(): string {
  return DEFAULT_DEMO_PROJECT_ID;
}

export function getCurrentUser(): User {
  return getUserByIdInternal(CURRENT_USER_ID) || users[0];
}

export function listUsers(): User[] {
  return users.map((user) => ({ ...user }));
}

export function listProjects(): Project[] {
  return projects.map((project) => cloneProject(project));
}

export function getProjectById(projectId: string): Project | undefined {
  const project = getProjectByIdInternal(projectId);
  return project ? cloneProject(project) : undefined;
}

export function createProject(input: ProjectInput, userId: string): Project {
  const now = new Date().toISOString();
  const project: Project = {
    id: createId("project"),
    userId,
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
    visibility: input.visibility || "private",
    isPermanent: false,
    downloadsCount: 0,
    createdAt: now,
    updatedAt: now
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

  return cloneProject(project);
}

export function listBuildJobs(): BuildJob[] {
  return buildJobs.map((job) => cloneBuild(syncBuildJob(job)));
}

export function listBuildJobsForProject(projectId: string): BuildJob[] {
  return buildJobs
    .filter((job) => job.projectId === projectId)
    .map((job) => cloneBuild(syncBuildJob(job)))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getBuildById(buildId: string): BuildJob | undefined {
  const job = getBuildByIdInternal(buildId);
  return job ? cloneBuild(syncBuildJob(job)) : undefined;
}

export function createBuildJob(
  projectId: string,
  userId: string
): { build?: BuildJob; error?: string } {
  const project = getProjectByIdInternal(projectId);
  if (!project) return { error: "Project not found for this build request." };
  if (project.userId !== userId) {
    return { error: "You can only queue builds for your own projects." };
  }

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
  project.updatedAt = createdAt;
  return { build: cloneBuild(job) };
}

export function getDashboardProjects(userId: string): DashboardProject[] {
  return projects
    .filter((project) => project.userId === userId)
    .map((project) => ({
      project: cloneProject(project),
      latestBuild: latestBuildForProject(project.id),
      isOwner: true
    }))
    .sort(
      (a, b) =>
        new Date(b.project.updatedAt).getTime() -
        new Date(a.project.updatedAt).getTime()
    );
}

export function getShowcaseProjects(userId: string): ShowcaseProject[] {
  return projects
    .filter((project) => project.visibility === "public" && project.isPermanent)
    .map((project) => {
      const owner = getUserByIdInternal(project.userId);
      return {
        project: cloneProject(project),
        latestBuild: latestBuildForProject(project.id),
        ownerName: owner?.name || "Unknown Creator"
      };
    })
    .filter(
      (item) =>
        item.latestBuild?.status === "success" ||
        item.project.userId === userId
    )
    .sort((a, b) => b.project.downloadsCount - a.project.downloadsCount);
}

export function getProjectWithBuilds(
  projectId: string,
  viewerUserId: string
): {
  project?: Project;
  builds: BuildJob[];
  isOwner: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPermanentSave: boolean;
} {
  const project = getProjectByIdInternal(projectId);
  if (!project || !includeProjectByViewer(project, viewerUserId)) {
    return {
      project: undefined,
      builds: [],
      isOwner: false,
      canEdit: false,
      canDelete: false,
      canPermanentSave: false
    };
  }

  const isOwner = project.userId === viewerUserId;
  return {
    project: cloneProject(project),
    builds: listBuildJobsForProject(project.id),
    isOwner,
    canEdit: isOwner && !project.isPermanent,
    canDelete: isOwner && !project.isPermanent,
    canPermanentSave: isOwner && !project.isPermanent
  };
}

export function setProjectVisibility(
  projectId: string,
  userId: string,
  visibility: ProjectVisibility
): { project?: Project; error?: string } {
  const project = getProjectByIdInternal(projectId);
  if (!project) return { error: "Project not found." };
  if (project.userId !== userId) return { error: "Not allowed." };
  if (project.isPermanent) {
    return { error: "Permanent project visibility cannot be changed." };
  }

  project.visibility = visibility;
  project.updatedAt = new Date().toISOString();
  return { project: cloneProject(project) };
}

export function permanentSaveProject(
  projectId: string,
  userId: string
): { project?: Project; error?: string } {
  const project = getProjectByIdInternal(projectId);
  if (!project) return { error: "Project not found." };
  if (project.userId !== userId) return { error: "Not allowed." };
  if (project.isPermanent) return { error: "Project is already permanent." };

  project.isPermanent = true;
  project.visibility = "public";
  project.updatedAt = new Date().toISOString();
  return { project: cloneProject(project) };
}

export function deleteProject(
  projectId: string,
  userId: string
): { success: boolean; error?: string } {
  const index = projects.findIndex((project) => project.id === projectId);
  if (index === -1) return { success: false, error: "Project not found." };
  if (projects[index].userId !== userId) {
    return { success: false, error: "Not allowed." };
  }
  if (projects[index].isPermanent) {
    return {
      success: false,
      error: "Permanent saved projects cannot be deleted by users."
    };
  }

  projects.splice(index, 1);

  for (let i = buildJobs.length - 1; i >= 0; i -= 1) {
    if (buildJobs[i].projectId === projectId) {
      buildJobs.splice(i, 1);
    }
  }

  for (let i = uploadedAssets.length - 1; i >= 0; i -= 1) {
    if (uploadedAssets[i].projectId === projectId) {
      uploadedAssets.splice(i, 1);
    }
  }

  return { success: true };
}

export function cloneProjectForUser(
  sourceProjectId: string,
  userId: string
): { project?: Project; build?: BuildJob; error?: string } {
  const sourceProject = getProjectByIdInternal(sourceProjectId);
  if (!sourceProject) return { error: "Source project not found." };
  if (sourceProject.visibility !== "public" && sourceProject.userId !== userId) {
    return { error: "Source project is not public." };
  }

  const now = new Date().toISOString();
  const project: Project = {
    ...cloneProject(sourceProject),
    id: createId("project"),
    userId,
    appName: `${sourceProject.appName} Clone`,
    packageName: uniqueClonePackageName(sourceProject.packageName),
    visibility: "private",
    isPermanent: false,
    downloadsCount: 0,
    createdAt: now,
    updatedAt: now
  };
  projects.unshift(project);

  const { build } = createBuildJob(project.id, userId);
  return { project: cloneProject(project), build };
}

export function incrementProjectDownload(
  projectId: string
): { project?: Project; error?: string } {
  const project = getProjectByIdInternal(projectId);
  if (!project) return { error: "Project not found." };
  project.downloadsCount += 1;
  project.updatedAt = new Date().toISOString();
  return { project: cloneProject(project) };
}

export function getDownloadInfo(
  projectId: string,
  viewerUserId: string,
  buildId?: string
): { apkUrl?: string; error?: string } {
  const project = getProjectByIdInternal(projectId);
  if (!project) return { error: "Project not found." };
  if (!includeProjectByViewer(project, viewerUserId)) {
    return { error: "You do not have access to this project download." };
  }

  const build =
    (buildId ? getBuildByIdInternal(buildId) : undefined) ||
    buildJobs
      .filter((item) => item.projectId === projectId)
      .map((item) => syncBuildJob(item))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

  if (!build) return { error: "No build available." };
  if (build.status !== "success" || !build.apkUrl) {
    return { error: "APK is not ready yet." };
  }

  return { apkUrl: build.apkUrl };
}

export function getGlobalStats(): GlobalStats {
  const totalSuccessfulBuilds = buildJobs.filter((build) => {
    const synced = syncBuildJob(build);
    return synced.status === "success";
  }).length;

  return {
    totalProjects: projects.length,
    totalPublicPermanentProjects: projects.filter(
      (project) => project.visibility === "public" && project.isPermanent
    ).length,
    totalSuccessfulBuilds,
    totalDownloads: projects.reduce(
      (total, project) => total + project.downloadsCount,
      0
    )
  };
}

export function listUploadedAssets(projectId: string): UploadedAsset[] {
  return uploadedAssets
    .filter((asset) => asset.projectId === projectId)
    .map((asset) => ({ ...asset }));
}
