import { PlusIcon } from "@/shared/assets";
import { Button, Text } from "@/shared/ui";

import { useTranslation } from "react-i18next";

import InlineTaskEditor, { TaskEditorValues } from "./InlineTaskEditor";

type InlineTaskEditorProps = {
	defaultColorId: number;
	isEditing: boolean;
	onNewTaskClick: () => void;
	onSubmit: (values: TaskEditorValues) => void;
	onCancel: () => void;
};

const NewTaskRow = ({
	defaultColorId,
	isEditing,
	onNewTaskClick,
	onSubmit,
	onCancel,
}: InlineTaskEditorProps) => {
	const { t } = useTranslation();

	if (isEditing) {
		return <InlineTaskEditor onSubmit={onSubmit} onClose={onCancel} />;
	}

	return (
		<Button
			className="w-full !justify-normal"
			variant={"ghost"}
			size={"sm"}
			onClick={onNewTaskClick}
		>
			<PlusIcon className="stroke-gray-30" width={9} height={9} />
			<Text variant="secondary">{t("task.new")}</Text>
		</Button>
	);
};

export default NewTaskRow;
