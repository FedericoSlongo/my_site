var title = document.getElementById('movingTitle');
var sleep = 300;
var speed = 3;
var direction = false;
var active = true;

setInterval(function () {
    if (active) {
        var currentMargin = Number(title.style.marginLeft.split('%')[0]);
        title.style.marginLeft = (direction ? currentMargin - speed : currentMargin + speed) + '%';
        if (currentMargin > 40)
            direction = true;
        if (currentMargin < -40)
            direction = false;
    }
}, sleep);

title.addEventListener("mouseenter", function () {
    active = false;
});
title.addEventListener("mouseleave", function () {
    active = true;
});
