ALTER TABLE "tasks" ADD COLUMN "userId" text;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "userId" text;
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id");
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id");
--> statement-breakpoint
CREATE INDEX "tasks_userId_idx" ON "tasks" ("userId");
--> statement-breakpoint
CREATE INDEX "tasks_projectId_idx" ON "tasks" ("projectId");
--> statement-breakpoint
CREATE INDEX "projects_userId_idx" ON "projects" ("userId");
