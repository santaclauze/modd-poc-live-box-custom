export const toPercent: (partial: number, total: number) => string = (partial: number, total: number) =>
    (partial / total * 100).toPrecision(3);
