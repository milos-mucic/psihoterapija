import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { SubmissionRepository } from "@/features/forms/repositories/submission.repository";
import type { SubmissionInput, SubmissionRecord } from "@/features/forms/types/submission.types";

const DATA_FILE = path.join(process.cwd(), "data", "mock", "submissions.json");

const ensureDataFile = async () => {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
};

const readAll = async (): Promise<SubmissionRecord[]> => {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw) as SubmissionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAll = async (records: SubmissionRecord[]) => {
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
};

export class FileSubmissionRepository implements SubmissionRepository {
  async list() {
    const items = await readAll();
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getById(id: string) {
    const items = await readAll();
    return items.find((item) => item.id === id);
  }

  async create(input: SubmissionInput) {
    const items = await readAll();

    const record: SubmissionRecord = {
      id: randomUUID(),
      status: "new",
      createdAt: new Date().toISOString(),
      ...input,
      phone: input.phone?.trim() || undefined,
    };

    items.push(record);
    await writeAll(items);
    return record;
  }
}
