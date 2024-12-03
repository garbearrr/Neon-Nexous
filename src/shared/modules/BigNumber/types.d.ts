
interface iBigNumber {
    Add(other: iBigNumber): iBigNumber;
    Clone(): iBigNumber;
    Divide(other: iBigNumber): iBigNumber;
    GetAbbreviation(): string;
    GetExponent(): number;
    GetMantissa(): number;
    IsEqualTo(other: iBigNumber): boolean;
    IsGreaterThan(other: iBigNumber): boolean;
    IsGreaterThanOrEqualTo(other: iBigNumber): boolean;
    IsLessThan(other: iBigNumber): boolean;
    IsLessThanOrEqualTo(other: iBigNumber): boolean;
    IsNegative(): boolean;
    IsNotEqualTo(other: iBigNumber): boolean;
    Multiply(other: iBigNumber): iBigNumber;
    Subtract(other: iBigNumber): iBigNumber;
    ToAbbreviatedString(noAbbrev?: boolean, decimalPlaces?: number): string;
    ToNumber(): number;
    ToString(): string;
}