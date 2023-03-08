function colorizeModfiedTokens(tokens) {
    let str = "";
    let rem_str = "";
    let mod_flag = false;
    tokens.forEach(t => {
        if (t.added) {
            if (mod_flag) {
                str = str.concat(
                    " <span class='bg-lyellow' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='On Admission: ",
                    rem_str,
                    "'>",
                    t.value.join(" "),
                    "</span> "
                    );
                    rem_str = "";
                    mod_flag = false;
            } else {
                str = str.concat(" ","<span style='font-weight: bold;' class='bg-lgreen'>",t.value.join(" "),"</span>"," ");
            }
        }
        else if (t.removed) {
            rem_str = t.value.join(" ");
            mod_flag = true;
        } else {
            if (mod_flag) {
                str = str.concat(
                    " <span class='bg-lightred' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='",
                    rem_str,
                    "'>",
                    "&#215",
                    "</span> "
                    );
                    rem_str = "";
                    mod_flag = false;
                    str = str.concat(t.value.join(" "));
            } else {
                str = str.concat(t.value.join(" "));
            }
        }
    })

    if (mod_flag) {
        str = str.concat(
            "<span class='bg-lightred' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='",
            rem_str,
            "'>",
            "&#215",
            "</span>"
            );
    }
    return str;
}


function tooltipFallBack(display,tooltip) {

    let str = "";
    str = str.concat(
        " <span class='bg-lyellow' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='",
        tooltip.join(" "),
        "'>",
        display.join(" "),
        "</span> "
        );

    return str;

}

function activateTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

    // $("#diffList").hide();

$(document).ready(function(){
    
    activateTooltips();

    $('#demoBtn').click(function(){
        $("#outpatientText").val(getDemoOutpatient());
        $("#inpatientText").val(getDemoInpatient());
        $("#dischargeText").val(getDemoDischarge());
    });

    $('#compareBtn').click(function(){

        $('#matchedMedList').empty();
        $('#modifiedMedList').empty();
        $('#addedMedList').empty();
        $('#discontinuedMedList').empty();
        $('#inpatientOnlyMedList').empty();
        let [outpatientMedTokens,listTypeOutpatient] = parseText($("#outpatientText").val());
        let [inpatientMedTokens,listTypeInpatient] = parseText($("#inpatientText").val());
        let [dischargeMedTokens,listTypeDischarge] = parseText($("#dischargeText").val());

        // Since comparisons are mde from the med list need two of each
        // can rework API if this is an issue, i think list length makes this way ok
        // sub shows which comparison a list is for
        outpatientMeds_I = outpatientMedTokens.map(m => new MedEntry(m,ListID.outpatient,listTypeOutpatient));
        outpatientMeds_D = outpatientMedTokens.map(m => new MedEntry(m,ListID.outpatient,listTypeOutpatient));
        inpatientMeds_O = inpatientMedTokens.map(m => new MedEntry(m,ListID.inpatient,listTypeInpatient));
        inpatientMeds_D = inpatientMedTokens.map(m => new MedEntry(m,ListID.inpatient,listTypeInpatient));
        dischargeMeds_O = dischargeMedTokens.map(m => new MedEntry(m,ListID.discharge,listTypeDischarge));
        dischargeMeds_I = dischargeMedTokens.map(m => new MedEntry(m,ListID.discharge,listTypeDischarge));

        diffMedList(outpatientMeds_D,dischargeMeds_O);
        diffMedList(outpatientMeds_I,inpatientMeds_O);
        diffMedList(dischargeMeds_I,inpatientMeds_D);

        // 2 main classes of meds
        //  1. admit to discharge
        //      match -> inpatient match to dc, show x if not there i if there
        //      modified -> inpatient match to dc, show x if not there i if there
        //      added -> inpatient match to dc, show x if not there i if there
        //      removed -> inpatient match to admit, show x if not there i if there
        //  2. inpatient not on either 

        dischargeMeds_O.forEach((e,idx) => {
            if (e.matchStatus == MedMatchStatus.completeMatch) {
                let medstring = e.tokens.join(" ");
                let htmlstring = "";
                // if there is no inpatient match to this complete outpatient match
                if ( (dischargeMeds_I[idx].matchStatus != MedMatchStatus.completeMatch) && (dischargeMeds_I[idx].matchStatus != MedMatchStatus.modified)) {
                    htmlstring = [matchHead(),medstring,matchTailNoI()].join("");
                } else {
                    htmlstring = [matchHead(),medstring,matchTailI(inpatientMeds_D[dischargeMeds_I[idx].matchID])].join("");
                }
                $("#matchedMedList").append(htmlstring);
            }

            if (e.matchStatus == MedMatchStatus.added) {
                let medstring = e.tokens.join(" ");
                let htmlstring = "";
                if ( (dischargeMeds_I[idx].matchStatus != MedMatchStatus.completeMatch) && (dischargeMeds_I[idx].matchStatus != MedMatchStatus.modified)) {
                    htmlstring = [addedHead(),medstring,matchTailNoI()].join("");
                } else {
                    htmlstring = [addedHead(),medstring,matchTailI(inpatientMeds_D[dischargeMeds_I[idx].matchID])].join("");
                }
                $("#addedMedList").append(htmlstring);

            
            }

            if (e.matchStatus == MedMatchStatus.modified) {
                
                let medstring = colorizeModfiedTokens(e.diffTokens);
                let htmlstring = "";
                if ( (dischargeMeds_I[idx].matchStatus != MedMatchStatus.completeMatch) && (dischargeMeds_I[idx].matchStatus != MedMatchStatus.modified)) {
                    htmlstring = [modifiedHead(),medstring,matchTailNoI()].join("");
                } else {
                    htmlstring = [modifiedHead(),medstring,matchTailI(inpatientMeds_D[dischargeMeds_I[idx].matchID])].join("");
                }

                $("#modifiedMedList").append(htmlstring);
            }

            

        });

        outpatientMeds_D.forEach((e,idx) => {

            if (e.matchStatus == MedMatchStatus.removed) {
                let medstring = e.tokens.join(" ");
                let htmlstring = "";
                if ( (outpatientMeds_I[idx].matchStatus != MedMatchStatus.completeMatch) && (outpatientMeds_I[idx].matchStatus != MedMatchStatus.modified)) {
                    htmlstring = [discontinuedHead(),medstring,matchTailNoI()].join("");
                } else {
                    htmlstring = [discontinuedHead(),medstring,matchTailI(inpatientMeds_O[outpatientMeds_I[idx].matchID])].join("");
                }
                $("#discontinuedMedList").append(htmlstring);

            
            }
            

        });

        inpatientMeds_D.forEach((e,idx) => {

            if (e.matchStatus == MedMatchStatus.removed) {
                let medstring = e.tokens.join(" ");
                let htmlstring = [inpatientOnlyHead(),medstring,inpatientOnlyTail()].join("");
                $("#inpatientOnlyMedList").append(htmlstring);
            }
            

        });

        // refMeds.forEach(e => {
        // if (e.matchStatus == MedMatchStatus.removed) {
        //     let medstring = e.tokens.join(" ");
        //     let htmlstring = ["<li class='list-group-item bg-lightred'>",medstring,"</li>"].join("");
        //     $("#removed").append(htmlstring);
        // }

        activateTooltips();
        $("#comparisonPane").show();
        $("#backBtn").show();
        $("#inputPane").hide();
        $("#demoBtn").hide();
        $("#compareBtn").hide();
    });


    $('#backBtn').click(function(){
        $("#comparisonPane").hide();
        $("#backBtn").hide();
        $("#inputPane").show();
        $("#demoBtn").show();
        $("#compareBtn").show();
    });

});


function matchHead() {
    let str = "<tr class='d-flex'><td class = 'col-10 bg-lblue'>";
    return str
}

function addedHead() {
    let str = "<tr class='d-flex'><td class = 'col-10 bg-lgreen'>";
    return str
}

function modifiedHead() {
    let str = "<tr class='d-flex'><td class = 'col-10'>";
    return str
}

function discontinuedHead() {
    let str = "<tr class='d-flex'><td class = 'col-10 bg-lightred'>";
    return str
}

function inpatientOnlyHead() {
    let str = "<tr class='d-flex'><td class = 'col-12 bg-vlyellow'>";
    return str
}

function inpatientOnlyTail() {
    let str = "</td></tr>";
    return str
}


function matchTailNoI() {
    let str = "<td class = 'col-2 text-center'>"+
                "<span class='c-red' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='"+
                "No Matching Inpatient Medication"+"'>"+
                "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-x-square-fill' viewBox='0 0 16 16'><path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z'/></svg>"+
                "</span>"+
                "</td></tr>";

    return str
}

function matchTailI(matchMed) {
    let str =   "<td class = 'col-2 text-center'>"+
    "<span class='c-dyellow' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='"+
    matchMed.tokens.join(" ")+"'>"+
    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-prescription' viewBox='0 0 16 16'>    <path d='M5.5 6a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 1 0V9h.293l2 2-1.147 1.146a.5.5 0 0 0 .708.708L9 11.707l1.146 1.147a.5.5 0 0 0 .708-.708L9.707 11l1.147-1.146a.5.5 0 0 0-.708-.708L9 10.293 7.695 8.987A1.5 1.5 0 0 0 7.5 6h-2ZM6 7h1.5a.5.5 0 0 1 0 1H6V7Z'/>    <path d='M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 14.5V4a1 1 0 0 1-1-1V1Zm2 3v10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4H4ZM3 3h10V1H3v2Z'/>  </svg>"
    // "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-prescription2' viewBox='0 0 16 16'>    <path d='M7 6h2v2h2v2H9v2H7v-2H5V8h2V6Z'/>    <path d='M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 14.5V4a1 1 0 0 1-1-1V1Zm2 3v10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4H4ZM3 3h10V1H3v2Z'/>  </svg>"    
    // "<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-info-square-fill' viewBox='0 0 16 16'><path d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/></svg>"+
    "</span>"+
    "</td></tr>"
    return str
}




function getDemoOutpatient() {
    let str = "     Active Outpatient Medications                          Status\n"+
    "=========================================================================\n"+
    "1)   ATORVASTATIN CALCIUM 20MG TAB TAKE ONE TABLET BY       ACTIVE\n"+
    "       MOUTH EVERY EVENING FOR CHOLESTEROL\n"+
    "2)   EMPAGLIFLOZIN 25MG TAB TAKE ONE-HALF TABLET BY MOUTH   ACTIVE\n"+
    "       ONCE DAILY FOR DIABETES\n"+
    "3)   FINASTERIDE 5MG TAB TAKE ONE TABLET BY MOUTH ONCE      ACTIVE\n"+
    "       DAILY FOR PROSTATE\n"+
    "4)   FOLIC ACID 1MG TAB TAKE ONE TABLET BY MOUTH EVERY      ACTIVE (S)\n"+
    "       MORNING / NUTRITIONAL SUPPLEMENT\n"+
    "5)   MELATONIN 3MG CAP/TAB TAKE 3 TABLETS(9 MG) BY MOUTH    ACTIVE\n"+
    "       AT BEDTIME FOR SLEEP\n"+
    "6)   METOPROLOL SUCCINATE 25MG SA TAB TAKE ONE-HALF TABLET  ACTIVE\n"+
    "       BY MOUTH EVERY EVENING FOR BLOOD PRESSURE/HEART\n"+
    "7)  PSYLLIUM ORAL PWD MIX 1 TEASPOONFUL BY MOUTH ONCE      ACTIVE\n"+
    "       DAILY AS NEEDED FOR CONSTIPATION (MIX WITH 8 OUNCES\n"+
    "       OF WATER OR OTHER COOL LIQUID AND DRINK)\n"+
    "8)  RIVAROXABAN 20MG TAB TAKE ONE TABLET BY MOUTH EVERY    ACTIVE\n"+
    "       EVENING WITH EVENING MEAL"
    return str
}

function getDemoDischarge() {
    let str = "     Active Outpatient Medications                          Status\n"+
    "=========================================================================\n"+
    "1)   ATORVASTATIN CALCIUM 80MG TAB TAKE ONE TABLET BY       ACTIVE\n"+
    "       MOUTH EVERY EVENING FOR CHOLESTEROL\n"+
    "2)   CLOPIDOGREL BISULFATE 75MG TAB TAKE ONE TABLET BY      ACTIVE\n"+
    "       MOUTH ONCE DAILY\n"+
    "3)   EMPAGLIFLOZIN 25MG TAB TAKE ONE-HALF TABLET BY MOUTH   ACTIVE\n"+
    "       ONCE DAILY FOR DIABETES\n"+
    "4)   EZETIMIBE 10MG TAB TAKE ONE TABLET BY MOUTH ONCE       ACTIVE\n"+
    "       DAILY FOR CHOLESTEROL\n"+
    "5)   FINASTERIDE 5MG TAB TAKE ONE TABLET BY MOUTH ONCE      ACTIVE\n"+
    "       DAILY FOR PROSTATE\n"+
    "6)   FOLIC ACID 1MG TAB TAKE ONE TABLET BY MOUTH EVERY      ACTIVE (S)\n"+
    "       MORNING / NUTRITIONAL SUPPLEMENT\n"+
    "7)   MELATONIN 3MG CAP/TAB TAKE 3 TABLETS(9 MG) BY MOUTH    ACTIVE\n"+
    "       AT BEDTIME FOR SLEEP\n"+
    "8)   METOPROLOL SUCCINATE 50MG SA TAB TAKE ONE-HALF TABLET  ACTIVE\n"+
    "       BY MOUTH EVERY EVENING FOR BLOOD PRESSURE/HEART"
    return str
}

function getDemoInpatient() {
    let str = "     Active Inpatient Medications                           Status\n"+
"=========================================================\n"+
"1)   ATORVASTATIN TAB  80MG PO QPM ACTIVE\n"+
"2)   CLOPIDOGREL BISULFATE TAB  75MG PO DAILY               ACTIVE\n"+
"3)   FAMOTIDINE TAB  20MG PO DAILY                          ACTIVE\n"+
"4)   EMPAGLIFLOZIN TAB,ORAL  12.5MG PO DAILY                ACTIVE \n"+
"5)  METOPROLOL SUCCINATE (EXTENDED-RELEASE)  25MG PO     ACTIVE \n"+
"       DAILY(EVENING)\n"+
"6)   METFORMIN TAB 500MG PO BID"

return str
}