const { parentPort } = require("worker_threads");
const crypto = require('crypto');

let baseLength = 0;
let length = BigInt(parseInt(process.argv[3]));
let expect = process.argv[2];
let cores = BigInt(require('os').cpus().length * 2);

let min = 0n;

if (baseLength > 0) {
    min = BigInt(256**baseLength);
}

for (let i = min; i < Infinity; i = i + 1n) {
    if (i % cores === length) {
        let hash = crypto.createHash("md5").update(Buffer.from(i.toString(16), "hex").toString()).digest("hex");

        if (i % 100n === 0n) {
            parentPort.postMessage({
                type: "update",
                data: i.toString(16).toUpperCase()
            });
        }

        if (hash === expect) {
            parentPort.postMessage({
                type: "result",
                result: Buffer.from(i.toString(16), "hex").toString("base64")
            });
        }
    }
}