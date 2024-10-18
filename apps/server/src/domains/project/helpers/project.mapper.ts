import { projectSchema, projectSchemaLight } from "../project.dto";
import type { ProjectEntity } from "../project.entity";

export class ProjectMapper {
	public static toDTO(project: ProjectEntity) {
		return projectSchema.parse(project);
	}

	public static toLightDTO(project: ProjectEntity) {
		return projectSchemaLight.parse(project);
	}
}
