import { useMemo } from "react";
import { useLocation } from "react-router";

export const useCurrentSegment = <T extends string>(): T => {
	const { pathname } = useLocation();
	return useMemo(
		() => pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length),
		[pathname]
	) as T;
};
