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

type Debounced = {
    (...args: unknown[]): unknown; // The debounced function can take any arguments and return any value
    cancel: () => void;  // Cancels any pending invocations
    flush: () => unknown;  // Immediately invokes the callback and returns its result
    pending: () => boolean;  // Checks if there are any pending invocations
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