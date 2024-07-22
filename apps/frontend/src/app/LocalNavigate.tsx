import { useEffect } from "react";
import { useNavigate } from "react-router";

import useCurrentWorkspace from "@/shared/hooks/useCurrentWorkspace";

const Navigate = () => {
	const currentWorkspace = useCurrentWorkspace();

	const navigate = useNavigate();
	useEffect(() => {
		navigate(`${currentWorkspace.id}/projects`);
	});

	return <div></div>;
};

export default Navigate;
