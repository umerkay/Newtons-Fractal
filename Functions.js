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
        buffer[index] = color.r * ((itts) / Variables.fadeTolerance);
        buffer[index + 1] = color.g * (itts / Variables.fadeTolerance);
        buffer[index + 2] = color.b * (itts / Variables.fadeTolerance);
        buffer[index + 3] = 255;
    } else {
        buffer[index] = color.r;
        buffer[index + 1] = color.g;
        buffer[index + 2] = color.b;
        buffer[index + 3] = 255;
    }
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

    main = new Sketch({ width: Variables.width, height: Variables.height, frameRate: 10, container: c });
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

map = function (
    n,
    start1,
    stop1,
    start2,
    stop2,
    withinBounds
) {
    var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return this.constrain(newval, start2, stop2);
    } else {
        return this.constrain(newval, stop2, start2);
    }
};

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

class Point {
    constructor(c, color = "white", index) {
        this.pos = new Complex(c);
        this.color = color;
        this.isRoot = color !== "white";
        this.index = index;
    }
}