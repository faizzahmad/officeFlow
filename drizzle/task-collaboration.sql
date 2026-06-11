-- Run this in Neon SQL editor if `npm run db:push` prompts fail.
-- Adds task collaborators, links, and comment mentions.

CREATE TABLE IF NOT EXISTS "task_collaborators" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "task_id" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE cascade,
  "employee_id" uuid NOT NULL REFERENCES "employees"("id") ON DELETE cascade,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "task_collaborators_task_id_employee_id_unique" UNIQUE("task_id","employee_id")
);

CREATE TABLE IF NOT EXISTS "task_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "task_id" uuid NOT NULL REFERENCES "tasks"("id") ON DELETE cascade,
  "url" text NOT NULL,
  "label" text,
  "added_by_id" uuid REFERENCES "employees"("id") ON DELETE set null,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "task_comment_mentions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "comment_id" uuid NOT NULL REFERENCES "task_comments"("id") ON DELETE cascade,
  "employee_id" uuid NOT NULL REFERENCES "employees"("id") ON DELETE cascade,
  CONSTRAINT "task_comment_mentions_comment_id_employee_id_unique" UNIQUE("comment_id","employee_id")
);
