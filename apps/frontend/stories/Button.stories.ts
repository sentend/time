import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../src/shared/ui";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
	title: "Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "primary", "destructive", "outline", "ghost", "link"],
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg", "icon", "icon-sm", "icon-lg"],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "default",
		size: "default",
		children: "Button",
	},
};

export const Primary: Story = {
	args: {
		variant: "primary",
		size: "default",
		children: "Button",
	},
};

export const Large: Story = {
	args: {
		size: "lg",
		children: "Button",
	},
};

export const Small: Story = {
	args: {
		size: "sm",
		children: "Button",
	},
};
