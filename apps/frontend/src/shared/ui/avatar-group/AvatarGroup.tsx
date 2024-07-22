import { HTMLAttributes } from "react";

import { Avatar } from "..";

export type AvatarGroupProps = {
	max?: number;
} & HTMLAttributes<HTMLDivElement>;

const AvatarGroup = ({ children, max }: AvatarGroupProps) => {
	let effectiveChildren = children;
	let restItems = 0;

	if (Array.isArray(children) && max) {
		effectiveChildren = children.slice(0, max);

		restItems = children.length > max ? children.length - max : restItems;
	}

	return (
		<div className="flex justify-start">
			<div className="flex flex-row-reverse [&>*]:relative [&>*]:ml-[-8px] [&>*]:border-white [&>*]:border-2">
				{!!restItems && (
					<Avatar
						fallbackText={`+${restItems}`}
						fallbackProps={{
							className: "bg-gray-10",
						}}
					/>
				)}
				{effectiveChildren}
			</div>
		</div>
	);
};

export { AvatarGroup };
