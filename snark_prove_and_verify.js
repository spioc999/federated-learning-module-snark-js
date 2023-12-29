const snarkjs = require("snarkjs");
const fs = require("fs");

async function run() {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        { in: 10 }, 
        "snark/poseidon_hasher.wasm", 
        "snark/poseidon_hasher_prove.zkey");
    console.log(publicSignals);
    console.log(proof);

    const vKey = JSON.parse(fs.readFileSync("snark/poseidon_hasher_verify.json"));
    console.log(vKey);
    const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

    if (res === true) {
        console.log("Verification OK");
    } else {
        console.log("Invalid proof");
    }
}

run().then(() => {
    process.exit(0);
});
