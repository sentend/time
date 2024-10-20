import { Sidebar } from "./sidebar/sidebar";
import type { PropsWithChildren } from "react";

export const MainLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className="w-screen min-h-screen flex">
			<Sidebar />
			<div className="w-[calc(100%-185px)] p-4 realtive z-1">
				<div className="flex items-center justify-center">
					<div className="w-[880px] h-full">{children}</div>
				</div>
			</div>
		</div>
	);
};
