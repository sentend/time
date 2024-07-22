import { WrappedCallbackRef, Queue, Key } from "../types";

import { addEventListener, removeEventListener } from "./event";
import { getOrCreateQueue, areAllQueriesEmpty } from "./queue";

type RemoveParams = {
	queue: Queue;
	wrappedCallback: WrappedCallbackRef;
};

const removeCallback = ({ queue, wrappedCallback }: RemoveParams) => {
	const index = queue.findIndex((queueCallback) => queueCallback === wrappedCallback);

	if (index > -1) {
		queue.splice(index, 1);
	}

	if (areAllQueriesEmpty()) {
		removeEventListener();
	}
};

type AddParams = {
	key: Key;
	wrappedCallback: WrappedCallbackRef;
	withMetaKeys?: boolean;
};

export const addCallback = ({ key, wrappedCallback, withMetaKeys }: AddParams) => {
	const needAddEventListener = areAllQueriesEmpty();

	const queue = getOrCreateQueue(key);
	queue.push(wrappedCallback);

	if (needAddEventListener) {
		addEventListener();
	}

	return () => removeCallback({ queue, wrappedCallback });
};
