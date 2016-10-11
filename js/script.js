// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {

    // Display some statistics about this computer, using node's os module.

    var os = require('os');
    var prettyBytes = require('pretty-bytes');
    var GeneticAlgorithm = require('geneticalgorithm')
    var GeneticAlgorithmConstructor = require('geneticalgorithm')
    var fs = require('fs');
    var newFunction = null;


    $("#button-create").on("click", function() {
        $(".boxEditor").show();
        $("#editor").empty();
        newFunction = CodeMirror(document.getElementById("editor"), {
            value: "",
            mode: "javascript",
            lineNumbers: true,
            matchBrackets: true,
            lineWrapping: true
        });
    });

    $("#button-save").on("click", function() {
        var name = $(".nameFunction").val();
        var func = newFunction.getValue().toString();
        if (name !== "") {
            saveFunction(fs, name, func)
        }
    });


    var funcao01 = CodeMirror(document.getElementById("editMutation"), {
        value: "var mutationFunction = function(phenotype) {\n" +
            "\tvar gene1_index = Math.floor(Math.random() * phenotype.length);\n" +
            "\tvar gene2_index = Math.floor(Math.random() * phenotype.length);\n" +
            "\tvar temp = phenotype[gene1_index];\n" +
            "\tphenotype[gene1_index] = phenotype[gene2_index];\n" +
            "\tphenotype[gene2_index] = temp;\n" +
            "\treturn phenotype;\n" +
            "}",
        mode: "javascript",
        lineNumbers: true,
        matchBrackets: true,
        lineWrapping: true
    });

    console.log(funcao01.getValue());


    // var tst = null;

    // $("#teste").on("click", function() {
    //     debugger
    //     var f = editor.getValue().trim();
    //     f = "(" + f.substring(0) + ")";
    //     var func = eval(f);
    //     var config = GeneticAlgorithm({
    //         mutationFunction: func,
    //         crossoverFunction: func,
    //         fitnessFunction: func,
    //         population: [createEmptyPhenotype()],
    //         populationSize: 5 * 10
    //     });

    //     var geneticalgorithm = GeneticAlgorithmConstructor(config)
    //     geneticalgorithm.evolve();
    // });

    // $("#btFunc").on("click", function() {
    //     $("#editor").show();
    // });

});


function saveFunction(fs, nameFunction, txFunction) {

    fs.writeFile("functions/" + nameFunction + ".txt", txFunction, function(err) {
        if (err) {
            console.log(err);
        } else {
            return true;
        }
    });
}

function readFunction() {

    //falta implementar
}

$(function() {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function() {
        hamburger_cross();
    });

    function hamburger_cross() {

        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;

            setTimeout(function() {

                $(".box-principal").fadeIn();
            }, 100);
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;

            $(".box-principal").hide();
        }
    }

    $('[data-toggle="offcanvas"]').click(function() {
        $('#wrapper').toggleClass('toggled');
    });

    $("#editMutation").hide();
});


function draw() {
    $("#accordion").resizable({
        minHeight: 140,
        minWidth: 200
    });
}