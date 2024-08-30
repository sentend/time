ALTER TABLE "node" DROP CONSTRAINT "node_parentId_node_id_fk";
--> statement-breakpoint
ALTER TABLE "timeEntry" DROP CONSTRAINT "timeEntry_taskId_node_id_fk";
--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "colorId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "colorId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "order" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "order" SET DEFAULT '1000';--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "node" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "node" ADD COLUMN "isDeleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "node" ADD CONSTRAINT "node_parentId_node_id_fk" FOREIGN KEY ("parentId") REFERENCES "node"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timeEntry" ADD CONSTRAINT "timeEntry_taskId_node_id_fk" FOREIGN KEY ("taskId") REFERENCES "node"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
