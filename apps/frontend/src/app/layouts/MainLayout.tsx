import { Outlet } from "react-router-dom";

import { Header, Sidebar } from "@/widgets";

const MainLayout = () => {
	return (
		<div className="w-screen min-h-screen flex">
			<Sidebar />

			<div className="w-[calc(100%-185px)] p-4 realtive z-1">
				{/* <Header /> */}
				<div className="flex items-center justify-center">
					<div className="w-[880px] h-full">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
