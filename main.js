// const main = new Sketch({ width, height: height - 5, frameRate: 60 });
const main = new Sketch({ width: 200, height: 200, frameRate: 60 });

const gap = 2;
const steps = 2;
const pointsArray = [];
const zoom = 100;

class Point {
    constructor(x, y, color = "white", index) {
        this.org = math.complex(x, y);
        this.pos = math.complex(x, y);
        this.color = color;
        this.isRoot = color !== "white";
        this.index = index;
    }
}

const roots = [
    new Point(-1.32472, 0, new Color(0, 247, 255)),
    new Point(0, -1, new Color(132, 0, 255)),
    new Point(0, 1, new Color(54, 0, 191)),
    new Point(0.66236, -0.56228, new Color(0, 162, 232)),
    new Point(0.66236, 0.56228, new Color(163, 246, 255))
];

let white = new Color(255);

let buffer, idata;
showAnim = true;

function init() {
    buffer = new Uint8ClampedArray(width * height * 4);
    idata = main.currentCtx.createImageData(width, height);

    let pixelSize = 1;
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            let pos = (y * width + x) * 4; // position in buffer based on x and y
            buffer[pos] = 255;           // some R value [0, 255]
            buffer[pos + 1] = 255;           // some G value
            buffer[pos + 2] = 255;           // some B value
            buffer[pos + 3] = 255;           // set alpha channel
            pointsArray.push(math.complex((x - width / 2) / zoom, (y - height / 2) / zoom));
        }
    }

    idata.data.set(buffer);
    main.currentCtx.putImageData(idata, 0, 0);
}

function loop() {
    console.log(main._frameCount, "started");

    if (main._frameCount <= steps) {
        console.log(main._frameCount, "rendering");

        pointsArray.forEach((point, i) => {

            let c = step(point, F, dF);
            point.im = c.im;
            point.re = c.re;

            if (main._frameCount === steps || showAnim) {
                let closest = null;
                let closestDist = Infinity;
                for (let root of roots) {
                    let d = distSq(point.re, point.im, root.pos.re, root.pos.im);
                    if (d < closestDist) {
                        closest = root;
                        closestDist = d;
                    }
                }
                buffer[i * 4] = closest.color.r;
                buffer[(i * 4) + 1] = closest.color.g;
                buffer[(i * 4) + 2] = closest.color.b;
                buffer[(i * 4) + 3] = 255;
            }
        });
    } else {
        Sketches.stopLoop();
    }

    if (main._frameCount === steps || showAnim) {
        clear();
        idata.data.set(buffer);
        main.currentCtx.putImageData(idata, 0, 0);
    }

    console.log(main._frameCount, "ended");
}

function P(z) {
    return z.pow(5).add(z.pow(2)).add(z.mul(-1)).add(1);
}

function dP(z) {
    return z.pow(4).mul(5).add(z.mul(2)).add(-1);
}

let polynomialDegree = roots.length;

let F = math.parse(roots.map(root => "(z - (" + root.pos.toString() + "))").join(""));
// let F = math.parse("z^5 + z^2 - z + 1");
// let dF = math.derivative(F, "z");
let dF = math.parse("5(z^4)+2z-1");

function Q(z) {
    return z.add(1);
}

function dQ(z) {
    return z;
}

function step(point, polynomial, derivative) {
    // return point;
    return point.sub(polynomial.evaluate({ z: point }).div(derivative.evaluate({ z: point })));
}

main.init(init);
main.loop(loop);
Sketches.loop();