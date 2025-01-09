import textStrings from "../text.json"

const
    /** Select element */
    select = (className: string) => document.querySelector(className) as any,
    /** Select element array */ // @ts-ignore
    selectAll = (className: string) => document.querySelectorAll(className) as any[],
    /** Select element */
    selectChild = (className: string, parent: any) => parent.querySelector(className) as any,
    /** Select element array */ // @ts-ignore
    selectAllChild = (className: string, parent: any) => parent.querySelectorAll(className) as any[],
    /** repeat elements */
    repeat = (
        targetNum: number,
        parent: any,
        children: any[],
    ) => {
        if (targetNum == 0) targetNum = 1;
        const len = children?.length || 0;
        if (children)
            if (targetNum > len) {
                for (let i = len; i < targetNum; i++) {
                    parent.appendChild(children[0].cloneNode(1));
                };
            } else if (targetNum < len && targetNum != 0) {
                for (let i = targetNum; i < len; i++) {
                    children[i].remove();
                };
            };
    }

export {
    select,
    selectAll,
    selectChild,
    selectAllChild,
    repeat,
    textStrings
}