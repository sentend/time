import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
	return (
		<div className="p-4">
			<Outlet />
		</div>
	);
};
