const title = document.getElementById('movingTitle')!;
let sleep: number = 300;
let speed: number = 3;
let direction: boolean = false;
let active: boolean = true;

function moveTitle(){
    setInterval(() => {
        if(active){
            let currentMargin = Number(title.style.marginLeft.split('%')[0]);
            title.style.marginLeft =  (direction ? currentMargin - speed : currentMargin + speed) + '%';
            
            if(currentMargin > 40)
                direction = true;
            if(currentMargin < -40)
                direction = false;
        }
    }, sleep);
}

title.addEventListener("mouseenter", () => {
    active = false;
});

title.addEventListener("mouseleave", () => {
    active = true;
});