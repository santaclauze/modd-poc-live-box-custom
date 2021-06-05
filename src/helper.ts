export const toPercent: (partial: number, total: number) => number = (partial: number, total: number) =>
    (partial / total * 100);


export function trackMouseDrag(
    initEvent: MouseEvent,
    // eslint-disable-next-line no-unused-vars
    onMove: (
        moveX: number,
        number: number,
        object: { shift: boolean, ctrl: boolean, alt: boolean  }
    ) => void,
    // eslint-disable-next-line no-unused-vars
    onDone: (moveX: number, number: number) => void,
) {
    function mouseMove(e: MouseEvent) {
        onMove(
            e.pageX - initEvent.pageX,
            e.pageY - initEvent.pageY,
            { shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey }
        );
    }
    function mouseUp(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('mousemove', mouseMove);
        onDone(e.pageX - initEvent.pageX, e.pageY - initEvent.pageY);
        return false;
    }
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}