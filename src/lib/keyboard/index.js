"use strict";

export default class Keyboard {
    static index = 0;
    static create (inputElements = []) {
        return inputElements.map(inputElement => {
            const _ = new Keyboard(inputElement);
            inputElement.onfocus = () => {
                _.show();
                _.input.value = _.text = inputElement.value;
            }
            return _;
        });
    }

    static numkeys = [
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["tab", "z", "x", "c", "v", "b", "n", "m", "退格"],
        ["符号", "空格", "确定"]
    ];

    static symbolkeys = [
        ["~", "!", "@", "#", "$", "%", "^", "&", "*", "("],
        [")", "_", "+", ":", "{", "}", "[", "]", "|", "\\"],
        ["-", "?",">", "<", "\,", ".", "/", "\"", "="],
        ["字母", "确定"]
    ];

    keyboardId = "";
    keyboard = null;
    keyboardWidth = 0;
    input = null;
    originInput = null;
    buttons = null;
    isUp = false;
    text = "";
    mask = null;

    constructor (inputElement = null) {
        this.originInput = inputElement;
        const kb = this.keyboard = document.createElement("div");
        const index = Keyboard.index++;
        kb.setAttribute("data-keyboardid", index);
        kb.id = "keyboard";
        this.keyboardId = index;
        document.body.appendChild(kb);
        this.keyboardWidth = kb.offsetWidth;
    }

    show () {
        this._init();
    }

    hide () {
        this._destory();
    }

    destory () {
        this._destory();
        document.body.removeChild(this.keyboard);
    }

    _init () {
        const keyboard = this.keyboard;
        const input = this.input = document.createElement("input");
        input.style.width = this.keyboardWidth - 10 + "px";
        input.placeholder = "请点击按钮进行输入...";
        input.type = "text";
        input.className = "input";
        keyboard.appendChild(input); 
        const line = document.createElement("div");
        line.className = "line";
        keyboard.appendChild(line);
        const mask = this.mask = document.createElement("div");
        mask.style.cssText = `
            height: 100%;
            width: 100%;
            position: fixed;
            left: 0; top: 0;
            z-index: 9998;
            background:  rgba(0,0,0,0.5);
        `;
        mask.onclick = this._destory.bind(this);
        document.body.appendChild(mask);
        input.autofocus = true;
        const buttons = this.buttons = document.createElement("div");
        keyboard.appendChild(buttons);
        this._renderKeys();
    }

    _destory () {
        this.originInput = null;
        this.mask && document.body.removeChild(this.mask);
        this.mask = null;
        Array.from(this.keyboard.childNodes).forEach(node => this.keyboard.removeChild(node));
    }

    _destoryKeyboard () {
        this.buttons.innerHTML = "";
    }

    _symbolClick ({ target: { innerText: key } }) {
        switch (key) {
            case "字母":
                this._renderKeys();
            break;
            case "确定":
                this._destory();
            break;
            default:
                this.text += key;
        }
        this.input.value = this.text;
        this.originInput && (this.originInput.value = this.text);
    }

    _keyClick ({ target: { innerText: key } }) {
        switch (key) {
            case "退格": 
                this.text = this.text.slice(0, -1);
            break;
            case "确定":
                this._destory();
            break;
            case "tab":
                this.isUp = !this.isUp;
                this._renderKeys();
            break;
            case "空格":
                this.text += " ";
            break;
            case "符号":
                this._renderSymbol();
            break;
            default:
                this.text += key;       
        }
        this.input.value = this.text;
        this.originInput && (this.originInput.value = this.text);
    }

    _renderKeys () {
        this._destoryKeyboard();
        const width =  this.keyboardWidth / 10 - 5;
        this.keyboard.style.display = "none";
        for (let i of Keyboard.numkeys) {
            const row = document.createElement("div");
            row.className = "row";
            const rowin = document.createElement("div");
            rowin.className = "in";
            for (let j of i) {
                const child = document.createElement("div");
                child.className = "child";
                child.style.height = width + "px";
                child.style.lineHeight = width + "px";
                child.onclick = this._keyClick.bind(this);
                if (j === "tab" || j === "TAB") {
                    if (this.isUp) child.className = "child active";
                    else child.className = "child";
                }
                if (["tab", "退格"].includes(j)) {
                    child.style.width = width + width / 2 + "px";
                } 
                else if (["符号", "确定"].includes(j)) {
                    child.style.width = width * 2 + "px";
                }
                else if (j === "空格") {
                    child.style.width = width * 6 + 6 * 5 + "px";
                } 
                else {
                    child.style.width = width + "px";
                }
                child.innerText = this.isUp && !["tab"].includes(j) ? j.toLocaleUpperCase() : j;
                rowin.appendChild(child);
            }
            row.appendChild(rowin);
            this.buttons.appendChild(row);
        }
        this.keyboard.style.display = "block";
    }

    _renderSymbol () {
        this._destoryKeyboard();
        const width =  this.keyboardWidth / 10 - 5;
        this.keyboard.style.display = "none";
        for (let i of Keyboard.symbolkeys) {
            const row = document.createElement("div");
            row.className = "row";
            const rowin = document.createElement("div");
            rowin.className = "in";
            for (let j of i) {
                const child = document.createElement("div");
                child.className = "child";
                child.style.height = width + "px";
                child.style.lineHeight = width + "px";
                child.onclick = this._symbolClick.bind(this);
                if (["字母", "确定"].includes(j)) {
                    child.style.width = width * 5 + 20 + "px";
                }
                else {
                    child.style.width = width + "px";
                }
                child.innerText = j;
                rowin.appendChild(child);
            }
            row.appendChild(rowin);
            this.buttons.appendChild(row);
        }
        this.keyboard.style.display = "block";
    }
}