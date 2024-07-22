import debounce from "lodash/debounce";
import { useCallback } from "react";

const useDebounce = <T extends (...args: any[]) => any>(callback: T, delay = 100) => {
	const execFunc = useCallback(debounce(callback, delay, { trailing: true }), []);

	return execFunc;
};

export default useDebounce;
