$(function () {

    $("#btInicio").on("click", function () {
        showInicio();
    });

    $("#btMutation").on("click", function () {
        showMutation();
        $("#editMutation").show();
    });
    $("#btCrossover").on("click", function () {
        showCrossover();
        $("#editCrossover").show();
    });
    $("#btFitness").on("click", function () {
        showFitness();
        $("#editFitness").show();
    });

});

function showInicio() {

    hideDivs();
    $("#inicio").show();
}

function showMutation() {

    hideDivs();
    $("#mutation").show();
}

function showCrossover() {

    hideDivs();
    $("#crossover").show();
}

function showFitness() {

    hideDivs();
    $("#fitness").show();
}

function hideDivs() {
    $("#inicio, #mutation, #crossover, #fitness").hide();
    $("#editMutation, #editCrossover, #editFitness").hide();
}