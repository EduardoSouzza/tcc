var GeneticAlgorithm = require('geneticalgorithm')

Array.prototype.swap = function(x, y) {
    if (x > this.length || y > this.length || x === y) {
        return
    }
    var tem = this[x];
    this[x] = this[y];
    this[y] = tem;
}

Array.prototype.clone = function() {
    return this.slice(0);
}


var mutationFunction = function(phenotype) {
    var gene1_index = Math.floor(Math.random() * phenotype.length);
    var gene2_index = Math.floor(Math.random() * phenotype.length);
    var temp = phenotype[gene1_index];
    phenotype[gene1_index] = phenotype[gene2_index];
    phenotype[gene2_index] = temp;
    return phenotype
}

function helper_concat(index, phenotypeA, phenotypeB) {
    return phenotypeA.slice(0, index).concat(phenotypeB.slice(index)).concat(phenotypeA.slice(index))
}

function helper_removeDuplicates(phenotype) {
    var duplicates = {}
    return phenotype.filter(function(item) {
        if (duplicates[JSON.stringify(item)]) {
            return false
        } else {
            duplicates[JSON.stringify(item)] = true;
            return true
        }
    })
}

function crossoverFunction(phenotypeA, phenotypeB) {
    var index = Math.round(Math.random() * phenotypeA.length)


    phenotypeX = helper_removeDuplicates(helper_concat(index, phenotypeA, phenotypeB))
    phenotypeY = helper_removeDuplicates(helper_concat(index, phenotypeB, phenotypeA))

    // move, copy, or append some values from a to b and from b to a
    return [phenotypeX, phenotypeY]
}


var fitnessFunction = function(phenotype) {

    var calculateDistance = function(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }

    var prev = phenotype[0]
        //console.log("The phenotype are " + JSON.stringify(phenotype))
    var distances = phenotype.slice(1).map(function(item) {
            result = [prev, item];
            prev = item;
            return result
        })
        //console.log("The distances are " + JSON.stringify(distances))
    var distance = distances.reduce(function(total, item) {
            //console.log("item = " + JSON.stringify(item) )
            return total + calculateDistance(item[0], item[1])
        }, 0)
        //console.log("total = " + distance )
    return -1 * distance
}

// outline a large square but not in order.
var firstPhenotype = [{
    "x": 116,
    "y": 404
}, {
    "x": 161,
    "y": 617
}, {
    "x": 16,
    "y": 97
}, {
    "x": 430,
    "y": 536
}, {
    "x": 601,
    "y": 504
}, {
    "x": 425,
    "y": 461
}, {
    "x": 114,
    "y": 544
}, {
    "x": 127,
    "y": 118
}, {
    "x": 163,
    "y": 357
}, {
    "x": 704,
    "y": 104
}, {
    "x": 864,
    "y": 125
}, {
    "x": 847,
    "y": 523
}, {
    "x": 742,
    "y": 170
}, {
    "x": 204,
    "y": 601
}, {
    "x": 421,
    "y": 377
}, {
    "x": 808,
    "y": 49
}, {
    "x": 860,
    "y": 466
}, {
    "x": 844,
    "y": 294
}, {
    "x": 147,
    "y": 213
}, {
    "x": 550,
    "y": 124
}, {
    "x": 238,
    "y": 313
}];

var geneticAlgorithmConstructor = require('./index')
var geneticAlgorithm = geneticAlgorithmConstructor({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: [firstPhenotype],
    populationSize: 100
});

console.log("Starting with:")
console.log(firstPhenotype)
var points = null;

init();

var best = []
var previousBestScore = 0;

var best = []
var previousBestScore = 0;

var a = 0;
var i = 0;

function doEvolve() {
    i++
    geneticAlgorithm.evolve()

    points = geneticAlgorithm.best();
    draw();
    if (i == 25) {
        i = 0;
        setTimeout(doContinue, 50);
    } else
        setTimeout(doEvolve, 50);
}

function doContinue() {
    a++;

    var score = geneticAlgorithm.bestScore()
    if (score == previousBestScore || a == 100) {

        best = geneticAlgorithm.best();
        // draw();

        console.log("Finished with:")
        console.log(best)
        console.log("Distance is final" + -1 * fitnessFunction(best))
        return;
    }

    previousBestScore = score
    console.log("Distance is " + -1 * score)
    console.log();
    setTimeout(doEvolve, 50);
}

doEvolve();

function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $('#canvas').width();
    HEIGHT = $('#canvas').height();
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

    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < array.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.lineTo(points[0].x, points[0].y);

    ctx.stroke();
    ctx.closePath();
}

function draw() {
    clearCanvas();
    if (points.length > 0) {
        for (var i = 0; i < points.length; i++) {
            drawCircle(points[i]);
        }
        drawLines(points);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}


function pushMutate(seq) {
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


function doMutate(seq) {
    // m and n refers to the actual index in the array
    // m range from 0 to length-2, n range from 2...length-m
    var m, n;
    do {
        m = randomNumber(seq.length - 2);
        n = randomNumber(seq.length);
    } while (m >= n)

    for (var i = 0, j = (n - m + 1) >> 1; i < j; i++) {
        seq.swap(m + i, n - i);
    }
    return seq;
}

function randomNumber(boundary) {
    var n = Math.random() * boundary;
    return parseInt(n);
}


// for (i = 1; i < 4; i++) {
//     firstPhenotype.push({
//         x: i * i,
//         y: 100
//     })
//     firstPhenotype.push({
//         x: i * i,
//         y: i
//     })
//     firstPhenotype.push({
//         x: i * 3,
//         y: 50
//     })
//     firstPhenotype.push({
//         x: 100,
//         y: i
//     })
//     firstPhenotype.push({
//         x: 100,
//         y: i
//     })
//     firstPhenotype.push({
//         x: 100,
//         y: i
//     })
//     firstPhenotype.push({
//         x: 300,
//         y: i
//     })
//     firstPhenotype.push({
//         x: 400,
//         y: i
//     })
//     firstPhenotype.push({
//         x: i,
//         y: 300
//     })

//     console.log("huehuee = " + firstPhenotype)
// }