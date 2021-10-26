const main = new Sketch({ width, height: height - 5, frameRate: 60 });
// const main = new Sketch({ width: 400, height: 400, frameRate: 60 });

const gap = 2;
const steps = 6;
const points = [];
const zoom = 500;

class Point {
    constructor(x, y, color = "white") {
        this.org = new Complex(x, y);
        this.pos = new Complex(x, y);
        this.color = color;
        this.isRoot = color !== "white";
    }
    render() {
        fill(this.color);
        if (!this.isRoot) noStroke();
        else {
            stroke("white")
            strokeWeight(2 / zoom)
        }
        let w = this.isRoot ? (10 / zoom) : (gap / zoom);
        rect(this.pos.re, this.pos.im, w, w);
    }
}

const roots = [
    new Point(-1.32472, 0, "#00f7ff"),
    new Point(0, -1, "#8400ff"),
    new Point(0, 1, "#3600bf"),
    new Point(0.66236, -0.56228, "#00a2e8"),
    new Point(0.66236, 0.56228, "#a3f6ff")
];

function init() {
    for (let i = -width / 2; i <= width / 2; i += gap) {
        for (let j = -height / 2; j <= height / 2; j += gap) {
            points.push(new Point((i + gap / 2) / zoom, (j + gap / 2) / zoom));
        }
    }
    save();
    translate(width / 2, height / 2);
    scale(zoom);
    for (let point of roots) {
        point.render();
    }
    for (let point of points) {
        point.render();
    }
    restore();
}

function loop() {
    console.log(main._frameCount)
    if (main._frameCount <= steps) {
        for (let point of points) {
            point.pos = step(point.pos, Q, dQ);
            // point.pos = step(point.pos, P, dP);
        }
    } else {
        clear();
        save();
        translate(width / 2, height / 2);
        scale(zoom);
        for (let point of points) {
            let closest = null;
            let closestDist = Infinity;
            for (let root of roots) {
                let d = distSq(point.pos.re, point.pos.im, root.pos.re, root.pos.im);
                if (d < closestDist) {
                    closest = root;
                    closestDist = d;
                }
            }
            point.color = closest.color;
            point.pos = point.org;
            point.render();
        }
        // for (let point of roots) {
        //     point.render();
        // }
        restore();
        Sketches.stopLoop();
    }
}

function P(z) {
    return z.pow(5).add(z.pow(2)).add(z.mul(-1)).add(1);
}

function dP(z) {
    return z.pow(4).mul(5).add(z.mul(2)).add(-1);
}

function Q(z) {
    return z.sin();
}

function dQ(z) {
    return z.cos();
}

function step(point, polynomial, derivative) {
    return point;
    // return point.sub(polynomial(point).div(derivative(point)));
}

main.init(init);
main.loop(loop);
Sketches.loop();