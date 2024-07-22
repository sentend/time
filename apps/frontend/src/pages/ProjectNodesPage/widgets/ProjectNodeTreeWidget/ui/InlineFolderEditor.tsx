import { config } from "@/shared/config";
import { useKeyboard } from "@/shared/hooks";
import { InputField } from "@/shared/ui";
import { cn } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const folderEditorScheme = z.object({
	name: z.string().min(1),
	colorId: z.number().optional(),
});

export type FolderEditorValues = z.infer<typeof folderEditorScheme>;

type InlineFolderEditorProps = {
	folderName?: string;
	folderColorId?: number;
	defaultColorId: number;
	isUpdating: boolean;
	onSubmit: (values: FolderEditorValues) => void;
	onClose: () => void;
};

const InlineFolderEditor = ({
	folderName,
	folderColorId,
	defaultColorId,
	isUpdating,
	onSubmit,
	onClose,
}: InlineFolderEditorProps) => {
	const { t } = useTranslation();

	const formMethods = useForm({
		defaultValues: {
			name: folderName || "",
		},
		resolver: zodResolver(folderEditorScheme),
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
			handleSubmit(onSubmitForm)();
		},
	});

	useEffect(() => {
		setFocus("name");
	}, [setFocus]);

	const onSubmitForm = (values: FolderEditorValues) => {
		onSubmit(values);
	};

	const effectiveColorId = folderColorId || defaultColorId;

	return (
		<div className="w-full">
			<div
				className={cn(
					"w-full py-2 pl-9 pr-3 rounded-lg flex group items-center gap-2 cursor-grab bg-white"
				)}
			>
				<FolderIcon
					width={26}
					height={26}
					className={cn("", config.colors[effectiveColorId]?.fill)}
				/>
				<form className="w-full" onSubmit={handleSubmit(onSubmitForm)}>
					<InputField
						{...register("name", {
							onBlur: () => {
								handleSubmit(onSubmit)();
							},
						})}
						size="sm"
						placeholder={t("task.newPlaceholder")}
						disabled={isUpdating}
					/>
				</form>
			</div>
		</div>
	);
};

export default InlineFolderEditor;
