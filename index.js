const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

var express = require('express');
var app = express();
app.use(express.json());

const port = 3000;
const basePathSnarkCircuit = './snark/poseidon_hasher';

app.get('/health', (_, res) => {
    res.status(200).json({status: 'ok'});
});

app.post('/prove', async function (req, res) {
    try {
        const body = req.body;
        if(!Object.keys(body).includes('input')){
            return res.status(400).json({
                code: 400,
                message: 'Bad request!',
            });
        }

        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            body.input, 
            fs.readFileSync(path.resolve(`${basePathSnarkCircuit}.wasm`)),
            fs.readFileSync(path.resolve(`${basePathSnarkCircuit}_prove.zkey`))
        );

        res.status(200).json({
            proof: proof,
            publicSignals: publicSignals
        })

    }catch(e){
        console.error(`POST /prove => ${e.message}`);
        res.status(500).json({
            code: 500,
            message: `Something went wrong!`,
            details: `${e.message}`
        })
    }
})

app.post('/verify', async function (req, res) {
    try {
        const body = req.body;
        if(!Object.keys(body).includes('publicSignals')
            || !Object.keys(body).includes('proof')){
            return res.status(400).json({
                code: 400,
                message: 'Bad request!',
            });
        }

        const vKey = fs.readFileSync(path.resolve(`${basePathSnarkCircuit}_verify.json`));

        const result = await snarkjs.groth16.verify(
            JSON.parse(vKey),
            body.publicSignals,
            body.proof
        );

        res.status(200).json({
            verification: result === true,
        })

    }catch(e){
        console.error(`POST /verify => ${e.message}`);
        res.status(500).json({
            code: 500,
            message: `Something went wrong!`,
            details: `${e.message}`
        })
    }
})

app.listen(port, () => console.log(`Snark-module on port ${port}`))