
interface iBigNumber {
    Add(other: iBigNumber): iBigNumber;
    Subtract(other: iBigNumber): iBigNumber;
    Multiply(other: iBigNumber): iBigNumber;
    Divide(other: iBigNumber): iBigNumber;
    GetAbbreviation(): string;
    ToString(): string;
    ToAbbreviatedString(noAbbrev?: boolean, decimalPlaces?: number): string;
}