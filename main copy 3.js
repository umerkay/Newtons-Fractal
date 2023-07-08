let main;
let pointsArray = [];

let roots;
let polynomialDegree;

let buffer, idata;
let start, steps;
let doRedraw = false;

function init() {
    buffer = new Uint8ClampedArray(width * height * 4);
    idata = main.currentCtx.createImageData(width, height);
    start = performance.now();
    pointsArray = [];

    steps = Variables.steps;

    // setPixelArray(Variables.zoom);

    idata.data.set(buffer);
    main.currentCtx.putImageData(idata, 0, 0);

    // toggleRenderBtn(false);
    doRedraw = true;

    // main.addCanvas();

    // main.on("click", e => {
    //     anchor.pos.im = mouse.position.y - width / 2;
    //     anchor.pos.re = mouse.position.x - height / 2;
    //     doRedraw = true;
    // });

    // anchor = new Point(new Complex(0, 0), "red");
}

let anchor;

let setPixelArray = async (zoom) => {
    pointsArray = [];
    height = main.height;
    width = main.width
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            let p = { re: (x - height / 2) / zoom, im: (y - width / 2) / zoom, index: ((y) * width + x) * 4 };
            pointsArray.push(p);
            detPixelColor(p);
        }
    }
};

let filterPoints = point => !step(point);
let itts;

function loop() {
    if (doRedraw) {
        setLayer(0);
        setPixelArray(Variables.zoom);
        itts = 0;
        while (pointsArray.length > 0 && itts < steps) {
            pointsArray = pointsArray.filter(filterPoints);
            itts++;
        }
        doRedraw = false;
        redraw();
    }
    // setLayer(1);
    // clear();
    // translate(width / 2, height / 2);
    // fill(anchor.color);
    // stroke(white);
    // circle(anchor.pos.re, anchor.pos.im, 5);
}

function redraw() {
    clear();
    idata.data.set(buffer);
    main.currentCtx.putImageData(idata, 0, 0);
}

// let a = new Complex(2, 0);
function complexReciprocal(re, im, canReach) {
    let div = (re * re + im * im);
    if (div < (1 / (Variables.zoom)) && canReach !== false) {
        return { im: 0, re: 0 }
    }
    let div_r = 1 / div;
    return { re: re * div_r, im: -im * div_r };
}

function step(point) {
    let sum = { im: 0, re: 0 };
    for (let root of roots) {
        let rec = complexReciprocal(point.re - root.pos.re, point.im - root.pos.im);
        if (rec.im === 0 && rec.re === 0) {
            setPixelColor(point.index, root.color)
            return true;
        } else {
            sum.im += rec.im;
            sum.re += rec.re;
        }
    }
    let rec = complexReciprocal(sum.re, sum.im, false);
    point.re -= rec.re;
    point.im -= rec.im;
}