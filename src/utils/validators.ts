export const checkIfArrayHasNElements = (
    val: Array<string>, numberOfElements: number) => {
        if (val.length !== numberOfElements) {
            return false;
        }
        for (let i = 0; i < val.length; i++) {
            if (!checkIfExists(val[i])) return false;
        }
        return true;
}

export const checkIfExists = (val: string | undefined) => {
    if (val === null) return false;
    if (val === undefined) return false;
    if (val === "") return false;
    return true;
}

export const checkIfValidEmail = (val: string) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val.toLowerCase());
}

export const checkIfValidNumber = (val: number) => {
    if (val) {
        if (isNaN(val)) return false;
        return true;
    }
    return false;
}