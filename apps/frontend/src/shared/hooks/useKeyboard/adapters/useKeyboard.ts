import { useEffect, useMemo, useRef } from "react";

import { addCallback } from "../core";
import { Callback, WrappedCallback, Key } from "../types";

type Props = {
	key: Key;
	callback: Callback;
	disabled?: boolean;
	withMetaKeys?: boolean;
};

export const useKeyboard = ({ key, callback, disabled = false, withMetaKeys = false }: Props) => {
	const wrappedCallback = useRef<WrappedCallback>(null);

	wrappedCallback.current = { callback };

	const removeCallback = useMemo(() => {
		if (disabled) {
			return null;
		}

		return addCallback({
			key,
			wrappedCallback,
			withMetaKeys,
		});
	}, [key, disabled]);

	useEffect(() => {
		if (removeCallback) {
			return removeCallback;
		}
	}, [removeCallback]);
};
