export type PaddingSizeUpdate = {
    size: [number, number, number, number],
    unit: { x: 'px'|'%', y: 'px'|'%'}
}

export type CustomPadding = {
    customPad: {
        s: [number, number, number, number],
        m: [number, number, number, number],
        l: [number, number, number, number]
    },
}