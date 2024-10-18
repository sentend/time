import { Text } from "@/shared/ui/text";
import { Fragment } from "react";

export const highlitedSubstring = (text: string, substring: string | null) => {
	if (!substring) {
		return text;
	}

	const splitedText = text.split(new RegExp(`(${substring})`, "gi"));
	return (
		<>
			{splitedText.map((text, i) => {
				if (!text) {
					return;
				}

				const isTextHighlighted = text === substring;
				return (
					<Fragment key={i}>
						<Text className="min-w-0" highlighted={isTextHighlighted} truncate asChild>
							{isTextHighlighted ? <mark>{text}</mark> : <span>{text}</span>}
						</Text>
					</Fragment>
				);
			})}
		</>
	);
};
