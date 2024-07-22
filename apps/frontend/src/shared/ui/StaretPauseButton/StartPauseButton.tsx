import {
	PauseLG,
	PauseMD,
	PauseSM,
	PauseXL,
	StartLG,
	StartMD,
	StartSM,
	StartXL,
} from "@/shared/assets";
import { config } from "@/shared/config";
import { cn } from "@/shared/utils";

type Size = "sm" | "md" | "lg" | "xl";

type StartPauseButtonProps = {
	isRunning: boolean;
	onClick: () => void;
	colorId?: number;
	size?: Size;
	className?: string;
};

//? make as one
const getStartButton = (size: Size) => {
	switch (size) {
		case "sm":
			return StartSM;
		case "md":
			return StartMD;
		case "lg":
			return StartLG;
		case "xl":
			return StartXL;
	}
};

const getPauseButton = (size: Size) => {
	switch (size) {
		case "sm":
			return PauseSM;
		case "md":
			return PauseMD;
		case "lg":
			return PauseLG;
		case "xl":
			return PauseXL;
	}
};

const getPixelSize = (size: Size) => {
	switch (size) {
		case "sm":
			return 20;
		case "md":
			return 28;
		case "lg":
			return 36;
		case "xl":
			return 48;
	}
};

const StartPauseButton = ({
	isRunning,
	onClick,
	colorId,
	size,
	className,
}: StartPauseButtonProps) => {
	const effectiveSize = size || "md";
	const effectiveColorId = colorId || 0;
	const effectiveFill = config.colors[effectiveColorId]?.fill || "text-gray-900";
	const effectiveClass = cn("cursor-pointer", { [effectiveFill]: true }, className);
	const pixelSize = getPixelSize(effectiveSize);
	const EffectiveIcon = isRunning ? getPauseButton(effectiveSize) : getStartButton(effectiveSize);

	return (
		<EffectiveIcon
			width={pixelSize}
			height={pixelSize}
			onClick={onClick}
			className={effectiveClass}
		/>
	);
};

export default StartPauseButton;
