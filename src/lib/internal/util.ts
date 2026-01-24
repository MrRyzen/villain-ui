export const arrayHasValueInArray = <T>(arr: T[] | undefined, values: T[]): boolean => {
    if (!arr) return false;
    return values.some(value => arr.includes(value));
}