ALTER TABLE "userWorkspace" RENAME COLUMN "intiteValidUntil" TO "inviteValidUntil";--> statement-breakpoint
ALTER TABLE "userWorkspace" DROP CONSTRAINT "userWorkspace_workspaceId_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "beginDate" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "beginDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "endDate" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "workspaceId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "projectId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "timeEntry" ALTER COLUMN "taskId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "userWorkspace" ALTER COLUMN "canCreateProjects" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "userWorkspace" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "userWorkspace" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "node" ADD COLUMN "cachedColorId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "node" ADD COLUMN "parentIds" uuid[];--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userWorkspace" ADD CONSTRAINT "userWorkspace_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
