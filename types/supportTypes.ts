export type Nullable<T> = T | null

export type Maybe<T> = T | undefined

export type Optional<T> = T | undefined | null

export type Prettify<T> = {
	[K in keyof T]: T[K];
  } & {};