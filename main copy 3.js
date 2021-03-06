class Point {
    constructor(c, color = "white", index) {
        this.pos = new Complex(c);
        this.color = color;
        this.isRoot = color !== "white";
        this.index = index;
    }
}

// const main = new Sketch({ width, height: height - 5, frameRate: 60 });
let main;
let pointsArray = [];

let ColorSchemes = [
    {
        title: "Blue", colors: [
            new Color(0, 247, 255),
            new Color(132, 0, 255),
            new Color(54, 0, 191),
            new Color(0, 162, 232),
            new Color(163, 246, 255),
            new Color(154, 10, 191),
            new Color(10, 102, 232),
            new Color(103, 146, 255)]
    },
    {
        title: "Trichromatic", colors: [new Color(255, 25, 25), new Color(25, 25, 255), new Color(25, 255, 25)]
    },
    {
        title: "Purple", colors: [
            new Color(25, 50, 255),
            new Color(132, 0, 255),
            new Color(54, 0, 191),
            new Color(255, 162, 232),
            new Color(163, 246, 255),
            new Color(50, 48, 89),
            new Color(229, 25, 251),
            new Color(0, 85, 195),
        ]
    },
    {
        title: "Henna", colors: [
            new Color(237, 201, 183),

            new Color(97, 48, 0),

            new Color(97, 48, 0),
            new Color(97, 48, 0),


            new Color(237, 201, 183),
            new Color(237, 201, 183),

            new Color(237, 201, 183),
            new Color(237, 201, 183),
            new Color(237, 201, 183),
            new Color(237, 201, 183),
            new Color(237, 201, 183),
        ]
    }
]

const Presets = [
    {
        title: "Custom",
        roots: [],
        colorScheme: 0,
        zoom: 150,
        steps: "Infinity",
        showAnim: true,
        render: {
            func: "Custom-func.svg"
        }
    }, {
        title: "3b1b",
        roots: ["-1.32472", "-i", "i", "0.66236 - 0.56228i", "0.66236 + 0.56228i"
        ],
        colorScheme: 0,
        zoom: 150,
        steps: "Infinity",
        showAnim: true,
        render: {
            func: "3b1b-func.svg"
        }
    }, {

        title: "Cubic",
        roots: ["1", "-0.5 - 0.86603i", "-0.5 + 0.86603i"],
        zoom: 150,
        steps: "Infinity",
        doFade: true,
        colorScheme: 1,
        fadeTolerance: 32,
        showAnim: true,
        render: {
            func: "Cubic-func.svg"
        }
    }, {

        title: "Hexa",
        roots: ["0.8518", "-1.17398", "0.58699+1.0167i", "0.58699-1.0167i", "-0.4259+0.73768i", "-0.4259-0.73768i"],
        zoom: 150,
        steps: "Infinity",
        colorScheme: 0,
        showAnim: true,
        render: {
            func: "Hexa-func.svg"
        }
    }, {

        title: "Balloon",
        roots: ["1", "-1", "i", "-i", "-1.41421 + 1.41421i", "-1.41421 - 1.41421i", "1.41421 + 1.41421i", "1.41421 - 1.41421i"],
        zoom: 200,
        steps: 70,
        doFade: true,
        colorScheme: 2,
        fadeTolerance: 32,
        showAnim: true,
        render: {
            func: "Chaos-func.svg"
        }
    }
]

let roots;
let polynomialDegree;

document.addEventListener("DOMContentLoaded", () => {
    new SelectInput("Preset", "preset", Presets.map(p => p.title), null, { parent: "#Variables" }).setOnInput((i) => {

        document.getElementById("funcoutput").innerHTML = null;
        if (Presets[i].render) {
            let img = document.createElement("img");
            img.src = Presets[i].render.func;
            document.getElementById("funcoutput").appendChild(img);
        }
        Variables.set("zoom", Presets[i].zoom);
        Variables.set("roots", JSON.stringify(Presets[i].roots));
        Variables.set("colors", Presets[i].colorScheme);
        Variables.set("steps", parseFloat(Presets[i].steps));
        Variables.set("showAnim", Presets[i].showAnim);
        Variables.set("doFade", Presets[i].doFade || false);
        Variables.set("fadeTolerance", Presets[i].fadeTolerance || 10);
        if (i > 0) {
            Variables.disable("roots");
        } else {
            Variables.enable("roots");
        }

    });
    new SelectInput("Color Scheme", "colors", ColorSchemes.map(p => p.title), 0, { parent: "#Variables" });
    new TextInput("Roots", "roots", "[]", { parent: "#Variables" });
    new TextInput("Steps", "steps", 12, { parent: "#Variables" });
    new CheckBox("Render steps", "showAnim", true, { parent: "#Variables" });
    new NumberInput("Width", "width", 400, { min: 100, max: width, step: 1, parent: "#Variables", range: true });
    new NumberInput("Height", "height", 400, { min: 100, max: height - 4, step: 1, parent: "#Variables", range: true });
    new NumberInput("Scale", "zoom", 100, { min: 1, max: 1000, step: 10, parent: "#Variables", range: true });
    new CheckBox("Show shading", "doFade", false, { parent: "#Variables" });
    new NumberInput("Shading", "fadeTolerance", 10, { min: 1, max: 100, step: 1, parent: "#Variables", range: true });
    // dragElement(document.getElementById("DataBox"));
    const _position1 = { x: 0, y: 0 }
    interact('#DataBox').draggable({
        listeners: {
            start(event) {
                console.log(event.type, event.target)
            },
            move(event) {
                _position1.x += event.dx
                _position1.y += event.dy

                event.target.style.transform =
                    `translate(${_position1.x}px, ${_position1.y}px)`
            },
        }
    })
    Variables.set("preset", 1);


    (function () {
        var logger = document.getElementById('log');
        document.log = function (message, ...args) {
            if (typeof message == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
            } else {
                logger.innerHTML += message + '<br />';
            }
        }
    })();
});

let buffer, idata;
let start;

function init() {
    buffer = new Uint8ClampedArray(width * height * 4);
    idata = main.currentCtx.createImageData(width, height);
    start = performance.now();
    pointsArray = [];

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            pointsArray.push({ re: (x - width / 2) / Variables.zoom, im: (y - height / 2) / Variables.zoom, index: (y * width + x) * 4 });
            detPixelColor(pointsArray[pointsArray.length - 1]);
        }
    }

    idata.data.set(buffer);
    main.currentCtx.putImageData(idata, 0, 0);

    toggleRenderBtn(false);
}

function loop() {
    if (this._frames === 0) console.log(this._frames_last)
    let now = performance.now();

    if (main._frameCount <= Variables.steps && pointsArray.length > 0) {
        console.log(main._frameCount + " started rendering", pointsArray.length);

        pointsArray = pointsArray.filter((point, i) => {
            step(point);
            return !point.reached;
        });
    } else {
        Sketches.stopLoop();
    }

    if (Variables.showAnim || main._frameCount === Variables.steps || pointsArray.length === 0) {
        clear();
        idata.data.set(buffer);
        main.currentCtx.putImageData(idata, 0, 0);
    }

    console.log(main._frameCount + " rendered in ", (performance.now() - now), "ms");
    if (main._frameCount > Variables.steps || pointsArray.length === 0) {
        document.log("Render took " + ((performance.now() - start) / 1000).toFixed(2) + "s and " + (main._frameCount - 1) + " frames");
        toggleRenderBtn(true);
        Sketches.stopLoop();
    }
}

function detPixelColor(point) {
    let closest = null;
    let closestDist = Infinity;
    for (let root of roots) {
        let d = distSq(point.re, point.im, root.pos.re, root.pos.im);
        if (d < closestDist) {
            closest = root;
            closestDist = d;
            if (d < 1 / Variables.zoom) {
                point.reached = true;
                continue;
            }
        }
    }
    // if (!closest) point.reached = true;
    setPixelColor(point.index, closest?.color || new Color(255), point.reached);
}

function setPixelColor(index, color) {
    if (Variables.doFade) {
        buffer[index] = color.r * ((main._frameCount) / Variables.fadeTolerance);
        buffer[index + 1] = color.g * (main._frameCount / Variables.fadeTolerance);
        buffer[index + 2] = color.b * (main._frameCount / Variables.fadeTolerance);
        buffer[index + 3] = 255;
    } else {
        buffer[index] = color.r;
        buffer[index + 1] = color.g;
        buffer[index + 2] = color.b;
        buffer[index + 3] = 255;
    }
}
// let a = new Complex(2, 0);
function complexReciprocal(re, im, canReach) {
    let div = (re * re + im * im);
    if (div < (1 / Variables.zoom) && canReach !== false) {
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
            point.reached = true;
            setPixelColor(point.index, root.color)
            return;
        } else {
            sum.im += rec.im;
            sum.re += rec.re;
        }
    }
    let rec = complexReciprocal(sum.re, sum.im, false);
    point.re -= rec.re;
    point.im -= rec.im;
}

function closeSketch(index) {
    openSketches = openSketches.filter(s => s != index);
    if (index === main) toggleRenderBtn(true);
    index.stopLoop();
    index.container.remove();
    index = null;
}

function toggleRenderBtn(enabled) {
    document.getElementById("render").disabled = !enabled;
    document.getElementById("render").innerHTML = enabled ? "Render" : "Rendering...";
}

let openSketches = [];

function StartRender() {
    if (!Variables.preset) return window.alert("Select a preset");
    if (!Variables.roots) return window.alert("The roots of the function are required");
    if (Variables.preset == 0) {
        try {
            _roots = JSON.parse(Variables.roots);
        } catch (err) {
            document.log("Error: " + err);
            return;
        }
    }

    if (Sketches.all.length > 0) Sketches.all[Sketches.all.length - 1] = null;

    let c = document.createElement("div");
    c.setAttribute("id", "dbC" + Sketches.all.length);
    c.classList.add("dragC");

    // let header = document.createElement("span");
    // header.innerHTML = "Drag to move";
    // header.setAttribute("id", c.id + "header");
    // header.classList.add("dragH");

    let close = document.createElement("span");
    close.innerHTML = "Close";
    close.classList.add("dragCl");
    let i = Sketches.all.length;

    // c.appendChild(header);
    c.appendChild(close);
    document.getElementById("dbC").appendChild(c);

    // dragElement(c);
    const _position2 = { x: 0, y: 0 }
    interact(c).draggable({
        listeners: {
            start(event) {
                console.log(event.type, event.target)
            },
            move(event) {
                _position2.x += event.dx
                _position2.y += event.dy

                event.target.style.transform =
                    `translate(${_position2.x}px, ${_position2.y}px)`
            },
        }
    })

    c.style.left = (openSketches.length) + "rem";
    c.style.top = (openSketches.length) + "rem";

    main = new Sketch({ width: Variables.width, height: Variables.height, frameRate: 60, container: c });
    openSketches.push(main);

    let m = main;
    close.addEventListener("click", () => closeSketch(m));

    // main = new Sketch({ width, height: height - 4, frameRate: 60 });
    // roots = Presets[Variables.preset].roots;
    roots = (Variables.preset > 0 ? Presets[Variables.preset].roots : _roots).map((r, i) => new Point(new Complex(r), ColorSchemes[Variables.colors].colors[i % ColorSchemes[Variables.colors].colors.length]));
    polynomialDegree = roots.length;

    main.init(init);
    main.loop(loop);
    Sketches.loop();
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.style.right = "unset";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}