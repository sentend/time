export type Color = {
	bg: string;
	text: string;
	outline: string;
	colorCode: string;
	stroke: string;
	fill: string;
};

export type Config = {
	colors: Readonly<Color[]>;
};

export const config: Config = {
	colors: [
		{
			bg: "bg-tm-color-0",
			text: "text-tm-color-0",
			fill: "fill-tm-color-0",
			outline: "outline-tm-color-0",
			stroke: "stroke-tm-color-0",
			colorCode: "purple",
		},
		{
			bg: "bg-tm-color-1",
			text: "text-tm-color-1",
			fill: "fill-tm-color-1",
			outline: "outline-tm-color-1",
			stroke: "stroke-tm-color-1",
			colorCode: "pink",
		},
		{
			bg: "bg-tm-color-2",
			text: "text-tm-color-2",
			fill: "fill-tm-color-2",
			outline: "outline-tm-color-2",
			stroke: "stroke-tm-color-2",
			colorCode: "red",
		},
		{
			bg: "bg-tm-color-3",
			text: "text-tm-color-3",
			fill: "fill-tm-color-3",
			outline: "outline-tm-color-3",
			stroke: "stroke-tm-color-3",
			colorCode: "orange",
		},
		{
			bg: "bg-tm-color-4",
			text: "text-tm-color-4",
			fill: "fill-tm-color-4",
			outline: "outline-tm-color-4",
			stroke: "stroke-tm-color-4",
			colorCode: "yellow",
		},
		{
			bg: "bg-tm-color-5",
			text: "text-tm-color-5",
			fill: "fill-tm-color-5",
			outline: "outline-tm-color-5",
			stroke: "stroke-tm-color-5",
			colorCode: "green",
		},
		{
			bg: "bg-tm-color-6",
			text: "text-tm-color-6",
			fill: "fill-tm-color-6",
			outline: "outline-tm-color-6",
			stroke: "stroke-tm-color-6",
			colorCode: "lightblue",
		},
		{
			bg: "bg-tm-color-7",
			text: "text-tm-color-7",
			fill: "fill-tm-color-7",
			outline: "outline-tm-color-7",
			stroke: "stroke-tm-color-7",
			colorCode: "blue",
		},
		{
			bg: "bg-tm-color-8",
			text: "text-tm-color-8",
			fill: "fill-tm-color-8",
			outline: "outline-tm-color-8",
			stroke: "stroke-tm-color-8",
			colorCode: "darkBlue",
		},
		{
			bg: "bg-tm-color-9",
			text: "text-tm-color-9",
			fill: "fill-tm-color-9",
			outline: "outline-tm-color-9",
			stroke: "stroke-tm-color-9",
			colorCode: "violet",
		},
		{
			bg: "bg-tm-color-10",
			text: "text-tm-color-10",
			fill: "fill-tm-color-10",
			outline: "outline-tm-color-10",
			stroke: "stroke-tm-color-10",
			colorCode: "lightPink",
		},
		{
			bg: "bg-tm-color-11",
			text: "text-tm-color-11",
			fill: "fill-tm-color-11",
			outline: "outline-tm-color-11",
			stroke: "stroke-tm-color-11",
			colorCode: "lightRed",
		},
		{
			bg: "bg-tm-color-12",
			text: "text-tm-color-12",
			fill: "fill-tm-color-12",
			outline: "outline-tm-color-12",
			stroke: "stroke-tm-color-12",
			colorCode: "brown",
		},
		{
			bg: "bg-tm-color-13",
			text: "text-tm-color-13",
			fill: "fill-tm-color-13",
			stroke: "stroke-tm-color-13",
			outline: "outline-tm-color-13",
			colorCode: "yellowGreen",
		},
		{
			bg: "bg-tm-color-14",
			text: "text-tm-color-14",
			fill: "fill-tm-color-14",
			outline: "outline-tm-color-14",
			stroke: "stroke-tm-color-14",
			colorCode: "lightgreen",
		},
		{
			bg: "bg-tm-color-15",
			text: "text-tm-color-15",
			fill: "fill-tm-color-15",
			outline: "outline-tm-color-15",
			stroke: "stroke-tm-color-15",
			colorCode: "cyan",
		},
		{
			bg: "bg-tm-color-16",
			text: "text-tm-color-16",
			fill: "fill-tm-color-16",
			outline: "outline-tm-color-16",
			stroke: "stroke-tm-color-16",
			colorCode: "greyBlue",
		},
		{
			bg: "bg-tm-color-17",
			text: "text-tm-color-17",
			fill: "fill-tm-color-17",
			outline: "outline-tm-color-17",
			stroke: "stroke-tm-color-17",
			colorCode: "lightPurple",
		},
	] as const,
};
