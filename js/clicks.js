$(function() {

    $("#btInicio").on("click", function() {
        showInicio();
    });

    $("#btMutation").on("click", function() {
        showMutation();
    });
    $("#btCrossover").on("click", function() {
        showCrossover();
    });
    $("#btFitness").on("click", function() {
        showFitness();
    });

});

function showInicio() {

    hideDivs();
    $("#inicio").show();
}

function showMutation() {

    hideDivs();
    $("#mutation, #editMutation").show();
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
    $("#inicio, #mutation, #crossover, #fitness, #editMutation").hide();
}