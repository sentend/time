CREATE TABLE IF NOT EXISTS "rate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" integer NOT NULL,
	"type" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"passwordHash" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"initials" text NOT NULL,
	"doiCreatedAt" timestamp with time zone DEFAULT now(),
	"doiConfirmedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"doiToken" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "node" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" integer DEFAULT 0 NOT NULL,
	"colorId" integer DEFAULT 0 NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"isCompleted" boolean DEFAULT false NOT NULL,
	"confirmedDuration" double precision DEFAULT 0 NOT NULL,
	"note" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"parentId" uuid,
	"projectId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"colorId" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"isArchived" boolean DEFAULT false NOT NULL,
	"isBillable" boolean DEFAULT false NOT NULL,
	"isNotedRequired" boolean DEFAULT false NOT NULL,
	"isTagsRequired" boolean DEFAULT false NOT NULL,
	"currencyId" integer,
	"isBudgetSet" boolean DEFAULT false NOT NULL,
	"budgetType" integer,
	"budgetValue" double precision,
	"budgetInterval" integer,
	"budgetStartDate" timestamp,
	"budgetEndDate" timestamp,
	"avatarFilename" text,
	"rateId" uuid,
	"workspaceId" integer NOT NULL,
	"createdBy" uuid NOT NULL,
	"updatedBy" uuid NOT NULL,
	"clientId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timeEntry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"beginDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"isAutotracked" boolean DEFAULT false NOT NULL,
	"notes" text,
	"confirmedDuration" integer,
	"confirmedRevenue" double precision,
	"isBillable" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"userId" uuid,
	"rateId" uuid,
	"workspaceId" integer,
	"projectId" uuid,
	"taskId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspace" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatarFilename" text,
	"nextProjectColorId" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userWorkspace" (
	"workspaceId" integer NOT NULL,
	"userId" uuid NOT NULL,
	"isOwner" boolean DEFAULT false NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	"canCreateProjects" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"currentTaskId" text,
	"inviteToken" text,
	"intiteValidUntil" timestamp with time zone,
	"firstDayOfWeek" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"rateId" uuid,
	"currentTimeEntryId" uuid,
	CONSTRAINT userWorkspace_workspaceId_userId PRIMARY KEY("workspaceId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projectTag" (
	"projectId" uuid NOT NULL,
	"tagId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"rateId" uuid,
	CONSTRAINT projectTag_tagId_projectId PRIMARY KEY("tagId","projectId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teamProject" (
	"teamId" uuid NOT NULL,
	"projectId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"rateId" uuid,
	CONSTRAINT teamProject_projectId_teamId PRIMARY KEY("projectId","teamId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timeEntryTag" (
	"tagId" uuid NOT NULL,
	"timeEntryId" uuid NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT timeEntryTag_tagId_timeEntryId PRIMARY KEY("tagId","timeEntryId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userProject" (
	"projectId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"isManager" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"rateId" uuid,
	CONSTRAINT userProject_projectId_userId PRIMARY KEY("projectId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTeam" (
	"userId" uuid NOT NULL,
	"teamId" uuid NOT NULL,
	"isTeamLead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	"workspaceId" integer NOT NULL,
	CONSTRAINT userTeam_teamId_userId PRIMARY KEY("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"colorId" integer DEFAULT 0 NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"expTime" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"workspaceId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "node" ADD CONSTRAINT "node_parentId_node_id_fk" FOREIGN KEY ("parentId") REFERENCES "node"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "node" ADD CONSTRAINT "node_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_rateId_rate_id_fk" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_updatedBy_user_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_clientId_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_rateId_rate_id_fk" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_taskId_node_id_fk" FOREIGN KEY ("taskId") REFERENCES "node"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userWorkspace" ADD CONSTRAINT "userWorkspace_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userWorkspace" ADD CONSTRAINT "userWorkspace_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userWorkspace" ADD CONSTRAINT "userWorkspace_rateId_rate_id_fk" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userWorkspace" ADD CONSTRAINT "userWorkspace_currentTimeEntryId_timeEntry_id_fk" FOREIGN KEY ("currentTimeEntryId") REFERENCES "timeEntry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projectTag" ADD CONSTRAINT "projectTag_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projectTag" ADD CONSTRAINT "projectTag_tagId_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projectTag" ADD CONSTRAINT "projectTag_rateId_rate_id_fk" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamProject" ADD CONSTRAINT "teamProject_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamProject" ADD CONSTRAINT "teamProject_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamProject" ADD CONSTRAINT "teamProject_rateId_rate_id_fk" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntryTag" ADD CONSTRAINT "timeEntryTag_tagId_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntryTag" ADD CONSTRAINT "timeEntryTag_timeEntryId_timeEntry_id_fk" FOREIGN KEY ("timeEntryId") REFERENCES "timeEntry"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProject" ADD CONSTRAINT "userProject_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProject" ADD CONSTRAINT "userProject_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProject" ADD CONSTRAINT "userProject_rateId_rate_id_fk" FOREIGN KEY ("rateId") REFERENCES "rate"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userTeam" ADD CONSTRAINT "userTeam_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userTeam" ADD CONSTRAINT "userTeam_teamId_team_id_fk" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userTeam" ADD CONSTRAINT "userTeam_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client" ADD CONSTRAINT "client_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
