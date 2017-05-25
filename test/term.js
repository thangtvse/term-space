const spawn = require("child_process").spawn;
const bat = spawn("cmd.exe", ["npm", "install", "gulp", "-g"]);

bat.stdout.on("data", data => {
    console.log("out:\n" + '"' + data + '"');
});

bat.stderr.on("data", data => {
    console.log("err:\n" + '"' + data + '"');
});

bat.on("exit", code => {
    console.log(`Child exited with code ${code}`);
});

bat.stdin.write("npm install gulp -g --ansi\n");
bat.stdin.end();
