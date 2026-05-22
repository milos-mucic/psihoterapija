import { randomUUID } from "node:crypto";
import { Submissions, db, desc, eq } from "astro:db";
import type { SubmissionRepository } from "@/features/forms/repositories/submission.repository";
import type { SubmissionInput, SubmissionRecord } from "@/features/forms/types/submission.types";

const toIsoString = (value: Date | string) => (value instanceof Date ? value.toISOString() : value);

const mapRecord = (row: {
  id: string;
  type: SubmissionRecord["type"];
  locale: SubmissionRecord["locale"];
  name: string;
  email: string;
  phone: string | null;
  format: string | null;
  message: string | null;
  status: SubmissionRecord["status"];
  createdAt: Date | string;
}): SubmissionRecord => ({
  id: row.id,
  type: row.type,
  locale: row.locale,
  name: row.name,
  email: row.email,
  phone: row.phone ?? undefined,
  format: row.format ?? undefined,
  message: row.message ?? undefined,
  status: row.status,
  createdAt: toIsoString(row.createdAt),
});

export class AstroDbSubmissionRepository implements SubmissionRepository {
  async list() {
    const rows = await db.select().from(Submissions).orderBy(desc(Submissions.createdAt));
    return rows.map(mapRecord);
  }

  async getById(id: string) {
    const rows = await db.select().from(Submissions).where(eq(Submissions.id, id)).limit(1);
    const row = rows[0];
    return row ? mapRecord(row) : undefined;
  }

  async create(input: SubmissionInput) {
    const record = {
      id: randomUUID(),
      type: input.type,
      locale: input.locale,
      name: input.name,
      email: input.email,
      phone: input.phone?.trim() || undefined,
      format: input.format?.trim() || undefined,
      message: input.message?.trim() || undefined,
      status: "new" as const,
      createdAt: new Date(),
    };

    await db.insert(Submissions).values(record);

    return {
      ...record,
      createdAt: record.createdAt.toISOString(),
    };
  }
}
