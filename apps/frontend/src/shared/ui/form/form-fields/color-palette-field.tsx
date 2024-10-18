import type { FieldPath, FieldValues } from "react-hook-form";
import { ColorPalette, type ColorOptions } from "../../color-palette";
import { FormControl, FormField, FormItem, FormLabel } from "../form";
import type { FieldProps } from "./checkbox-field";
import { useTranslation } from "react-i18next";

type Props<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
	onColorSelect: (colorOptions: ColorOptions) => void;
} & FieldProps<TFieldValues, TName>;

export const ColorPaletteField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	onColorSelect,
	control,
	name,
}: Props<TFieldValues, TName>) => {
	const { t } = useTranslation();

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{t("color")}</FormLabel>
					<FormControl>
						<ColorPalette selectedColorId={field.value} onColorSelect={onColorSelect} />
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
