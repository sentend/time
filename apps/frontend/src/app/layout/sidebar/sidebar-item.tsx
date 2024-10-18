import { cn } from "@/shared/libs";
import { Link, useLinkProps } from "@swan-io/chicane";

type SidebarItemProps = {
	Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	name: string;
	to: string;
};

export const SidebarItem = ({ Icon, name, to }: SidebarItemProps) => {
	const { active, onClick } = useLinkProps({ href: to });

	return (
		<Link
			to={to}
			key={name}
			className={cn("px-3 block py-2 group hover:bg-gray-4 rounded-lg w-full", {
				"bg-gray-4": active,
			})}
		>
			<div className="flex items-center font-bold text-semi-primary">
				<div className="flex mr-[10px]">
					<Icon
						width={20}
						height={20}
						className={cn("group-hover:fill-gray-70 group-hover:stroke-gray-70", {
							"fill-gray-70 stroke-gray-70": active,
						})}
					/>
				</div>
				<span
					className={cn("w-full group-hover:text-primary", {
						"text-primary": active,
					})}
				>
					{name}
				</span>
			</div>
		</Link>
	);
};
