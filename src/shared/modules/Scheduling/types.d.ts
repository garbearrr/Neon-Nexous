interface DebounceOptions {
	/**
	 * The leading edge of the timeout.
	 */
	leading?: boolean;
	/**
	 * The trailing edge of the timeout.
	 */
	trailing?: boolean;
	/**
	 * The maximum time `callback` is allowed to be delayed before it's invoked.
	 */
	maxWait?: number;
}

type Debounced<T extends Callback> = T & {
	cancel: () => void;
	flush: () => ReturnType<T>;
	pending: () => boolean;
};

interface ThrottleOptions {
	/**
	 * The leading edge of the timeout.
	 */
	leading?: boolean;
	/**
	 * The trailing edge of the timeout.
	 */
	trailing?: boolean;
}