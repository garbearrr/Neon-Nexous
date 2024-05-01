
export const moduleGet = <T>(state: T) => {
    return <K extends keyof T>(key: K): Readonly<T[K]> => {
        return state[key] as Readonly<T[K]>;
    };
};