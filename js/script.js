// Mixing jQuery and Node.js code in the same file? Yes please!

$(function () {

    // Display some statistics about this computer, using node's os module.

    var os = require('os');
    var prettyBytes = require('pretty-bytes');
    var GeneticAlgorithm = require('geneticalgorithm')
    var GeneticAlgorithmConstructor = require('geneticalgorithm')
    var fs = require('fs');



    var editMutation = CodeMirror(document.getElementById("editMutation"), {
        value: "var mutationFunction = function(phenotype) {" +
        "\n\tvar gene1_index = Math.floor(Math.random() * phenotype.length);" +
        "\n\tvar gene2_index = Math.floor(Math.random() * phenotype.length);" +
        "\n\tvar temp = phenotype[gene1_index];" +
        "\n\tphenotype[gene1_index] = phenotype[gene2_index];" +
        "\n\tphenotype[gene2_index] = temp;" +
        "\n\treturn phenotype" +
        "\n}",
        mode: "javascript",
        lineNumbers: "true"
    });

    console.log(editMutation.getValue());

    var editCrossover = CodeMirror(document.getElementById("editCrossover"), {
        value: "function crossoverFunction(phenotypeA, phenotypeB) {" +
        "\n\tvar index = Math.round(Math.random() * phenotypeA.length)" +
        "\n\tphenotypeX = helper_removeDuplicates(helper_concat(index, phenotypeA, phenotypeB))" +
        "\n\tphenotypeY = helper_removeDuplicates(helper_concat(index, phenotypeB, phenotypeA))" +
        "\n\treturn [phenotypeX, phenotypeY]" +
        "\n}",
        mode: "javascript",
        lineNumbers: "true"
    });

    console.log(editCrossover.getValue());

    var editFitness = CodeMirror(document.getElementById("editFitness"), {
        value: "\nvar fitnessFunction = function(phenotype) {" +
        "\n\tvar calculateDistance = function(a, b) {" +
        "\n\t\treturn Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))" +
        "\n\t}" +
        "\n\tvar prev = phenotype[0]" +
        "\n\tvar distances = phenotype.slice(1).map(function(item) {" +
        "\n\t\tresult = [prev, item];" +
        "\n\t\tprev = item;" +
        "\n\t\treturn result" +
        "\n\t})" +
        "\n\tvar distance = distances.reduce(function(total, item) {" +
        "\n\t\treturn total + calculateDistance(item[0], item[1])" +
        "\n\t}, 0)" +
        "\n\treturn -1 * distance" +
        "\n}",
        mode: "javascript",
        lineNumbers: "true"
    });

    console.log(editFitness.getValue());



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


function saveFunction(nameFunction, txFunction) {

    fs.writeFile("functions/" + nameFunction + ".txt", txFunction, function (err) {
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

$(document).ready(function () {
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;

    trigger.click(function () {
        hamburger_cross();
    });

    $(".btMenu").on("click", function () {
        hamburger_cross();
        $('#wrapper').toggleClass('toggled');
    });

    function hamburger_cross() {

        if (isClosed) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;

            setTimeout(function () {
                $(".box-principal").fadeIn();
                $("#edit").fadeIn();
            }, 400);
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;

            $(".box-principal").hide();
            $("#edit").hide();
        }

    }

    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });

    $("#editMutation, #editCrossover, #editFitness, #edit").hide();
});


function draw() {
    $("#accordion").resizable({
        minHeight: 140,
        minWidth: 200
    });
}