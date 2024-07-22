import React, { HTMLAttributes, MouseEvent } from "react";

import { Color, config, Config } from "@/shared/config";
import { cn } from "@/shared/utils";
import { MergeProps } from "@/shared/types";

type ColorOptions = {
	color: Color;
	listColors: Config["colors"];
	colorIndex: number;
};

export type ColorPalleteProps = {
	onClick?: (e: MouseEvent<HTMLDivElement>, colorOptions: ColorOptions) => void;
	selectedColorId: number;
};

export const ColorPalette = ({
	onClick,
	selectedColorId,
	...rest
}: MergeProps<HTMLAttributes<HTMLDivElement>, ColorPalleteProps>) => {
	return (
		<div className="grid grid-cols-[repeat(9,24px)] gap-x-3 gap-y-2 " {...rest}>
			{config.colors.map((color, i) => (
				<div
					key={color.colorCode}
					onClick={(e) => {
						onClick?.(e, {
							color,
							listColors: config.colors,
							colorIndex: i,
						});
					}}
					className={cn(
						"h-6 w-6 rounded-full cursor-pointer focus:bg-red-200",
						selectedColorId === i ? `outline outline-2 outline-offset-2 ${color.outline}` : "",
						color.bg
					)}
				></div>
			))}
		</div>
	);
};
