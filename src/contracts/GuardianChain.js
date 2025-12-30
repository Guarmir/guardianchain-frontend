const guardianChainAbi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "author", "type": "address" },
      { "indexed": true, "internalType": "bytes32", "name": "proofHash", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ProofRegistered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "proofHash", "type": "bytes32" }
    ],
    "name": "registerProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default guardianChainAbi;
