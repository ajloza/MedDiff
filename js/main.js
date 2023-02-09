function colorizeModfiedTokens(tokens) {
    let str = "";
    tokens.forEach(t => {
        if (t.added) {
            str = str.concat("<span style='font-weight: bold;' class='bg-lgreen'>"," ",t.value.join(" ")," ","</span>");
        }
        else if (t.removed) {
            str = str.concat(
                "<span class='bg-lightred' data-bs-toggle='tooltip' data-bs-placement='top' data-bs-original-title='",
                t.value.join(" "),
                "'>",
                "&#215",
                "</span>"
                );
        } else {
            str = str.concat(t.value.join(" "));
        }

        
    })
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