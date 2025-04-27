// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";
import "@oasisprotocol/sapphire-contracts/contracts/EthereumUtils.sol";

/// @title TokenAuthority for Chama DApp - Mock Oracle Only
/// @notice Simplified TokenAuthority that trusts only the Mock Eth Price Oracle (kernel 875)
contract TokenAuthority is Ownable {
    struct Keypair { bytes pubKey; bytes privKey; }

    Keypair private signingKeypair;
    Keypair private accessKeypair;

    // Trust anchors injected post-deploy
    mapping(address => bool) public nodeWhitelist;    // KRNL node public keys
    mapping(bytes32 => bool) public runtimeDigests;   // TEE runtime digests
    mapping(uint256 => bool) public kernels;          // enabled kernel IDs

    event NodeWhitelistUpdated(address indexed node, bool allowed);
    event RuntimeDigestUpdated(bytes32 indexed digest, bool allowed);
    event KernelToggled(uint256 indexed kernelId, bool allowed);

    constructor() Ownable(msg.sender) {
        signingKeypair = _generateKey();
        accessKeypair  = _generateKey();

        // Enable only the Mock Oracle kernel
        kernels[875] = true;
    }

    /// @notice Owner sets which nodes are trusted to sign runtime digests
    function setNodeWhitelist(address nodePubKey, bool allowed) external onlyOwner {
        nodeWhitelist[nodePubKey] = allowed;
        emit NodeWhitelistUpdated(nodePubKey, allowed);
    }

    /// @notice Owner sets which runtime digests are allowed
    function setRuntimeDigest(bytes32 digest, bool allowed) external onlyOwner {
        runtimeDigests[digest] = allowed;
        emit RuntimeDigestUpdated(digest, allowed);
    }

    /// @notice Owner can enable or disable kernels
    function setKernel(uint256 kernelId, bool allowed) external onlyOwner {
        kernels[kernelId] = allowed;
        emit KernelToggled(kernelId, allowed);
    }

    modifier onlyAuthorized(bytes calldata auth) {
        (
            bytes32 entryId,
            bytes memory accessToken,
            bytes32 rd,
            bytes memory rdSig,
            uint256 nonce,
            uint256 blockTime,
            bytes memory authSig
        ) = abi.decode(auth, (bytes32, bytes, bytes32, bytes, uint256, uint256, bytes));

        require(_verifyAccessToken(entryId, accessToken), "Invalid access token");
        require(_verifyRuntimeDigest(rd, rdSig), "Invalid runtime digest");
        _;
    }

    modifier onlyValidated(bytes calldata execPlan) {
        require(_verifyExecutionPlan(execPlan), "Kernel validation failed");
        _;
    }

    // Define the Exec struct outside the function
    struct Exec {
        uint256 kernelId;
        bytes result;
        bool isValidated;
        bool opinion;
    }

    /// @notice Validates Mock Oracle response (kernel 875)
    function _validateExecution(bytes calldata execPlan) external pure returns (bytes memory) {
        Exec[] memory execs = abi.decode(execPlan, (Exec[]));
        require(execs.length == 1 && execs[0].kernelId == 875, "Unexpected kernel data");

        uint256 price = abi.decode(execs[0].result, (uint256));
        bool ok = price > 0;
        execs[0].isValidated = ok;
        execs[0].opinion     = ok;

        return abi.encode(execs);
    }

    // Define a simplified Exec struct for verification
    struct ExecVerify {
        bool isValidated;
    }

    function _verifyExecutionPlan(bytes calldata execPlan) private pure returns (bool) {
        ExecVerify[] memory execs = abi.decode(execPlan, (ExecVerify[]));
        return execs.length == 1 && execs[0].isValidated;
    }

    function _generateKey() private view returns (Keypair memory) {
        bytes memory seed = Sapphire.randomBytes(32, "");
        (bytes memory pub, bytes memory priv) = Sapphire.generateSigningKeyPair(
            Sapphire.SigningAlg.Secp256k1PrehashedKeccak256, seed
        );
        return Keypair(pub, priv);
    }

    function _verifyAccessToken(bytes32 entryId, bytes memory accessToken) private view returns (bool) {
        bytes memory digest = abi.encodePacked(keccak256(abi.encode(entryId)));
        return Sapphire.verify(
            Sapphire.SigningAlg.Secp256k1PrehashedKeccak256,
            accessKeypair.pubKey,
            digest,
            "",
            accessToken
        );
    }

    function _verifyRuntimeDigest(bytes32 rd, bytes memory sig) private view returns (bool) {
        address signer = ECDSA.recover(rd, sig);
        return nodeWhitelist[signer] && runtimeDigests[rd];
    }

    /// @notice Registers the DApp entry and returns an access token
    function registerdApp(bytes32 entryId) external view returns (bytes memory) {
        bytes32 d = keccak256(abi.encode(entryId));
        return Sapphire.sign(
            Sapphire.SigningAlg.Secp256k1PrehashedKeccak256,
            accessKeypair.privKey,
            abi.encodePacked(d),
            ""
        );
    }

    /// @notice Final signature after passing mock oracle validation
    function sign(
        bytes calldata auth,
        address sender,
        bytes calldata execPlan,
        bytes calldata fnParams,
        bytes calldata krnlParams,
        bytes calldata krnlResponses
    )
        external
        view
        onlyAuthorized(auth)
        onlyValidated(execPlan)
        returns (
            bytes memory responseSig,
            bytes32 paramsDigest,
            bytes memory functionSig,
            bool finalOpinion
        )
    {
        // Kernel response digest
        bytes32 respDigest = keccak256(abi.encodePacked(krnlResponses, sender));
        responseSig = _signDigest(respDigest);

        // Params digest
        paramsDigest = keccak256(abi.encodePacked(krnlParams, sender));

        // Final opinion
        finalOpinion = abi.decode(krnlResponses, (uint256)) > 0;

        // Function call digest
        bytes32 dataDigest = keccak256(
            abi.encodePacked(keccak256(fnParams), paramsDigest, sender, finalOpinion)
        );
        functionSig = _signDigest(dataDigest);
    }

    function _signDigest(bytes32 d) private view returns (bytes memory) {
        bytes memory raw = Sapphire.sign(
            Sapphire.SigningAlg.Secp256k1PrehashedKeccak256,
            signingKeypair.privKey,
            abi.encodePacked(d),
            ""
        );
        (, SignatureRSV memory rsv) = EthereumUtils.toEthereumSignature(
            signingKeypair.pubKey,
            d,
            raw
        );
        return abi.encodePacked(rsv.r, rsv.s, uint8(rsv.v));
    }
}
