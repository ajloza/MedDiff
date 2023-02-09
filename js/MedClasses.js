class MedEntry {
    constructor(tokens,whichList,matchTried = false, matchID = -1) {
        this.tokens = tokens;
        this.diffTokens = [];
        this.whichList = whichList;
        this.matchTried = matchTried;
        this.matchID = matchID;
        this.completeMatch = false;
    }

    get matchStatus() {
        if (!this.matchTried) {
            return MedMatchStatus.unmatched;
        }
        if (this.completeMatch) {
            return MedMatchStatus.completeMatch
        }
        if (this.matchID != -1) {
            return MedMatchStatus.modified;
        }
        if (this.whichList==ListID.ref) {
            return MedMatchStatus.removed;
        } else if (this.whichList==ListID.main) {
            return MedMatchStatus.added;
        } 
    }
}

const MedMatchStatus = {
    unmatched: "",
    completeMatch: "completeMatch",
    modified: "modified",
    added: "added",
    removed: "removed"
 }

 const ListID = {
    ref: "ref",
    main: "main"
 }

