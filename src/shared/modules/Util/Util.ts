export class Util {
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