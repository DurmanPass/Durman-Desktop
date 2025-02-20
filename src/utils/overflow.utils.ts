export function deleteOverflowWindow(){
    document.body.style.overflow = 'hidden';
    document.body.style.margin = "0px";
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.margin = "0px";
}

export function deleteMarginWindow(){
    document.body.style.margin = "0px";
    document.documentElement.style.margin = "0px";
}