function parseText(text,fmt="VA") {
    let listType = getListType(text);
    let medStrings = getMedStrings(text,fmt=fmt);
    let medTokens = medStringsToTokens(medStrings);
    return [medTokens,listType];

}

function getListType(text) {

    let listType = ListType.none;

    if (text.match(/Outpatient Med/)!==null){
        listType = ListType.out;
    } else if (text.match(/Inpatient Med/)!==null) {
        listType = ListType.inp;
    }

    return listType;
}

function medStringsToTokens(strings) {
    let tokens = strings.map(s => s.split(" ").filter(t => t));
    return tokens;
}

function getMedStrings(text,fmt="VA") {
    // takes block of text and parses into strings according to fmt specification
    // returns list of these strings

    // strip the header if it exists
    if (text.match(/=+/)!==null){
        let bodyRegEx = /=+((.|\n)*)/;
        text = text.match(bodyRegEx)[1];
    }
    const ws = /\n/g;
    const extraWords = /ACTIVE/g;
   
    text = text.replaceAll(extraWords,"");
    // split on the numbers
    text = text.split(/^\s*[0-9]+\)|\n\s*[0-9]+\)/);
    text = text.map(t => t.trim());
    text = text.filter(t => t );

    return text;

}