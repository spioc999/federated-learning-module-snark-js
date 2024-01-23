pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

template MultiplyAndPoseidonHasher() {
    signal input id;
    signal input num;
    signal m;
    signal output out;

    m <== id + num;

    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== id;
    out <== poseidon.out;
}

component main = MultiplyAndPoseidonHasher();