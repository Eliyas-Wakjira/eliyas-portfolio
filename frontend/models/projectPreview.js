const isDeployedProject = (project) => {
  const status = String(project?.status || "").toLowerCase();
  return status.includes("live") || status.includes("deployed") || status.includes("published");
};

const isPublicHttpsUrl = (value) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;
    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname === "::1" ||
      hostname.startsWith("127.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
      /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) ||
      hostname.startsWith("[")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const getProjectPreview = (project) => {
  if (project?.preview_mode === "screenshot") {
    return project.screenshot_url || project.image_url || "";
  }

  if (isDeployedProject(project) && isPublicHttpsUrl(project.live_url)) {
    return `https://image.thum.io/get/width/1200/crop/800/noanimate/${project.live_url}`;
  }

  return project?.screenshot_url || project?.image_url || "";
};

export { getProjectPreview, isDeployedProject, isPublicHttpsUrl };
