
$(document).ready(function(){
    

    $('#demoBtn').click(function(){
        $("#inputText").val("     Active Outpatient Medications                          Status\n=========================================================================\n1)   AMINOLEVULINIC ACID 20% TOP SOLN W/APPL APPLY ONE      ACTIVE\n       KERASTICK TO AFFECTED AREA ONE TIME ONLY.\n2)   ATORVASTATIN CALCIUM 80MG TAB TAKE ONE TABLET BY       ACTIVE\n       MOUTH EVERY EVENING FOR CHOLESTEROL\n3)   CLOPIDOGREL BISULFATE 75MG TAB TAKE ONE TABLET BY      ACTIVE\n       MOUTH ONCE DAILY\n4)   EMPAGLIFLOZIN 25MG TAB TAKE ONE-HALF TABLET BY MOUTH   ACTIVE\n       ONCE DAILY FOR DIABETES\n5)   EZETIMIBE 10MG TAB TAKE ONE TABLET BY MOUTH ONCE       ACTIVE\n       DAILY FOR CHOLESTEROL\n6)   FINASTERIDE 5MG TAB TAKE ONE TABLET BY MOUTH ONCE      ACTIVE\n       DAILY FOR PROSTATE\n7)   FOLIC ACID 1MG TAB TAKE ONE TABLET BY MOUTH EVERY      ACTIVE (S)\n       MORNING / NUTRITIONAL SUPPLEMENT\n8)   MELATONIN 3MG CAP/TAB TAKE 3 TABLETS(9 MG) BY MOUTH    ACTIVE\n       AT BEDTIME FOR SLEEP\n9)   METOPROLOL SUCCINATE 25MG SA TAB TAKE ONE-HALF TABLET  ACTIVE\n       BY MOUTH EVERY EVENING FOR BLOOD PRESSURE/HEART\n10)  PSYLLIUM ORAL PWD MIX 1 TEASPOONFUL BY MOUTH ONCE      ACTIVE\n       DAILY AS NEEDED FOR CONSTIPATION (MIX WITH 8 OUNCES\n       OF WATER OR OTHER COOL LIQUID AND DRINK)\n11)  RIVAROXABAN 20MG TAB TAKE ONE TABLET BY MOUTH EVERY    ACTIVE\n       EVENING WITH EVENING MEAL");
    });

    $('#recBtn').click(function(){
        $('#medList').empty()
        let [inputMedTokens,listTypeRef] = parseText($("#inputText").val());

        inputMeds = inputMedTokens.map(m => new MedEntry(m,ListID.ref,listTypeRef));

        inputMeds.forEach((e,i) => {
                let medstring = e.tokens.join(" ");
                let switchstring = ["<td class = 'col-4'><div class='form-check form-switch'><input class='form-check-input med-taking' type='radio' name='med-",i,"' id='taking-",i,"' ><label class='form-check-label' for='taking-",i,"'>Taking</label></div><div class='form-check form-switch'><input class='form-check-input med-different' type='radio' name='med-",i,"' id='takingDifferently-",i,"'><label class='form-check-label' for='takingDifferently-",i,"'>Taking Differently</label></div><div class='form-check form-switch'><input class='form-check-input med-not' type='radio' name='med-",i,"' id='notTaking-",i,"'><label class='form-check-label' for='notTaking-",i,"'>Not Taking</label></div></td>"].join("");
                let htmlstring = ["<tr class = 'd-flex'><td class = 'col-8'>",medstring,"</td>",switchstring,"</tr>"].join("");


                $("#medList").append(htmlstring);

                $(document).on("click","input.med-taking", function() {
                    $(this).parents().eq(2).removeClass("bg-vlyellow bg-lightred").addClass("bg-lblue");
                });
                $(document).on("click","input.med-different", function() {
                    $(this).parents().eq(2).removeClass("bg-lblue bg-lightred").addClass("bg-vlyellow");
                });
                $(document).on("click","input.med-not", function() {
                    $(this).parents().eq(2).removeClass("bg-vlyellow bg-lblue").addClass("bg-lightred");
                });

        });
        $("#recArea").show();
        $("#inputArea").hide();
    });

        // $("#reconcilePanel").show();
    });
