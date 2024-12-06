import Object from "@rbxts/object-utils";
import { Collection } from "../Collection/Collection";

export class BigNumber implements iBigNumber {
    protected mantissa = 0;
    protected exponent = 0;

    public static readonly ToFixedPrecision = 3;

    constructor(value: number | string | BigNumber) {
        if (value instanceof BigNumber) {
            this.mantissa = value.mantissa;
            this.exponent = value.exponent;
        } else if (typeOf(value) === "number") {
            this.FromNumber(value as number);
        } else if (typeOf(value) === "string") {
            (tonumber(value) !== undefined) 
                ? this.FromNumber(tonumber(value)!) 
                : this.FromString(value as string);
        } else {
            throw `Invalid input type for BigNumber: ${typeOf(value)}`;
        }
    }

    public Clone(): BigNumber {
        return new BigNumberAltConstructor(this.mantissa, this.exponent);
    }

    private Compare(other: BigNumber): number {
        if (this.exponent !== other.GetExponent()) {
            return this.exponent > other.GetExponent() ? 1 : -1;
        }
        if (this.mantissa !== other.GetMantissa()) {
            return this.mantissa > other.GetMantissa() ? 1 : -1;
        }
        return 0;
    }

    private FromNumber(value: number) {
        if (value === 0) {
            this.mantissa = 0;
            this.exponent = 0;
            return;
        }
        const exp = math.floor(math.log10(math.abs(value)));
        const man = value / 10 ** exp;

        this.mantissa = man;
        this.exponent = exp;
    }

    private FromString(value: string) {
        // Remove commas and spaces
        value = value.gsub("[,%s]", "")[0];
    
        // Define the patterns to match mantissa with suffix or mantissa with exponent
        const SuffixPattern = "^([+-]?%d*%.?%d+)([a-zA-Z]+)$";      // mantissa , suffix
        const ExponentPattern = "^([+-]?%d*%.?%d+)([eE][+-]?%d+)$"; // mantissa , exponent
    
        // Attempt to match the suffix pattern first
        const resultSuffix = value.match(SuffixPattern);
        // If suffix pattern doesn't match, try the exponent pattern
        const resultExponent = resultSuffix ? undefined : value.match(ExponentPattern);
    
        // Handle suffix pattern match
        if (resultSuffix) {
            const mantissaStr = resultSuffix[0];
            const suffixStr = resultSuffix[1] as string;
    
            // Parse the mantissa
            const mantissa = tonumber(mantissaStr);
            if (mantissa === undefined) {
                throw `Invalid mantissa in BigNumber FromString: "${mantissaStr}"`;
            }
    
            let exponent = 0;
    
            // Parse the suffix abbreviation if it exists
            if (suffixStr && suffixStr !== "") {
                const abbrExponent = this.GetExponentFromAbbreviation(suffixStr.lower());
                if (abbrExponent === undefined) {
                    throw `Invalid suffix abbreviation in BigNumber FromString: "${suffixStr}"`;
                }
                exponent += abbrExponent;
            }
    
            // Set the mantissa and exponent of the BigNumber
            this.mantissa = mantissa;
            this.exponent = exponent;
    
            // Normalize the mantissa and exponent
            const normalized = this.Normalize(this.mantissa, this.exponent);
            this.mantissa = normalized.mantissa;
            this.exponent = normalized.exponent;
    
        }
        // Handle exponent pattern match
        else if (resultExponent) {
            const mantissaStr = resultExponent[0];
            const exponentStr = resultExponent[1] as string;
    
            // Parse the mantissa
            const mantissa = tonumber(mantissaStr);
            if (mantissa === undefined) {
                throw `Invalid mantissa in BigNumber FromString: "${mantissaStr}"`;
            }
    
            let exponent = 0;
    
            // Parse the exponent part
            if (exponentStr) {
                // Remove the 'e' or 'E' from the exponent string
                const expValueStr = exponentStr.sub(2);
                const expValue = tonumber(expValueStr);
                if (expValue === undefined) {
                    throw `Invalid exponent in BigNumber FromString: "${exponentStr}"`;
                }
                exponent += expValue;
            }
    
            // Set the mantissa and exponent of the BigNumber
            this.mantissa = mantissa;
            this.exponent = exponent;
    
            // Normalize the mantissa and exponent
            const normalized = this.Normalize(this.mantissa, this.exponent);
            this.mantissa = normalized.mantissa;
            this.exponent = normalized.exponent;
        }
        // If neither pattern matches, throw an error
        else {
            throw `Invalid string format for BigNumber: "${value}"`;
        }
    }
    
    
       

    public IsNegative(): boolean {
        return this.mantissa < 0;
    }

    public GetExponent(): number {
        return this.exponent;
    }

    public GetMantissa(): number {
        return this.mantissa;
    }

    private GetExponentFromAbbreviation(abbr: string): number | undefined {
        const abbreviations: { [abbr: string]: number } = {
            k: 3,
            K: 3,
            m: 6,
            M: 6,
            b: 9,
            B: 9,
            t: 12,
            qa: 15,
            qi: 18,
            sx: 21,
            sp: 24,
            oc: 27,
            no: 30,
            dc: 33,
            ud: 36,
            dd: 39,
            td: 42,
            qad: 45,
            qid: 48,
            sxd: 51,
            spd: 54,
            ocd: 57,
            nod: 60,
            vg: 63,
            uvg: 66,
            dvg: 69,
        };

        return abbreviations[abbr];
    }

    private GetAbbreviationFromExponent(exp: number): string {
        const abbreviations: { [exp: number]: string } = {
            0: '',
            3: 'K',
            6: 'M',
            9: 'B',
            12: 'T',
            15: 'Qa',
            18: 'Qi',
            21: 'Sx',
            24: 'Sp',
            27: 'Oc',
            30: 'No',
            33: 'Dc',
            36: 'Ud',
            39: 'Dd',
            42: 'Td',
            45: 'Qad',
            48: 'Qid',
            51: 'Sxd',
            54: 'Spd',
            57: 'Ocd',
            60: 'Nod',
            63: 'Vg',
            66: 'Uvg',
            69: 'Dvg',
        };

        const selectedExponent = math.floor(exp / 3) * 3;

        return abbreviations[selectedExponent] ?? `e${exp}`;
    }

    private Normalize(mantissa: number, exponent: number): { mantissa: number; exponent: number } {
        if (mantissa === 0) {
            return { mantissa: 0, exponent: 0 };
        }

        const expAdjustment = math.floor(math.log10(math.abs(mantissa)));
        mantissa = mantissa / 10 ** expAdjustment;
        exponent = exponent + expAdjustment;

        return { mantissa, exponent };
    }

    public Add(other: BigNumber): BigNumber {
        const expDiff = this.exponent - other.GetExponent();
        let newMantissa: number;
        let newExponent: number;

        if (expDiff === 0) {
            newMantissa = this.mantissa + other.GetMantissa();
            newExponent = this.exponent;
        } else if (expDiff > 0) {
            newMantissa = this.mantissa + other.GetMantissa() * 10 ** -expDiff;
            newExponent = this.exponent;
        } else {
            newMantissa = this.mantissa * 10 ** expDiff + other.GetMantissa();
            newExponent = other.GetExponent();
        }

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public Subtract(other: BigNumber): BigNumber {
        const expDiff = this.exponent - other.GetExponent();
        let newMantissa: number;
        let newExponent: number;

        if (expDiff === 0) {
            newMantissa = this.mantissa - other.GetMantissa();
            newExponent = this.exponent;
        } else if (expDiff > 0) {
            newMantissa = this.mantissa - other.GetMantissa() * 10 ** -expDiff;
            newExponent = this.exponent;
        } else {
            newMantissa = this.mantissa * 10 ** expDiff - other.GetMantissa();
            newExponent = other.GetExponent();
        }

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public Multiply(other: BigNumber): BigNumber {
        const newMantissa = this.mantissa * other.GetMantissa();
        const newExponent = this.exponent + other.GetExponent();

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public Divide(other: BigNumber): BigNumber {
        const newMantissa = this.mantissa / other.GetMantissa();
        const newExponent = this.exponent - other.GetExponent();

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public IsEqualTo(other: BigNumber): boolean {
        return this.Compare(other) === 0;
    }

    public IsNotEqualTo(other: BigNumber): boolean {
        return this.Compare(other) !== 0;
    }

    public IsGreaterThan(other: BigNumber): boolean {
        return this.Compare(other) > 0;
    }

    public IsGreaterThanOrEqualTo(other: BigNumber): boolean {
        return this.Compare(other) >= 0;
    }

    public IsLessThan(other: BigNumber): boolean {
        return this.Compare(other) < 0;
    }

    public IsLessThanOrEqualTo(other: BigNumber): boolean {
        return this.Compare(other) <= 0;
    }

    public ToString(): string {
        if (this.mantissa === 0) {
            return "0";
        }
        return `${BigNumber.ToFixed(this.mantissa, BigNumber.ToFixedPrecision)}e${this.exponent}`;
    }

    public ToNumber(): number {
        return this.mantissa * 10 ** this.exponent;
    }

    public GetAbbreviation(): string {
        return this.GetAbbreviationFromExponent(this.exponent);
    }

    public ToAbbreviatedString(noAbbrev = false, decimalPlaces = BigNumber.ToFixedPrecision): string {
        if (this.mantissa === 0) {
            return "0";
        }

        const abbrExponent = math.floor(this.exponent / 3) * 3;
        const abbreviation = this.GetAbbreviationFromExponent(this.exponent);
        const scaledMantissa = this.mantissa * 10 ** (this.exponent - abbrExponent);
        const formattedMantissa = BigNumber.ToFixed(scaledMantissa, decimalPlaces);

        if (noAbbrev || this.exponent < 3) {
            return BigNumber.ToFixed(this.ToNumber(), decimalPlaces, false);
        }

        return `${formattedMantissa}${abbreviation}`;
    }

    public static ToFixed(num: number, decimalPlaces: number, removeTrailingZeros = true): string {
        if (num % 1 === 0) {
            // Number is an integer, return as is
            return tostring(num);
        }

        // Use string.format to format the number with the specified decimal places
        let result = string.format(`%.${decimalPlaces}f`, num);

        if (removeTrailingZeros) {
            // Remove trailing zeros after the decimal point
            result = result.gsub("(%d%.%d*[1-9])0*$", "%1")[0]; // Match digits followed by zeros after the decimal point
            // Remove the decimal point if there are no digits after it
            result = result.gsub("(%d+)%.0*$", "%1")[0];
        }

        return result;
    }
}

export class BigNumberAltConstructor extends BigNumber {
    constructor(mantissa: number, exponent: number) {
        super(0);
        this.mantissa = mantissa;
        this.exponent = exponent;
    }
}
