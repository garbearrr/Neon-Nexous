
interface ItemCategoriesType {
    [key: string]: string
}

type PossibleItems =
    Workspace["Items"]["Droppers"]["10000"] |
    Workspace["Items"]["Furnaces"]["20000"] |
    Workspace["Items"]["Upgraders"]["40000"] |
    Workspace["Items"]["Conveyors"]["30000"]