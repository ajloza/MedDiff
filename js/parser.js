function parseText(text,fmt="VA") {

    let medStrings = getMedStrings(text,fmt=fmt);
    let medTokens = medStringsToTokens(medStrings);
    return medTokens;

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
    // text = text.map(t => t.replaceAll(ws," "));
    text = text.map(t => t.trim());
    text = text.filter(t => t );

    return text;

}