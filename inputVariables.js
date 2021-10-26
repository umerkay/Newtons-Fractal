const Variables = {};
Variables.set = (id, value) => {
    document.getElementById(id).value = value;
    document.getElementById(id).checked = value;
    document.getElementById(id).dispatchEvent(new Event("input"));
    document.getElementById(id).dispatchEvent(new Event("change"));
};
Variables.disable = id => document.getElementById(id).disabled = true;
Variables.enable = id => document.getElementById(id).disabled = false;

class InputVariable {
    constructor(type, data = {}) {
        this.type = type || "text";
        this._value = data.value;
        this.id = data.id || null;

        this.parent = !data.parent ? document.body : data.parent instanceof HTMLElement ? data.parent : document.querySelector(data.parent);
        this.container = document.createElement("div");
        if (this.id) this.container.setAttribute("id", this.id + "Container");
        this.container.classList.add("VariableContainer");
        this.parent.appendChild(this.container);

        if (data.label) {
            this.label = document.createElement("label");
            this.label.innerHTML = data.label;
            this.label.classList.add("VariableLabel");
            if (this.id) this.label.setAttribute("for", this.id);

            this.container.appendChild(this.label);
        }
    }

    addEventListeners() {
        this.el.addEventListener("input", (e) => {
            this.value = e.target.value;
            if (this.id) Variables[this.id] = this.value;
            if (this.onInputF) this.onInputF();
        });
    }

    setOnInput(f) {
        this.onInputF = f;
    }
}

class TextInput extends InputVariable {
    constructor(label, id, value = "", data) {
        super("text", { label, value, id, ...data });
        this.container.classList.add("TextVariableContainer");

        this.el = document.createElement("input");
        this.el.classList.add("TextVariableInput");
        this.el.classList.add("VariableInput");

        this.el.setAttribute("type", "text");
        this.el.setAttribute("placeholder", data.placeholder);
        this.el.setAttribute("id", id || null);
        this.el.value = value;

        this.container.appendChild(this.el);

        this.addEventListeners();
        if (this.id) Variables[this.id] = this.el.value;
    }
}

class NumberInput extends InputVariable {
    constructor(label, id, value = "", data) {
        super("number", { label, value, id, ...data });
        this.container.classList.add("NumberVariableContainer");

        this.el = document.createElement("input");
        this.el.classList.add("TextVariableInput");
        this.el.classList.add("VariableInput");

        this.el.setAttribute("type", data.range ? "range" : "number");
        this.el.setAttribute("id", id || null);

        this.el.setAttribute("min", data.min);
        this.el.setAttribute("max", data.max);
        this.el.setAttribute("step", data.step);
        this.el.value = value;

        this.container.appendChild(this.el);

        this.addEventListeners();
        if (this.id) Variables[this.id] = parseFloat(this.el.value);
    }

    addEventListeners() {
        this.el.addEventListener("input", (e) => {
            this.value = e.target.value;
            if (this.id) Variables[this.id] = parseFloat(this.value);
            if (this.onInputF) this.onInputF();
        });
    }
}

class SelectInput extends InputVariable {
    constructor(label, id, options = [], valueIndex, data) {
        super("select", { label, valueIndex, id, ...data });
        this.container.classList.add("SelectVariableContainer");

        this.el = document.createElement("select");
        this.el.classList.add("VariableInput");

        options.forEach((option, i) => {
            let optEl = document.createElement("option");
            optEl.setAttribute("value", i);
            optEl.innerHTML = option;
            this.el.appendChild(optEl);
        });
        this.options = options;
        this.value = valueIndex;
        this.el.value = this.value;

        this.el.classList.add("SelectVariableInput");
        this.el.setAttribute("id", id || null);
        this.el.value = valueIndex;

        this.container.appendChild(this.el);

        this.addEventListeners();
        if (this.id) Variables[this.id] = this.options[this.el.value];
    }

    addEventListeners() {
        this.el.addEventListener("change", (e) => {
            this.value = e.target.value;
            if (this.id) Variables[this.id] = this.value;
            if (this.onInputF) this.onInputF(e.target.value);
        });
    }
}

class CheckBox extends InputVariable {
    constructor(label, id, checked = false, data) {
        super("checkbox", { label, checked, id, ...data });
        this.container.classList.add("BoolVariableContainer");

        this.el = document.createElement("input");
        this.el.classList.add("VariableInput");
        this.el.classList.add("TextVariableInput");

        this.el.setAttribute("type", "checkbox");
        this.el.setAttribute("id", id || null);
        this.el.checked = checked;

        this.container.appendChild(this.el);

        this.addEventListeners();
        if (this.id) Variables[this.id] = this.el.checked;
    }

    addEventListeners() {
        this.el.addEventListener("input", (e) => {
            this.checked = e.target.checked;
            if (this.id) Variables[this.id] = this.el.checked;
            if (this.onInputF) f();
        });
    }
}