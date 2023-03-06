class MedEntry {
    constructor(tokens,whichList,listType,matchTried = false, matchID = -1) {
        this.tokens = tokens;
        this.diffTokens = [];
        this.whichList = whichList;
        this.listType = listType;
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
        if (this.whichList==ListID.ref || this.whichList==ListID.outpatient) {
            return MedMatchStatus.removed;
        } else if (this.whichList==ListID.main || this.whichList==ListID.discharge) {
            return MedMatchStatus.added;
        } else if (this.whichList==ListID.inpatient) {
            return MedMatchStatus.removed;
        }
    }
}

const MedMatchStatus = {
    unmatched: "",
    completeMatch: "completeMatch",
    modified: "modified",
    added: "added",
    removed: "removed",
 }

 const ListID = {
    ref: "ref",
    main: "main",
    outpatient: "outpatient",
    inpatient: "inpatient",
    discharge: "discharge"
 }
 const ListType = {
    inp: "inp",
    out: "out",
    none: "none"
 }

