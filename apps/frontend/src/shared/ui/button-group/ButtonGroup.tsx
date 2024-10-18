import React, { HTMLAttributes } from "react";

import { cn } from "@/shared/libs";

export type ButtonGroupProps = {
	orientation?: "horizontal" | "vertical";
} & HTMLAttributes<HTMLDivElement>;

const ButtonGroup = ({ children, orientation = "horizontal", ...props }: ButtonGroupProps) => {
	return (
		<div
			className={cn("p-1 bg-gray-4 rounded-lg flex gap-1 flex-row", {
				"flex-col": orientation === "vertical",
			})}
			{...props}
		>
			{children}
		</div>
	);
};

export { ButtonGroup };
