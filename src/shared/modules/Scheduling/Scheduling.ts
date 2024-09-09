// https://github.com/littensy/set-timeout/tree/master

import { RunService } from "@rbxts/services";

export namespace Scheduling {
    /**
     * Creates a debounced function that delays invoking `callback` until after `wait`
     * seconds have elapsed since the last time the debounced function was invoked.
     * The debounced function comes with a `cancel` method to cancel delayed
     * `callback` invocations and a `flush` method to immediately invoke them.
     *
     * Provide `options` to indicate whether `callback` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `callback` is invoked
     * with the last arguments provided to the debounced function. Subsequent calls
     * to the debounced function return the result of the last `callback` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `callback` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `callback` invocation is deferred
     * until the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `debounce` and `throttle`.
     *
     * @param callback The function to debounce.
     * @param wait The number of seconds to delay. Defaults to `0`.
     * @param options The options object.
     * @returns The new debounced function.
     * @see https://github.com/lodash/lodash/blob/master/debounce.js/
     * @see https://css-tricks.com/debouncing-throttling-explained-examples/
     */
    /* export function Debounce<T extends Callback>(callback: T, wait = 0, options: DebounceOptions = {}): Debounced<T> {
        const { leading = false, trailing = true, maxWait } = options;

        const maxing = maxWait !== undefined;

        let lastCallTime = 0;
        let lastInvokeTime = 0;
        let lastArgs: Parameters<T> | undefined;
        let result: ReturnType<T>;
        let cancelTimeout: (() => void) | undefined;

        const invoke = (time: number) => {
            const args: unknown[] = lastArgs!;
            lastArgs = undefined;
            lastInvokeTime = time;
            result = callback(...args);
            return result;
        };

        const leadingEdge = (time: number) => {
            // Reset any `maxWait` timer.
            lastInvokeTime = time;
            // Start the timer for the trailing edge.
            cancelTimeout = SetTimeout(timerExpired, wait);
            // Invoke the leading edge.
            return leading ? invoke(time) : result;
        };

        const remainingWait = (time: number) => {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;
            const timeWaiting = wait - timeSinceLastCall;

            return maxing ? math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        };

        const shouldInvoke = (time: number) => {
            const timeSinceLastCall = time - lastCallTime;
            const timeSinceLastInvoke = time - lastInvokeTime;

            // Either this is the first call, activity has stopped and we're at the
            // trailing edge, the system time has gone backwards and we're treating
            // it as the trailing edge, or we've hit the `maxWait` limit.
            return (
                lastCallTime === undefined ||
                timeSinceLastCall >= wait ||
                timeSinceLastCall < 0 ||
                (maxing && timeSinceLastInvoke >= maxWait)
            );
        };

        const timerExpired = () => {
            const time = os.clock();

            if (shouldInvoke(time)) {
                return trailingEdge(time);
            }

            // Restart the timer.
            cancelTimeout = SetTimeout(timerExpired, remainingWait(time));
        };

        const trailingEdge = (time: number) => {
            cancelTimeout = undefined;

            // Only invoke if we have `lastArgs` which means `invoke` was
            // debounced at least once.
            if (trailing && lastArgs) {
                return invoke(time);
            }
            lastArgs = undefined;
            return result;
        };

        const cancel = () => {
            cancelTimeout?.();
            cancelTimeout = undefined;
            lastInvokeTime = 0;
            lastArgs = undefined;
            lastCallTime = 0;
        };

        const flush = () => {
            return cancelTimeout === undefined ? result : trailingEdge(os.clock());
        };

        const pending = () => {
            return cancelTimeout !== undefined;
        };

        const debounced = (...args: Parameters<T>) => {
            const time = os.clock();
            const isInvoking = shouldInvoke(time);

            lastArgs = args;
            lastCallTime = time;

            if (isInvoking) {
                if (cancelTimeout === undefined) {
                    return leadingEdge(lastCallTime);
                }
                if (maxing) {
                    // Handle invocations in a tight loop.
                    cancelTimeout = SetTimeout(timerExpired, wait);
                    return invoke(lastCallTime);
                }
            }
            if (cancelTimeout === undefined) {
                cancelTimeout = SetTimeout(timerExpired, wait);
            }
            return result;
        };

        return setmetatable(
		{ cancel, flush, pending },
		{ __call: (_, ...args) => debounced(...(args as Parameters<T>)) },
	) as unknown as Debounced<T>;
        
    } */

    /**
     * Calls a function every `interval` seconds until the countdown reaches 0.
     * Returns a promise that resolves when the countdown is over. Canceling the
     * promise will stop the countdown.
     * @param callback The callback to call every second.
     * @param countdown The countdown in seconds.
     * @param interval The interval in seconds.
     * @returns A promise that resolves when the countdown reaches 0.
     */
    export function SetCountdown(callback: (secondsLeft: number) => void, countdown: number, interval = 1) {
        // Note that 'index' here is 1-based
        return Promise.each(new Array(countdown, 0), (_, index) => {
            callback(countdown - (index - 1));
            return Promise.delay(interval);
        });
    }

    /**
     * Schedule a callback to be called every `interval` seconds. Returns a
     * function that can be called to stop the timer.
     * @param callback The callback to call every `interval` seconds.
     * @param interval The interval in seconds.
     * @returns A cleanup function.
     */
    export function SetInterval(callback: () => void, interval: number) {
        let timer = 0;

        const connection = RunService.Heartbeat.Connect((delta) => {
            timer += delta;

            if (timer >= interval) {
                timer = 0;
                callback();
            }
        });

        return () => connection.Disconnect();
    }

    /**
     * Schedule a callback to be called once after `timeout` seconds. Returns a
     * function that can be called to stop the timer.
     * @param callback The callback to call after `timeout` seconds.
     * @param timeout The timeout in seconds.
     * @returns A cleanup function.
     */
    export function SetTimeout(callback: () => void, timeout: number) {
        let timer = 0;

        const connection = RunService.Heartbeat.Connect((delta) => {
            timer += delta;

            if (timer >= timeout) {
                connection.Disconnect();
                callback();
            }
        });

        return () => connection.Disconnect();
    }


    /**
     * Creates a throttled function that only invokes `callback` at most once per
     * every `wait` seconds. The throttled function comes with a `cancel` method to
     * cancel delayed `callback` invocations and a `flush` method to immediately
     * invoke them.
     *
     * Provide `options` to indicate whether `callback` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `callback` is invoked
     * with the most recent arguments provided to the throttled function. Subsequent
     * calls to the throttled function return the result of the last `callback`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `callback` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `callback` invocation is deferred
     * until the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `throttle` and `debounce`.
     *
     * @param callback The function to throttle.
     * @param wait The number of seconds to throttle invocations to. Defaults to `0`.
     * @param options The options object.
     * @returns The new throttled function.
     * @see https://github.com/lodash/lodash/blob/master/throttle.js/
     * @see https://css-tricks.com/debouncing-throttling-explained-examples/
     */
    /* export function Throttle<T extends Callback>(callback: T, wait = 0, options: ThrottleOptions = {}) {
        const { leading = true, trailing = true } = options;

        return Debounce(callback, wait, {
            leading,
            trailing,
            maxWait: wait,
        });
    } */
}