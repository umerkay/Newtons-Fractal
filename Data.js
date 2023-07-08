

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
    new NumberInput("Scale", "zoom", 100, { min: 10, max: 10000, step: 10, parent: "#Variables", range: true }).setOnInput(() => {
        if (!doRedraw && main) {
            // setPixelArray(Variables.zoom);
            doRedraw = true;
        }
    });
    new CheckBox("Show shading", "doFade", false, { parent: "#Variables" });
    new NumberInput("Shading", "fadeTolerance", 10, { min: 1, max: 100, step: 1, parent: "#Variables", range: true });
    // dragElement(document.getElementById("DataBox"));
    const _position1 = { x: 0, y: 0 }
    // interact('#DataBox').draggable({
    //     listeners: {
    //         start(event) {
    //             console.log(event.type, event.target)
    //         },
    //         move(event) {
    //             _position1.x += event.dx
    //             _position1.y += event.dy

    //             event.target.style.transform =
    //                 `translate(${_position1.x}px, ${_position1.y}px)`
    //         },
    //     }
    // })
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