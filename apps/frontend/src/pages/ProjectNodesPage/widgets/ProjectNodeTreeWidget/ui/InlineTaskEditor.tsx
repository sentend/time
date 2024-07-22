import { useKeyboard } from "@/shared/hooks";
import { InputField } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const taskScheme = z.object({
	name: z.string().min(1),
});

export type TaskEditorValues = z.infer<typeof taskScheme>;

type InlineTaskEditFormProps = {
	taskName?: string;
	onSubmit: (values: TaskEditorValues) => void;
	onClose: () => void;
};

const InlineTaskEditor = ({ taskName, onSubmit, onClose }: InlineTaskEditFormProps) => {
	const { t } = useTranslation();

	const formMethods = useForm({
		defaultValues: { name: taskName || "" },
		resolver: zodResolver(taskScheme),
	});

	const { setFocus, register, handleSubmit } = formMethods;

	useKeyboard({
		key: "Escape",
		callback: onClose,
	});

	useKeyboard({
		key: "Enter",
		callback: (e: KeyboardEvent) => {
			e.preventDefault();
			handleSubmit(onSubmit)();
		},
	});

	useEffect(() => {
		setFocus("name");
	}, [setFocus]);

	return (
		<div className="w-full">
			<div
				className={cn("w-full py-2 pl-9 pr-3 rounded-lg flex group items-center gap-2 cursor-grab")}
			>
				<form className="w-full" onSubmit={handleSubmit(onSubmit)}>
					<InputField
						{...register("name", {
							onBlur: () => {
								handleSubmit(onSubmit)();
								onClose();
							},
						})}
						size="sm"
						placeholder={t("task.newPlaceholder")}
					/>
				</form>
			</div>
		</div>
	);
};

export default InlineTaskEditor;
