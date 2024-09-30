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