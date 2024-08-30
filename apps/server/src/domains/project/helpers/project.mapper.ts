import type { Project } from "../project.entity";
import { projectSchema } from "../project.model";

export class ProjectMapper {
	public static toModel(project: Project) {
		return projectSchema.parse(project);
	}
}
