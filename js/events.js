document.addEventListener('DOMContentLoaded', function () {
    //
    var firstRadioButton = document.getElementsByName("first");
    firstRadioButton[0].addEventListener("click", function () {
        first = true;  //setting computer as a first player
        turn = first;
    });
    firstRadioButton[1].addEventListener("click", function () {
        first = false;  //setting myself as a first player
        turn = first;
    });
    ////
    var board = [];
    for (var i = 0; i < 9; i++) {
        board.push(document.getElementById("box_" + (i + 1)));
    }
    //
    var startButton = document.getElementsByName("start")[0];
    startButton.addEventListener("click", function () {
        for (var i = 0; i < 9; i++) {
            board[i].addEventListener("click", function () {
                if (!finished) {
                    var res = changeImg(this.id);
                    if (res !== false) {
                        calculate(currentSelf, (first ? element : reverseSymbol(element)), first);
                    }
                }
            });
        }
        disableAll();
        launchBoard(true);
        if (first) {
            calculate(currentSelf, element, true);
        }
    });
    //
    document.getElementsByName("new")[0].addEventListener("click", function () {
        location.reload();
    });
    //
    function disableAll() {
        firstRadioButton[0].disabled = true;
        firstRadioButton[1].disabled = true;
        startButton.disabled = true;
    }
});