

export const isContains = (str1, str2) => {
    const lowercasestr1 = str1.toLowerCase();
    const lowercasestr2 = str2.toLowerCase();
    return lowercasestr1.indexOf(lowercasestr2) > -1;
}