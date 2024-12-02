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

        // Match patterns like "1.23K", "5e9", "1.2e+3", "-1.2K"
        const pattern = "^([+-]?%d*%.?%d+)([eE]([+-]?%d+))?([a-zA-Z]*)$";
        const match = string.match(value, pattern);

        if (match) {
            const numPart = match[1];
            const exponentPart = match[3];
            const abbr = match[4] as string;

            let numValue = tonumber(numPart);
            if (numValue !== undefined) {
                let exp = 0;

                if (exponentPart) {
                    exp += tonumber(exponentPart)!;
                }
                if (abbr !== "") {
                    const abbrExp = this.GetExponentFromAbbreviation(abbr);
                    if (abbrExp !== undefined) {
                        exp += abbrExp;
                    } else {
                        throw `Unknown abbreviation: ${abbr}`;
                    }
                }
                this.mantissa = numValue;
                this.exponent = exp;
                const normalized = this.Normalize(this.mantissa, this.exponent);
                this.mantissa = normalized.mantissa;
                this.exponent = normalized.exponent;
                return;
            }
        }

        throw `Invalid string format for BigNumber: ${value}`;
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
        return this.GetAbbreviationFromExponent(this.exponent) || `e${this.exponent}`;
    }

    public ToAbbreviatedString(noAbbrev = false, decimalPlaces = BigNumber.ToFixedPrecision): string {
        if (this.mantissa === 0) {
            return "0";
        }

        const abbrExponent = math.floor(this.exponent / 3) * 3;
        const abbreviation = this.GetAbbreviationFromExponent(abbrExponent) || `e${abbrExponent}`;
        const scaledMantissa = this.mantissa * 10 ** (this.exponent - abbrExponent);
        const formattedMantissa = BigNumber.ToFixed(scaledMantissa, decimalPlaces);

        if (noAbbrev || this.exponent < 3) {
            return BigNumber.ToFixed(this.ToNumber(), decimalPlaces, false);
        }

        return `${formattedMantissa}${abbreviation}`;
    }

    // TODO: removeTrailingZeros removes zeros before the decimal point
    public static ToFixed(num: number, decimalPlaces: number, removeTrailingZeros = true): string {
        let result = string.format(`%.${decimalPlaces}f`, num);

        if (removeTrailingZeros) {
            result = result.gsub("(%d)0+$", "%1")[0]; // Remove trailing zeros
            result = result.gsub("%.$", "")[0];        // Remove trailing decimal point
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
