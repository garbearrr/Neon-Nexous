export class Util {
    static EndsWith(str: string, suffix: string): boolean {
        return str.sub(-suffix.size(), str.size()) === suffix;
    }
    /**
     * Linear interpolation between two values
     * @param a 
     * @param b 
     * @param t Between 0 and 1
     * @returns 
     */
    static Lerp(a: number, b: number, t: number): number {
        return a + (b - a) * math.clamp(t, 0, 1);
    }

    static ToFixed(num: number, fixed: number): number {
        const fixedMultiplier = 10 ** fixed;
        return math.floor(num * fixedMultiplier) / fixedMultiplier;
    }

    static Slice<T extends defined>(array: T[], start: number, ending: number): T[] {
        const newArray: T[] = [];
        for (let i = start; i < ending; i++) {
            newArray.push(array[i]);
        }
        return newArray;
    };

    
    static SplitArray<T extends defined>(arr: T[], chunkSize: number): T[][] {
        const result: T[][] = [];
        
        for (let i = 0; i < arr.size(); i += chunkSize) {
            const chunk = Util.Slice<T>(arr, i, i + chunkSize);
            result.push(chunk);
        }
    
        return result;
    }

    /**
     * Inverse linear interpolation between two values
     * @param a 
     * @param b 
     * @param t 
     * @returns 
     */
    static UnLerp(a: number, b: number, t: number): number {
        return (t - a) / (b - a);
    }
}

export namespace NewUtil {
    export namespace Array {
        export function Concat<T extends defined>(...arrays: T[][]): T[] {
            const newArray: T[] = [];
            for (const array of arrays) {
                for (const item of array) {
                    newArray.push(item);
                }
            }
            return newArray;
        }

        export function Insert<T extends defined>(array: T[], index: number, ...items: T[]): T[] {
            const newArray: T[] = [];
            for (let i = 0; i < array.size(); i++) {
                if (i === index) {
                    for (const item of items) {
                        newArray.push(item);
                    }
                }
                newArray.push(array[i]);
            }
            return newArray;
        }

        export function Slice<T extends defined>(array: T[], start: number, ending: number): T[] {
            const newArray: T[] = [];
            for (let i = start; i < ending; i++) {
                newArray.push(array[i]);
            }
            return newArray;
        };

        export function Splice<T extends defined>(array: T[], start: number, deleteCount: number, ...items: T[]): T[] {
            const newArray: T[] = [];
            for (let i = 0; i < array.size(); i++) {
                if (i >= start && i < start + deleteCount) {
                    continue;
                }
                newArray.push(array[i]);
            }
            return Concat(newArray, items);
        }
    }
}