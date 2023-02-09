function diffMedList(l,r) {

    // create the diff of the lists by best matching:
    //      - unmatched L is removed
    //      - unmatched R is added
    //      - perfect match is completeMatch
    //      - partial match is modified
    // first-best L,R pair from L perspective counts as match
    // modifies lists:
    //      matchID will be index of item in other list which is the best match, if not match will be -1
    //      matchTried will true for all items after this function is called
    //      completeMatch will be true if all tokens match
    //      diffTokens added for partial matches

    // iterate through all l entries, trying to match to r entries. find best r match
    for (let i = 0; i < l.length; i++) {
        let best_match = 0;
        let match_idx = -1; // the r index that the current l matched to
        for (let j = 0; j < r.length; j++) {
            const r_el = r[j];
            const l_el = l[i];
            let still_match = true;
            let k = 0;
            let cur_match = 0;
            while (still_match && k < r_el.tokens.length && k < l_el.tokens.length) {
                if (l_el.tokens[k] == r_el.tokens[k]) {
                    cur_match++;
                    if (match_idx == -1) {
                        match_idx = j;
                        match_idx_r = i;
                    }
                } else {
                    still_match = false;
                }
                k++;
            }
            if (cur_match > best_match) {
                best_match = cur_match;
                match_idx = j;
            }
        }

        // have tried to match l to all of r, so we have the real best match from l -> r
        // if no match occured, match idx still -1 so don't update
        if (match_idx != -1) {
            l[i].matchID = match_idx;
            r[match_idx].matchID = i;
        }
        // special case where there is an exact match
        if (best_match == l[i].tokens.length && best_match == r[match_idx].tokens.length) {
            l[i].completeMatch = true;
            r[match_idx].completeMatch = true;
        }
        l[i].matchTried = true;
    }

    // switch the flag for r entries to show that match was tried
    r.forEach(e => {
        e.matchTried = true;
    });

    // do the token diffing for the substitution
    r.forEach( e => {
        if (e.matchStatus == MedMatchStatus.modified) {
            e.diffTokens = Diff.diffArrays(l[e.matchID].tokens,e.tokens);
        }
    });
}
