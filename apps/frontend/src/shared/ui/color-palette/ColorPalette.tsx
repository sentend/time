import { HTMLAttributes, useState } from "react";
import { Color, COLORS } from "@/shared/config";
import { cn } from "@/shared/libs";

export type ColorOptions = {
	color: Color;
	colorIndex: number;
};

export type ColorPalleteProps = {
	onColorSelect?: (colorOptions: ColorOptions) => void;
	selectedColorId: number;
} & HTMLAttributes<HTMLDivElement>;

export const ColorPalette = ({ onColorSelect, selectedColorId, ...rest }: ColorPalleteProps) => {
	const [selectedColor, setSelectedColor] = useState<number>(selectedColorId || 0);

	const handleColorChange = (color: Color, index: number) => () => {
		setSelectedColor(index);

		if (onColorSelect) {
			onColorSelect({ color, colorIndex: index });
		}
	};

	return (
		<div className="grid grid-cols-[repeat(9,24px)] gap-x-3 gap-y-2 " {...rest}>
			{COLORS.colors.map((color, i) => (
				<div
					key={color.name}
					onClick={handleColorChange(color, i)}
					className={cn(
						"h-6 w-6 rounded-full cursor-pointer focus:bg-red-200",
						selectedColor === i ? `outline outline-2 outline-offset-2 ${color.outline}` : "",
						color.bg
					)}
				></div>
			))}
		</div>
	);
};
