let song;
let fft;
let img;
let particles = [];
const songs = document.querySelector("#song")

songs.addEventListener('change', changeSong);

function preload() {
    song = loadSound(songs[songs.selectedIndex].value);
    img = loadImage('bg.jpg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    fft = new p5.FFT(0.3);

    img.filter(BLUR, 12);

    noLoop();
}

function changeSong() {
    song.stop();
    song = loadSound(songs[songs.selectedIndex].value);
}

function draw() {
    background(0);
    stroke(255);
    strokeWeight(3);
    noFill();

    translate(width / 2, height / 2);

    fft.analyze();
    let amp = fft.getEnergy(20, 200);
    console.log(amp)

    push()
    if (amp > 220) {
        rotate(random(-0.5, 0.5))
    }

    image(img, 0, 0, width + 100, height + 100);
    pop()

    let alpha = map(amp, 0, 255, 180, 150);
    fill(0, alpha);
    rect(0, 0, width, height)



    stroke(color(random(0, 1) * amp,random(0, 1) * amp,random(0, 1) * amp))
    let wave = fft.waveform();
    for (let t = -1; t <= 1; t += 2) {
        beginShape()
        for (let i = 0; i <= 180; i += 6) {
            let index = floor(map(i, 0, width, 0, wave.length - 1));

            let r = map(wave[index], -1, 1, 150, 350);

            // let x = r * sin(i) * t + t * wave[index]*amp;
            // let y = r * cos(i) * wave[index] * amp;
            // vertex(x, y)

            // let x = r * sin(i) * t + t * wave[index]*amp + t * random(-100, 100);
            // let y = r * cos(i) + t * wave[index] * amp + t * random(-100, 100);
            // vertex(x, y)

            // let x = r * sin(i) * t + t * wave[index]*amp + t * random(-100, 100);
            // let y = r * cos(i) + t * wave[index] * amp;
            // vertex(x, y)

            // let x = r * t * sin(i);
            // let y = -r * cos(i) * i/150 - 85;
            // vertex(x, y)

            /////////////////////////////////////
            let x = r*0.7 * t * sin(i)*cos(i);
            let y = r*0.7 * t * cos(i)*sin(i);
            vertex(x, y)

            let a = r*0.7 * t * sin(i);
            let b = r*0.7 * t * cos(i);
            vertex(a, b)

            vertex(a-x, b-y)
            /////////////////////////////////////
            // let x = r*0.7 * t * sin(i)*cos(i);
            // let y = r*0.7 * cos(i)*sin(i);
            // // vertex(x, y)

            // let a = r*0.7 * t * sin(i);
            // let b = r*0.7 * cos(i);
            // // vertex(a, b)

            // vertex(a+x, b+y)
            ///////////////////////////////////

            // let x = r * sin(i) * t * tan(i);
            // let y = r * cos(i*2) * cos(i+r*i)
            // point(x, y);

            // let x = r * sqrt(Math.PI) * sin(i) / 2 * t;
            // let y = r * sqrt(Math.E * i/2) * cos(i) / 14 * t;
            // vertex(x, y)

            // let x = r * sin(sqrt(i * random(1, 10))) * t  * random(-1, 1);;
            // let y = r * cos(i) * random(-1, 1);
            // vertex(x, y)
        }
        endShape()
    }

    let p = new Particle();
    particles.push(p);

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].edges()) {
            particles[i].update(amp > 200);
            particles[i].show();
        } else particles.splice(i, 1);
    }

}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause();
        noLoop();
    } else {
        song.play();
        loop();
    }
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250);
        this.vel = createVector(0, 0);
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

        this.w = random(3, 5);

        this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
    }
    update(cond) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        if (cond) {
            this.pos.add(this.vel);
            this.pos.add(this.vel);
            this.pos.add(this.vel);
        }
    }
    edges() {
        if (this.pos.x < width / 2 || this.pos.x > width / 2 || this.pos.y < height / 2 || this.pos.y > height / 2) {
            return true;
        } else {
            return false;
        }
    }
    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.w);
    }
}