import path from "node:path";
import { serverEnv } from "@/lib/env";

export const getUploadsDir = () => {
  if (!serverEnv.uploadsDir) {
    return path.join(process.cwd(), "data", "uploads");
  }

  return path.isAbsolute(serverEnv.uploadsDir)
    ? serverEnv.uploadsDir
    : path.join(process.cwd(), serverEnv.uploadsDir);
};
