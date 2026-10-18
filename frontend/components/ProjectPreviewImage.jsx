import { useState } from "react";
import { getProjectPreview } from "../models/projectPreview";
import { apiUrl } from "../controllers/api";

const ProjectPreviewImage = ({ project, alt, className, ...props }) => {
  const preview = getProjectPreview(project);
  const fallback = project?.image_url || "";
  const [failedPreview, setFailedPreview] = useState("");
  const src = apiUrl(failedPreview === preview ? fallback : preview);

  return (
    <img
      src={src}
      alt={alt || project?.title || ""}
      className={className}
      onError={() => {
        if (src && src !== fallback) setFailedPreview(preview);
      }}
      {...props}
    />
  );
};

export { ProjectPreviewImage };
