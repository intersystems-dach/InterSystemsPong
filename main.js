const right = document.getElementById('right');
const left = document.getElementById('left');

// **********
// ***GAME***
// **********

let BALLSPEED = 10;
const PLAYERSPEED = 15;

let bounces = 0;
let p1Count = 0;
let p2Count = 0;

let ballImg = document.getElementById('ballImg');

left.style.left = '0px';
right.style.right = '0px';

let p2 = 80;
let p1 = 80;
let key = {};
let ball = {};

let botMode = true;

let gameStarted = false;

let loopIntervalID = 0;
let requestAnimationFrameID = 0;

initGame();

function initGame() {
    if (gameStarted) return;
    gameStarted = true;

    document.getElementById('counter1').style.display = 'block';
    document.getElementById('counter2').style.display = 'block';
    ballImg.style.display = 'block';

    p1Count = 0;
    p2Count = 0;
    BALLSPEED = 10;
    p2 = 80;
    p1 = 80;
    let introductionKeys = document.getElementsByClassName('introductionKeys');
    for (const element of introductionKeys) {
        element.style.display = 'block';
    }

    if (botMode) {
        document.getElementById('introductionI').style.display = 'none';
        document.getElementById('introductionK').style.display = 'none';
    }

    document.getElementById('introductionW').style.top = '50px';
    document.getElementById('introductionI').style.top = '50px';

    document.getElementById('introductionS').style.bottom = '50px';
    document.getElementById('introductionK').style.bottom = '50px';

    document.getElementById('introductionW').style.left = '100px';
    document.getElementById('introductionS').style.left = '100px';

    document.getElementById('introductionI').style.right = '100px';
    document.getElementById('introductionK').style.right = '100px';

    document.getElementById('botButton').style.display = 'block';
    document.getElementById('botButton').style.left =
        window.innerWidth / 2 - 50 + 'px';

    setTimeout(hideIntroductionKeys, 5000);

    start();
    loopIntervalID = setInterval(loop, 1000 / 60);

    document.addEventListener('keydown', (e) => {
        key[e.keyCode] = true;
    });
    document.addEventListener('keyup', (e) => {
        key[e.keyCode] = false;
    });
    draw();
}

function stopGame() {
    gameStarted = false;
    document.getElementById('counter1').style.display = 'none';
    document.getElementById('counter2').style.display = 'none';
    ballImg.style.display = 'none';
    clearInterval(loopIntervalID);
    cancelAnimationFrame(requestAnimationFrameID);
    left.style.top = '50px';
    right.style.top = '50px';
    document.getElementById('botButton').style.display = 'none';

    hideIntroductionKeys();
}

function hideIntroductionKeys() {
    let introductionKeys = document.getElementsByClassName('introductionKeys');
    for (const element of introductionKeys) {
        element.style.display = 'none';
    }
}

function start() {
    document.getElementById('counter1').innerHTML = p1Count;
    document.getElementById('counter2').innerHTML = p2Count;
    //get random int within window.innerHeight
    BALLSPEED = Math.floor((p1Count + p2Count) / 4) + 10;
    bounces = 0;

    document.getElementById('ballImg').src =
        Math.random() > 0.5
            ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX///8uMZEltKkRFonb2+sJsKW54+ATsab2/PyW1tDR7etKvbNXwLZBu7HX7uuAzsij29YaHou+v9vf4O1ixbzJ6ea449/s+PdyycIwt63h8/GZ19Gt3tro9vVnxr3U7eqK0svh+9smAAAEA0lEQVR4nO3ccVPiMBAF8BpYokIVaNH2ROX7f8q782AGkrRsq1z3Zd77Ezud/KZQu8mmxV3uKaYewM1DIX4oxA+F+KEQPxTih0L8UIgfCvFDIX7Sws0MMRu9cLOt5niptkliUjirCsRUM71wPvVgR2VOIYXmQyGF9kMhhfZDIYX2QyGF9kMhhfZDIYX2QyGF9kMhhfZDIYX2QyGF9kMhhfZDIYX2QyGF9kMhhfbz48J62Zvy6fzg3XKlSd0c9rt3K8LSu77IhfBFeg8+xXsvIr7Zv1oQLvsHeylc6IQnqMhqkbXwC+mGGsGEf8+w/JW58M851rkLnTS5C53UuQudfOQudPKWuzA4UY5C12YvlH3uQucmEpbyL+Fw/PHzzx8Tyss0wt3iKy8hsDn+4aI8iIQ+naTQr6YRHnMfjMon7+6h0H88J9LUpaSQoiqm/pvwQSPs/Bfwum7jL7Tua2pM+Nh9xof4p616PMURFvuIWGYmLJ7DH6PkJgzP6URTCyMJo4t45XBAYXS4Zs4GSvgrPFzzaAolfA0P10zYYAuzu4b5f0vDRQDZ5SZswv8Wn72H4wnfw8c2VXGBJFyFzzReMxIgYROVy6oSGEb4FC9Mpqtq48KOCvh9XydmdFQ3GmPCjnhJzmLoJtsghB3uQ+5C0fUu4Aq9cvkJV6i8hLhCOShHgir0qnk2aKG6eQhUqJplQxaqF4BBhb4d0sUHKJTnAeMAFEqpmbqAFXpZDm5ORBJK+zCsac+i8LTanyyXxvTPWhP6/eMph4iobS8xLTyv2tvoGvr7DIRn8zS7kavaOMKijr+nAx5lEITRBLBzy7yEReJmo2uDghEW0TXU9SYACeMNJ8r5NRhhsYy/p4OfamwLn+KLqGvXgxHGTUK6/gsg4X3i0TwvYaKZTZJnwhUWZXQNtVPBKMLH+Gaj300CIYzaE5QtGEDCsE3I6bdagAiLdXyzGbI9D0CYqIVlQC18s93qo3r108Lv1cI/Ltyvv/IWjqk+ft6736KjFyNRC6uaFG4jLCW9CeS4N6R/z0yHMFELqxfXjO176uqn+c7EG4Yw/FW7ARNvIMJELaxdnwERfqMWRhGG7cH6WhhFOL4WhhFGG2bcVH1ttxImauH0kyCucGwtDCRM1MKal0cACYuPUbUwkjBRCytuNrbeE3Vlv8VbXAtfb/W+2bu+2iBl6l1fi7a8SHulKCqjtFcX9/m+Ngrth0IK7YdCCu2HQgrth0IK7YdCCu2HQgrth0IK7YdCCu2HQgrth0IK7YdCCu2HQgrth0IK7YdCCu2HwnNhNfVgR6XSCzfbao6XartRC+82M8QkgR3CnEIhfijED4X4oRA/FOKHQvxQiB8K8UMhfvIX/gawFaifBbAPIwAAAABJRU5ErkJggg=='
            : 'data:image/png;base64,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';

    ball = {
        x: window.innerWidth / 2,
        y: Math.floor(Math.random() * (window.innerHeight - 200)) + 100,
        speedX: BALLSPEED * (Math.random() * 2 - 1 > 0 ? 1 : -1),
        speedY: 0,
    };
}

function loop() {
    //w
    if (key[87] && p1 > -30) {
        p1 -= PLAYERSPEED;
    }
    //s
    if (key[83] && p1 < window.innerHeight - 240) {
        p1 += PLAYERSPEED;
    }
    //i
    if (key[73] && p2 > -30 && !botMode) {
        p2 -= PLAYERSPEED;
    }
    //k
    if (key[75] && p2 < window.innerHeight - 240 && !botMode) {
        p2 += PLAYERSPEED;
    }

    if (botMode && ball.x > window.innerWidth / 3) {
        let random = Math.floor(Math.random() * 20);
        let direction = ball.y > p2 + 120 ? 1 : -1;
        if (random < 5) {
            direction = 0;
        }
        let newP2 = p2 + direction * PLAYERSPEED;
        let distance = Math.abs(newP2 + 120 - ball.y);
        if (newP2 > -30 && newP2 < window.innerHeight - 240 && distance > 20) {
            p2 = newP2;
        }
    }

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (
        (ball.x < 133 && ball.x > 70) ||
        (ball.x + 50 > window.innerWidth - 133 &&
            ball.x + 50 < window.innerWidth - 70)
    ) {
        if (ball.y > p1 && ball.y < p1 + 240 && ball.speedX < 0) {
            bounces++;
            let relativeIntersectY = p1 + 120 - ball.y;
            let normalizedRelativeIntersectionY = relativeIntersectY / 120;
            let bounceAngle =
                normalizedRelativeIntersectionY * ((5 * Math.PI) / 12);
            ball.speedX =
                BALLSPEED * Math.cos(bounceAngle) * (1 + (1 - 1 / bounces));
            ball.speedY =
                BALLSPEED * -Math.sin(bounceAngle) * (1 + (1 - 1 / bounces));
        } else if (ball.y > p2 && ball.y < p2 + 240 && ball.speedX > 0) {
            bounces++;

            let relativeIntersectY = p2 + 120 - ball.y;
            let normalizedRelativeIntersectionY = relativeIntersectY / 120;
            let bounceAngle =
                normalizedRelativeIntersectionY * ((5 * Math.PI) / 12);
            ball.speedX =
                BALLSPEED * -Math.cos(bounceAngle) * (1 + (1 - 1 / bounces));
            ball.speedY =
                BALLSPEED * -Math.sin(bounceAngle) * (1 + (1 - 1 / bounces));
        }
    }
    //bounce off top and bottom
    if (ball.y < 0 || ball.y + 50 > window.innerHeight) ball.speedY *= -1;

    // got on left side
    if (ball.x < 0) {
        p2Count++;
        start();
    }
    // got on right side
    if (ball.x + 50 > window.innerWidth) {
        p1Count++;
        start();
    }
}

function draw() {
    left.style.top = p1 + 'px';
    right.style.top = p2 + 'px';

    ballImg.style.left = ball.x + 'px';
    ballImg.style.top = ball.y + 'px';

    requestAnimationFrameID = requestAnimationFrame(draw);
}

function toggleGameMode() {
    botMode = !botMode;
    stopGame();
    initGame();
}
