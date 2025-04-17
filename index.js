const ORIGINAL = process.argv[2];

const { Worker } = require("worker_threads");
let currentLength = 1;
let processed = 0;
let latest = "-";

function spawnWorker(text, id) {
    const worker = new Worker("./task.js", { argv: [ text, currentLength ] });

    worker.on("message", (data) => {
        if (data.type === "update") {
            processed += 100;
            latest = data.data;
        } else if (data.type === "result") {
            console.log("\nFound result:\n" + Buffer.from(data.result, "base64").toString().trim());
            process.exit();
        }
    });
    worker.on("error", (msg) => {
        console.error(msg);
    });

    currentLength++;
}

function bruteforce(text) {
    let cores = require('os').cpus().length * 2;
    console.log("Using " + cores + " threads");

    for (let i = 0; i <= cores; i++) {
        spawnWorker(text, i);
    }

    setInterval(() => {
        let processedP = processed;

        if (processed > 1000000000) {
            processedP = (processed / 1000000000).toFixed(1) + "B";
        } else if (processed > 1000000) {
            processedP = (processed / 1000000).toFixed(1) + "M";
        } else if (processed > 1000) {
            processedP = (processed / 1000).toFixed(1) + "K";
        }

        process.stdout.clearLine(null);
        process.stdout.cursorTo(0);
        process.stdout.write(processedP + " hashes calculated, latest: " + latest + " (" + latest.length + ")");
    }, 500);
}

bruteforce(ORIGINAL);