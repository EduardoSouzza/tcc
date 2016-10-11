var GeneticAlgorithm = require('geneticalgorithm')

var canvas, ctx;
var WIDTH, HEIGHT;
var points = [];
var running;
var canvasMinX, canvasMinY;
var doPreciseMutate;

var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

init();
initData();
GAInitialize();
draw();

function initData() {
    running = false;
    POPULATION_SIZE = 30;
    ELITE_RATE = 0.3;
    CROSSOVER_PROBABILITY = 0.9;
    MUTATION_PROBABILITY = 0.01;
    UNCHANGED_GENS = 0;
    mutationTimes = 0;
    doPreciseMutate = true;

    bestValue = undefined;
    best = [];
    currentGeneration = 0;
    currentBest;
    population = [];
    values = new Array(POPULATION_SIZE);
    fitnessValues = new Array(POPULATION_SIZE);
    roulette = new Array(POPULATION_SIZE);
    points = data40;

}

function GAInitialize() {
    countDistances();
    for (var i = 0; i < POPULATION_SIZE; i++) {
        population.push(randomIndivial(points.length));
    }
    setBestValue();
}

function GANextGeneration() {
    currentGeneration++;
    selection();
    crossoverFunction();
    mutationFunction();
    setBestValue();
}

function mutationFunction() {
    for (var i = 0; i < POPULATION_SIZE; i++) {
        if (Math.random() < MUTATION_PROBABILITY) {
            if (Math.random() > 0.5) {
                population[i] = pushMutate(population[i]);
            } else {
                population[i] = doMutate(population[i]);
            }
            i--;
        }
    }
}

//modificado ---------------------------------------------------
function crossoverFunction(a, b) {
    var queue = new Array();
    for (var i = 0; i < POPULATION_SIZE; i++) {
        if (Math.random() < CROSSOVER_PROBABILITY) {
            queue.push(i);
        }
    }
    queue.shuffle();
    for (var i = 0, j = queue.length - 1; i < j; i += 2) {
        doCrossover(queue[i], queue[i + 1]);
    }
}

function doCrossover(x, y) {
    child1 = getChild('next', x, y);
    child2 = getChild('previous', x, y);
    population[x] = child1;
    population[y] = child2;
}

function getChild(fun, x, y) {
    solution = new Array();

    var px = population[x].slice();
    var py = population[y].slice();
    var dx, dy;
    var c = px[randomNumber(px.length)];
    solution.push(c);
    while (px.length > 1) {
        dx = px[fun](px.indexOf(c));
        dy = py[fun](py.indexOf(c));
        px.deleteByValue(c);
        py.deleteByValue(c);
        c = dis[c][dx] < dis[c][dy] ? dx : dy;
        solution.push(c);
    }
    return solution;
}

function doMutate(seq) {
    mutationTimes++;
    do {
        m = randomNumber(seq.length - 2);
        n = randomNumber(seq.length);
    } while (m >= n)

    for (var i = 0, j = (n - m + 1) >> 1; i < j; i++) {
        seq.swap(m + i, n - i);
    }
    return seq;
}

function randomIndivial(n) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(i);
    }
    return a.shuffle();
}

function countDistances() {
    var length = points.length;
    dis = new Array(length);
    for (var i = 0; i < length; i++) {
        dis[i] = new Array(length);
        for (var j = 0; j < length; j++) {
            dis[i][j] = ~~distance(points[i], points[j]);
        }
    }
}

function randomIndivial(n) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(i);
    }
    return a.shuffle();
}


function selection() {
    var parents = new Array();
    var initnum = 4;
    parents.push(population[currentBest.bestPosition]);
    parents.push(doMutate(best.clone()));
    parents.push(pushMutate(best.clone()));
    parents.push(best.clone());

    setRoulette();

    for (var i = initnum; i < POPULATION_SIZE; i++) {
        parents.push(population[wheelOut(Math.random())]);
    }
    population = parents;
}

function pushMutate(seq) {
    mutationTimes++;
    var m, n;
    do {
        m = randomNumber(seq.length >> 1);
        n = randomNumber(seq.length);
    } while (m >= n)

    var s1 = seq.slice(0, m);
    var s2 = seq.slice(m, n)
    var s3 = seq.slice(n, seq.length);
    return s2.concat(s1).concat(s3).clone();
}

function setBestValue() {
    for (var i = 0; i < population.length; i++) {
        values[i] = evaluate(population[i]);
    }
    currentBest = getCurrentBest();
    if (bestValue === undefined || bestValue > currentBest.bestValue) {
        best = population[currentBest.bestPosition].clone();
        bestValue = currentBest.bestValue;
        UNCHANGED_GENS = 0;
    } else {
        UNCHANGED_GENS += 1;
    }
}

function evaluate(indivial) {
    var sum = dis[indivial[0]][indivial[indivial.length - 1]];
    for (var i = 1; i < indivial.length; i++) {
        sum += dis[indivial[i]][indivial[i - 1]];
    }
    return sum;
}


function getCurrentBest() {
    var bestP = 0,
        currentBestValue = values[0];

    for (var i = 1; i < population.length; i++) {
        if (values[i] < currentBestValue) {
            currentBestValue = values[i];
            bestP = i;
        }
    }
    return {
        bestPosition: bestP,
        bestValue: currentBestValue
    }
}

function wheelOut(rand) {
    var i;
    for (i = 0; i < roulette.length; i++) {
        if (rand <= roulette[i]) {
            return i;
        }
    }
}

function setRoulette() {
    for (var i = 0; i < values.length; i++) {
        fitnessValues[i] = 1.0 / values[i];
    }
    var sum = 0;
    for (var i = 0; i < fitnessValues.length; i++) {
        sum += fitnessValues[i];
    }
    for (var i = 0; i < roulette.length; i++) {
        roulette[i] = fitnessValues[i] / sum;
    }
    for (var i = 1; i < roulette.length; i++) {
        roulette[i] += roulette[i - 1];
    }
}


function createEmptyPhenotype() {
    return {
        numbers: [0.1, 0.1]
    }
}

var ga = GeneticAlgorithm({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: setRoulette,
    population: [GAInitialize()],
});

ga.evolve();


function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $('#canvas').width();
    HEIGHT = $('#canvas').height();
    setInterval(draw, 10);
    init_mouse();
}

function init_mouse() {
    $("canvas").click(function(evt) {
        if (!running) {
            canvasMinX = $("#canvas").offset().left;
            canvasMinY = $("#canvas").offset().top;
            $('#status').text("");

            x = evt.pageX - canvasMinX;
            y = evt.pageY - canvasMinY;
            points.push(new Point(x, y));
        }
    });
}

function drawCircle(point) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawLines(array) {
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(points[array[0]].x, points[array[0]].y);
    for (var i = 1; i < array.length; i++) {
        ctx.lineTo(points[array[i]].x, points[array[i]].y)
    }
    ctx.lineTo(points[array[0]].x, points[array[0]].y);

    ctx.stroke();
    ctx.closePath();
}

function draw() {
    GANextGeneration();
    clearCanvas();
    if (points.length > 0) {
        for (var i = 0; i < points.length; i++) {
            drawCircle(points[i]);
        }
        if (best.length === points.length) {
            drawLines(best);
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}