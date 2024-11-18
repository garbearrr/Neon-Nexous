export class BigNumber implements iBigNumber {
    protected mantissa: number = 0;
    protected exponent: number = 0;

    public static readonly ToFixedPrecision = 3;

    constructor(value: number | string | BigNumber) {
        if (value instanceof BigNumber) {
            this.mantissa = value.mantissa;
            this.exponent = value.exponent;
        } else if (typeOf(value) === "number") {
            this.FromNumber(value as number);
        } else if (typeOf(value) === "string") {
            this.FromString(value as string);
        } else {
            throw `Invalid input type for BigNumber: ${typeOf(value)}`;
        }
    }

    public Clone(): BigNumber {
        return new BigNumberAltConstructor(this.mantissa, this.exponent);
    }

    private Compare(other: BigNumber): number {
        // Compare exponents first
        if (this.exponent > other.exponent) {
            return 1;
        } else if (this.exponent < other.exponent) {
            return -1;
        }
    
        // If exponents are the same, compare mantissas
        if (this.mantissa > other.mantissa) {
            return 1;
        } else if (this.mantissa < other.mantissa) {
            return -1;
        }
    
        // Both mantissa and exponent are equal
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
        value = value.gsub(",", "")[0].gsub(" ", "")[0];

        const numberValue = tonumber(value);
        if (numberValue !== undefined) {
            this.FromNumber(numberValue);
            return;
        }

        // Handle abbreviations (e.g., "1.23K")
        const pattern = "([%d%.]+)(%a+)";
        const match = value.match(pattern);
        if (match) {
            const numPart = match[1];
            const abbr = match[2];

            const numValue = tonumber(numPart);
            if (numValue !== undefined) {
                const exp = this.GetExponentFromAbbreviation(abbr as string);
                if (exp !== undefined) {
                    this.mantissa = numValue;
                    this.exponent = exp;
                    return;
                }
            }
        }

        throw `Invalid string format for BigNumber: ${value}`;
    }

    public GetExponent(): number {
        return this.exponent;
    }

    public GetMantissa(): number {
        return this.mantissa;
    }

    private GetExponentFromAbbreviation(abbr: string): number | undefined {
        const abbreviations: { [abbr: string]: number } = {
            K: 3,
            M: 6,
            B: 9,
            T: 12,
            Qa: 15,
            Qi: 18,
            Sx: 21,
            Sp: 24,
            Oc: 27,
            No: 30,
            Dc: 33,
            Ud: 36,
            Dd: 39,
            Td: 42,
            Qad: 45,
            Qid: 48,
            Sxd: 51,
            Spd: 54,
            Ocd: 57,
            Nod: 60,
            Vg: 63,
            Uvg: 66,
            Dvg: 69,
            // Add more abbreviations as needed
        };

        return abbreviations[abbr];
    }

    private GetAbbreviationFromExponent(exp: number): string | undefined {
        const abbreviations: { [exp: number]: string } = {
            0: ' ',
            1: ' ',
            2: ' ',
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
            // Add more abbreviations as needed
        };

        return abbreviations[exp];
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
        const expDiff = this.exponent - other.exponent;
        let newMantissa: number;
        let newExponent: number;

        if (expDiff === 0) {
            newMantissa = this.mantissa + other.mantissa;
            newExponent = this.exponent;
        } else if (expDiff > 0) {
            newMantissa = this.mantissa + other.mantissa * 10 ** -expDiff;
            newExponent = this.exponent;
        } else {
            newMantissa = this.mantissa * 10 ** expDiff + other.mantissa;
            newExponent = other.exponent;
        }

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public Subtract(other: BigNumber): BigNumber {
        const expDiff = this.exponent - other.exponent;
        let newMantissa: number;
        let newExponent: number;

        if (expDiff === 0) {
            newMantissa = this.mantissa - other.mantissa;
            newExponent = this.exponent;
        } else if (expDiff > 0) {
            newMantissa = this.mantissa - other.mantissa * 10 ** -expDiff;
            newExponent = this.exponent;
        } else {
            newMantissa = this.mantissa * 10 ** expDiff - other.mantissa;
            newExponent = other.exponent;
        }

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public Multiply(other: BigNumber): BigNumber {
        const newMantissa = this.mantissa * other.mantissa;
        const newExponent = this.exponent + other.exponent;

        const normalized = this.Normalize(newMantissa, newExponent);
        return new BigNumberAltConstructor(normalized.mantissa, normalized.exponent);
    }

    public Divide(other: BigNumber): BigNumber {
        const newMantissa = this.mantissa / other.mantissa;
        const newExponent = this.exponent - other.exponent;

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

    public GetAbbreviation(): string {
        if (this.exponent < 3) return "";
        return this.GetAbbreviationFromExponent(this.exponent) || `e${this.exponent}`;
    }

    public ToString(): string {
        return `${this.mantissa}e${this.exponent}`;
    }

    public ToNumber(): number {
        return this.mantissa * 10 ** this.exponent;
    }

    public ToAbbreviatedString(noAbbrev: boolean = false, decimalPlaces: number = BigNumber.ToFixedPrecision): string {
        const abbrExponent = math.floor(this.exponent / 3) * 3;
        const abbreviation = this.GetAbbreviationFromExponent(abbrExponent);
        const scaledMantissa = this.mantissa * 10 ** (this.exponent - abbrExponent);

        if (noAbbrev) {
            return BigNumber.ToFixed(scaledMantissa, decimalPlaces);
        }
    
        if (abbreviation) {
            return `${BigNumber.ToFixed(scaledMantissa, decimalPlaces)}${abbreviation}`;
        } else {
            // If no abbreviation, format in scientific notation
            return this.ToString();
        }
    }

    public static ToFixed(num: number, decimalPlaces: number, removeTrailingZeros: boolean = true): string {
        const factor = math.pow(10, decimalPlaces);
        const rounded = math.floor(num * factor + 0.5) / factor;
    
        let result = string.format("%." + decimalPlaces + "f", rounded);
    
        if (removeTrailingZeros) {
            // Remove trailing zeros and the decimal point if necessary
            result = result.gsub("0+$", "")[0]; // Remove trailing zeros
            result = result.gsub("%.$", "")[0]; // Remove the decimal point if no decimals remain
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
