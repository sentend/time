import { Separator, Tabs, TabsContent, TabsList } from "@/shared/ui";
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/shared/libs";

type Content = {
	value: string;
	element: ReactNode;
};
type TabBarParams = {
	children: ReactNode;
	value: string;
	onValueChange: (value: string) => void;
	className?: string;
	content?: Content[];
};

const TabBar = ({ children, value, onValueChange, className, content }: TabBarParams) => {
	const [leftPosition, setLeftPosition] = useState(0);
	const [width, setWidth] = useState(0);

	const rootTabRef = useRef<HTMLDivElement>(null);
	const tabListRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<Record<string, Element | null>>({});
	const isTransitionEnable = useRef(false);

	const setRef = useCallback((el: Element | null, val: string) => {
		if (el) {
			tabRefs.current[val] = el;
		}
	}, []);

	useLayoutEffect(() => {
		const tabs = tabListRef.current?.querySelectorAll('[role="tab"]');
		if (tabs?.length) {
			for (const tab of tabs) {
				setRef(tab, tab.getAttribute("data-value")!);
			}
		}
		setTimeout(() => {
			isTransitionEnable.current = true;
		}, 0);
	}, [setRef]);

	useLayoutEffect(() => {
		setLeftPosition(
			tabRefs.current[value]!.getBoundingClientRect().left -
				rootTabRef.current!.getBoundingClientRect().left
		);
		setWidth(tabRefs.current[value]!.getBoundingClientRect().width);
	}, [value]);

	return (
		<Tabs value={value} className="w-full" onValueChange={onValueChange} ref={rootTabRef}>
			<TabsList className={cn("flex flex-col mb-5", className)} ref={tabListRef}>
				{children}
				<Separator />
				<div
					className={cn("absolute bottom-[-2px] h-[3px] bg-primary rounded-b-xl", {
						"transition-all": isTransitionEnable.current,
					})}
					style={{
						left: leftPosition,
						width: width,
					}}
				></div>
			</TabsList>
			{content?.map((item) => (
				<TabsContent key={item.value} value={item.value}>
					{item.element}
				</TabsContent>
			))}
		</Tabs>
	);
};

export { TabBar };
