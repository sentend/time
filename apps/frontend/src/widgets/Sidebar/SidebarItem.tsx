import { cn } from "@/shared/utils";
import { NavLink } from "react-router-dom";

type SidebarItemProps = {
	Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	name: string;
	to: string;
};

const SidebarItem = ({ Icon, name, to }: SidebarItemProps) => {
	return (
		<NavLink
			to={to}
			key={name}
			className={({ isActive }) => {
				return cn("px-3 block py-2 group hover:bg-gray-4 rounded-lg w-full", {
					"bg-gray-4": isActive,
				});
			}}
		>
			{({ isActive }) => {
				return (
					<div className="flex items-center font-bold text-semi-primary">
						<div className="flex mr-[10px]">
							<Icon
								width={20}
								height={20}
								className={cn("group-hover:fill-gray-70 group-hover:stroke-gray-70", {
									"fill-gray-70 stroke-gray-70": isActive,
								})}
							/>
						</div>
						<span
							className={cn("w-full group-hover:text-primary", {
								"text-primary": isActive,
							})}
						>
							{name}
						</span>
					</div>
				);
			}}
		</NavLink>
	);
};

export default SidebarItem;
