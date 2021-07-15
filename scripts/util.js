"use strict"

const { spawn } = require("child_process");
const platform = require("os").platform();

module.exports = {
    async runCmds (cmds = [], cwd = process.cwd()) {
        const codes = [];
        for (let cmd of cmds) {
            codes.push(await new Promise((resolve, reject) => {
                const params = cmd.replace(/\s+/g, " ").split(" ");
                const p = spawn(params.shift(), params, { cwd, stdio: "inherit", shell: platform === "win32" ? true : false });
                p.on("error", reject);
                p.on("exit", resolve);
            }));
        }
        return codes.every(code => code === 0);
    }
}