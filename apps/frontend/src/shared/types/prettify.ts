export type Prettify<T> = {
	[K in keyof T]: T[K];
};

export type MergeProps<T, U> = Omit<T, keyof U> & U;
