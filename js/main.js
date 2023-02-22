function colorizeModfiedTokens(tokens) {
    let str = "";
    let rem_str = "";
    let mod_flag = false;
    tokens.forEach(t => {
        if (t.added) {
            if (mod_flag) {
                str = str.concat(
                    "<span class='bg-lyellow' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='",
                    rem_str,
                    "'> ",
                    t.value.join(" "),
                    " </span>"
                    );
                    rem_str = "";
                    mod_flag = false;
            } else {
                str = str.concat("<span style='font-weight: bold;' class='bg-lgreen'>"," ",t.value.join(" ")," ","</span>");
            }
        }
        else if (t.removed) {
            rem_str = t.value.join(" ");
            mod_flag = true;
        } else {
            str = str.concat(t.value.join(" "));
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
        $("#refText").val("     Active Inpatient Medications                           Status\n=========================================================\n1)   ATORVASTATIN TAB  80MG PO QPM ACTIVE\n2)   CLOPIDOGREL BISULFATE TAB  75MG PO DAILY               ACTIVE\n3)   FAMOTIDINE TAB  20MG PO DAILY                          ACTIVE\n4)   EMPAGLIFLOZIN TAB,ORAL  12.5MG PO DAILY                ACTIVE \n5)  METOPROLOL SUCCINATE (EXTENDED-RELEASE)  12.5MG PO     ACTIVE \n       DAILY(EVENING)");
        $("#mainText").val("     Active Inpatient Medications                           Status\n========================================================\n1)   ATORVASTATIN TAB  80MG PO QPM ACTIVE\n2)   FAMOTIDINE TAB  40MG PO DAILY                          ACTIVE\n3)   EMPAGLIFLOZIN TAB,ORAL  12.5MG PO DAILY                ACTIVE \n4)  METOPROLOL TARTRATE (IMMEDIATE-RELEASE)  12.5MG PO     ACTIVE \n       DAILY(EVENING)\n 5)   METFORMIN TAB 500MG PO DAILY");
        console.log("test")
    });

    $('#compareBtn').click(function(){
        $('#matched').empty()
        $('#modified').empty()
        $('#added').empty()
        $('#removed').empty()
        let refMedTokens = parseText($("#refText").val());
        let mainMedTokens = parseText($("#mainText").val());

        refMeds = refMedTokens.map(m => new MedEntry(m,ListID.ref));
        mainMeds = mainMedTokens.map(m => new MedEntry(m,ListID.main));

        diffMedList(refMeds,mainMeds);

        mainMeds.forEach(e => {
            if (e.matchStatus == MedMatchStatus.completeMatch) {
                let medstring = e.tokens.join(" ");
                let htmlstring = ["<li class='list-group-item bg-lblue'>",medstring,"</li>"].join("");
                $("#matched").append(htmlstring);
            }
            if (e.matchStatus == MedMatchStatus.added) {
                let medstring = e.tokens.join(" ");
                let htmlstring = ["<li class='list-group-item bg-lgreen'>",medstring,"</li>"].join("");
                $("#added").append(htmlstring);
            }
            if (e.matchStatus == MedMatchStatus.modified) {
                let medstring = colorizeModfiedTokens(e.diffTokens);
                let htmlstring = ["<li class='list-group-item'>",medstring,"</li>"].join("");
                $("#modified").append(htmlstring);
            }

        });

        refMeds.forEach(e => {
        if (e.matchStatus == MedMatchStatus.removed) {
            let medstring = e.tokens.join(" ");
            let htmlstring = ["<li class='list-group-item bg-lightred'>",medstring,"</li>"].join("");
            $("#removed").append(htmlstring);
        }

        activateTooltips();
    });

        console.log(refMeds)
        $("#diffList").show();
    });



});