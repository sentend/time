import { useOutletContext, useParams } from "react-router";
import {
	ProjectDetailsContext,
	ProjectDetailsPageParams,
} from "../ProjectDetailsPage/ProjectDetailsPage";
import ProjectNodeTreeWidget from "./widgets/ProjectNodeTreeWidget/ProjectNodeTreeWidget";

const ProjectNodesPage = () => {
	const { project } = useOutletContext<ProjectDetailsContext>();

	if (!project) {
		// TODO: TMTEAM-91 — add loading indicator
		return "Loading...";
	}

	return <ProjectNodeTreeWidget projectId={project.id} projectColorId={project.colorId} />;
};

export default ProjectNodesPage;
