/*

	beso9595 - 01.06.16

*/

var tree = [];						//tree for minimax
var E = 'E';						//represents empty box
var X = 'X';						//represents 'X'
var O = 'O';						//represents 'O'
var first = true;					//defines who will make first turn(computer or player)
var last = E;						//information about last set symbol
var turn = first;					//defines whose turn is it
var colorBlue = "#1E90FF";			//some colors
var colorGreen = "#6DAC83";
var colorRed = "#D45365";
var element = X;					//'X' starts the game
var finished = false;				//becames true if game is over
var winner = E;						//variable for winner symbol
var currentSelf = "EEEEEEEEE";		//start position

//main function
function calculate(nodeSelf, el, maximazing) {
    if (!finished) {
        buildTree(nodeSelf, el, -1);									//first we build the tree
        var value = miniMax((tree.length - 1), maximazing);				//give start point to minimax alg
        var resultNode = whichChild();									//choose one from given 'best' results
        var changeIndex = getDifferance(nodeSelf, resultNode.self);		//defines where to make change(index)
        changeImg("box_" + (changeIndex + 1));							//makes change
    }
}

//build tree and number ends of tree
function buildTree(nodeSelf, el) {
    var goal = goalCheck(nodeSelf);
    var val = (goal !== false) ? ((nodeSelf[goal[0]] == X) ? 1 : -1) : (isFilled(nodeSelf) ? 0 : null);
    var childIndexes = [];
    if (val == null) {
        var index = [];
        var count = (nodeSelf.match(/E/g) || []).length;
        for (var i = 0; i < count; i++) {
            var bl = false;
            var newNode = "";
            for (var j = 0; j < nodeSelf.length; j++) {
                var fill = nodeSelf[j];
                if (nodeSelf[j] == E && !bl && checkIndex(j, index)) {
                    bl = true;
                    index.push(j);
                    fill = el;
                }
                newNode += fill;
            }
            //
            childIndexes.push(buildTree(newNode, ((el == X) ? O : X)));
        }
    }
    //
    var len = tree.push(createNode(nodeSelf, val, childIndexes));
    return (len - 1);
}

//minimax algorithm
function miniMax(nodeIndex, maximazing) {
    if (tree[nodeIndex].value === null) {
        var bestValue = (!maximazing) ? Infinity : -Infinity;
        for (var i = 0; i < tree[nodeIndex].childIndex.length; i++) {
            value = miniMax(tree[nodeIndex].childIndex[i], !maximazing);
            bestValue = (maximazing) ? Math.max(bestValue, value) : Math.min(bestValue, value);
        }
        tree[nodeIndex].value = bestValue;
    }
    return tree[nodeIndex].value;
}

//chooses one from chosen nodes
function whichChild() {
    var lastNode = tree[tree.length - 1];
    var childIndexes = lastNode.childIndex;
    var newIndexes = [];
    for (var i = 0; i < childIndexes.length; i++) {
        var ind = childIndexes[i];
        if (lastNode.value == tree[ind].value) {
            newIndexes.push(ind);
        }
    }
    return (childIndexes.length != 0) ? tree[newIndexes[Math.floor(Math.random() * newIndexes.length)]] : false;
}

//creates node object
function createNode(nodeSelf, val, children) {
    return { self: nodeSelf, value: val, childIndex: children };
}

//gets the differance of two node positions
function getDifferance(nodeSelfA, nodeSelfB) {
    for (var i = 0; i < nodeSelfA.length; i++) {
        if (nodeSelfA[i] != nodeSelfB[i]) {
            return i;
        }
    }
    return false;
}

//checks if 'ind' contains 'j'
function checkIndex(j, ind) {
    for (var i = 0; i < ind.length; i++) {
        if (ind[i] == j) {
            return false;
        }
    }
    return true;
}

//checks if node position is filled
function isFilled(nodeSelf) {
    return (nodeSelf.indexOf(E) == -1) ? true : false;
}

//checks node position for goal
function goalCheck(nodeSelf) {
    var arr = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    //check all
    var size = arr.length;
    for (var i = 0; i < size; i++) {
        if (nodeSelf[arr[i][0]] != E && nodeSelf[arr[i][0]] == nodeSelf[arr[i][1]] && nodeSelf[arr[i][0]] == nodeSelf[arr[i][2]]) {
            return arr[i];
        }
    }
    return false;
}

//returns reverse symbol for next turn
function reverseSymbol(sym) {
    return (sym != X) ? X : O;
}

//defines what symbol is on given url
function getBox(imgSrc) {
    var arr = ["X.png", "O.png", "E.png"];
    for (var i = 0; i < arr.length; i++) {
        if (imgSrc.indexOf(arr[i]) != -1) {
            return arr[i].substring(0, 1);
        }
    }
    return false;
}

//changes 'E' to 'X' or 'O'
function changeImg(onId) {
    if (!finished) {
        var ob = document.getElementById(onId);
        if (getBox(ob.src) != E) {
            return false;
        }
        var next = reverseSymbol(last);
        ob.src = "img/" + next + ".png";
        last = next;
        var idNumber = onId.substring(4);
        currentSelf = changeNode(currentSelf, (idNumber - 1), next);
        var arr = goalCheck(currentSelf);
        if (arr !== false) {
            winner = currentSelf[arr[0]];
            finish(arr);
        }
        else {
            if (isFilled(currentSelf)) {
                over();
            }
        }
        setTurn();
    }
    else {
        return false;
    }
}

//changes node passed node postiion with 'symbol' on 'index'
function changeNode(nodeSelf, index, symbol) {
    var newNode = "";
    for (var i = 0; i < nodeSelf.length; i++) {
        newNode += (i == index) ? symbol : nodeSelf[i];
    }
    return newNode;
}

//launches board to start game
function launchBoard(launch) {
    var color = launch ? colorBlue : colorGreen;
    changeColor(true, color);
}

//changes color for given 'boxes' with passed 'color'
function changeColor(boxes, color) {
    var boxArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    if (boxes !== true) {
        boxArr = [];
        for (var i = 0; i < boxes.length; i++) {
            boxArr.push(boxes[i]);
        }
    }
    //
    var desk = document.getElementById("desk").getElementsByTagName("td");
    for (var i = 0; i < boxArr.length; i++) {
        desk[boxArr[i]].style.backgroundColor = color;
    }
}

//set score
function setTurn() {
    if (finished) {
        str = (winner == E) ? "Result: Draw" : "Winner is: " + winner;
    }
    else {
        str = turn ? "Player" : "Computer";
        turn = !turn;
        str += ": " + reverseSymbol(last);
    }
    document.getElementById("turn").textContent = str;
}

//sets color for winner symbols and finishes the game
function finish(arr) {
    changeColor(arr, colorRed);
    over();
}

//finishes the game
function over() {
    finished = true;
}