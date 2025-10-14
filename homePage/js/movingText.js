var per = 0;
var sleep = 300;
var direction = false;
var mouseOv = false;
var moveTimeout = null; // Store the timeout ID to stop the function

function moveTitle() {
    if (mouseOv) return;

    moveTimeout = setTimeout(function() {
        if (mouseOv) return;

        document.getElementById('movingTitle').style.marginLeft = per + "%";

        if (!direction)
            per += 3;
        else
            per -= 3;

        if (per > 40)
            direction = true;
        if (per < -40)
            direction = false;

        moveTitle(); // Call the function again for the next step
    }, sleep);
}

function stopMove() {
    mouseOv = true;
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
}

function reStartMove() {
    if (!mouseOv) return;
    mouseOv = false;
    moveTitle();
}