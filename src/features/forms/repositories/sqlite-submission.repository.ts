import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/sqlite";
import type { SubmissionRepository } from "@/features/forms/repositories/submission.repository";
import type { SubmissionInput, SubmissionRecord, SubmissionStatus } from "@/features/forms/types/submission.types";

type SubmissionRow = {
  id: string;
  type: SubmissionRecord["type"];
  locale: SubmissionRecord["locale"];
  name: string;
  email: string;
  phone: string | null;
  format: string | null;
  message: string | null;
  status: SubmissionStatus;
  created_at: string;
};

const mapRow = (row: SubmissionRow): SubmissionRecord => ({
  id: row.id,
  type: row.type,
  locale: row.locale,
  name: row.name,
  email: row.email,
  phone: row.phone ?? undefined,
  format: row.format ?? undefined,
  message: row.message ?? undefined,
  status: row.status,
  createdAt: row.created_at,
});

export class SqliteSubmissionRepository implements SubmissionRepository {
  async list() {
    const db = getDb();
    const rows = db
      .prepare(
        `
          SELECT
            id,
            type,
            locale,
            name,
            email,
            phone,
            format,
            message,
            status,
            created_at
          FROM submissions
          ORDER BY created_at DESC
        `,
      )
      .all() as SubmissionRow[];

    return rows.map(mapRow);
  }

  async getById(id: string) {
    const db = getDb();
    const row = db
      .prepare(
        `
          SELECT
            id,
            type,
            locale,
            name,
            email,
            phone,
            format,
            message,
            status,
            created_at
          FROM submissions
          WHERE id = ?
          LIMIT 1
        `,
      )
      .get(id) as SubmissionRow | undefined;

    return row ? mapRow(row) : undefined;
  }

  async create(input: SubmissionInput) {
    const db = getDb();
    const record: SubmissionRecord = {
      id: randomUUID(),
      status: "new",
      createdAt: new Date().toISOString(),
      ...input,
      phone: input.phone?.trim() || undefined,
    };

    db.prepare(
      `
        INSERT INTO submissions (
          id,
          type,
          locale,
          name,
          email,
          phone,
          format,
          message,
          status,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      record.id,
      record.type,
      record.locale,
      record.name,
      record.email,
      record.phone ?? null,
      record.format ?? null,
      record.message ?? null,
      record.status,
      record.createdAt,
    );

    return record;
  }
}
