// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {KRNL, KrnlPayload, KernelResponse} from "./KRNL.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChamaFactory with Mock Oracle Pricing
/// @notice Creates and manages Chama groups; only creation is KRNL-validated for ETH→USD pricing
contract ChamaFactory is KRNL, ReentrancyGuard {
    address public immutable tokenAuthority;
    uint256 public chamaCount;

    // Store the owner address
    address private _owner;

    struct Chama {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 depositAmount;
        uint256 contributionAmount;
        uint256 depositUsd;
        uint256 contributionUsd;
        uint256 penalty;
        uint256 maxMembers;
        uint256 membersCount;
        uint256 cycleDuration;
        uint256 currentRound;
        uint256 currentCycle;
        uint256 nextCycleStart;
        address[] members;
        bool isActive;
    }

    mapping(uint256 => Chama) public chamas;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public contributions;
    mapping(uint256 => mapping(address => uint256)) public memberDeposit;

    // Optional whitelist
    mapping(address => bool) public whitelist;
    bool public whitelistEnabled = false;

    event ChamaCreated(
        uint256 indexed chamaId,
        string name,
        address indexed creator,
        uint256 depositUsd,
        uint256 contributionUsd
    );
    event JoinedChama(uint256 indexed chamaId, address indexed member);
    event ContributionMade(uint256 indexed chamaId, uint256 cycle, address indexed member, uint256 amount);
    event PayoutExecuted(uint256 indexed chamaId, uint256 cycle, address indexed recipient, uint256 totalPayout);
    event WhitelistUpdated(address indexed user, bool status);
    event WhitelistToggle(bool enabled);

    modifier onlyWhitelisted() {
        require(!whitelistEnabled || whitelist[msg.sender], "Access denied: Not whitelisted");
        _;
    }

    constructor(address _tokenAuthority) KRNL(_tokenAuthority) {
        require(_tokenAuthority != address(0), "TokenAuthority cannot be zero");
        tokenAuthority = _tokenAuthority;
        _owner = msg.sender;
    }

    // Returns the address of the current owner
    function owner() public view override returns (address) {
        return _owner;
    }

    // Transfers ownership of the contract to a new account
    function transferOwnership(address newOwner) public override {
        require(msg.sender == _owner, "Not authorized");
        require(newOwner != address(0), "New owner is the zero address");
        _owner = newOwner;
    }

    function updateWhitelist(address user, bool status) external {
        // Only the contract owner can call this function
        require(msg.sender == owner(), "Not authorized");
        whitelist[user] = status;
        emit WhitelistUpdated(user, status);
    }

    function toggleWhitelist(bool enabled) external {
        // Only the contract owner can call this function
        require(msg.sender == owner(), "Not authorized");
        whitelistEnabled = enabled;
        emit WhitelistToggle(enabled);
    }

    /// @notice Create a new Chama with ETH→USD pricing via Mock Oracle (kernel 875)
    function createChama(
        string calldata name,
        string calldata description,
        uint256 depositAmount,
        uint256 contributionAmount,
        uint256 penalty,
        uint256 maxMembers,
        uint256 cycleDuration,
        KrnlPayload calldata krnlPayload
    )
        external
        onlyWhitelisted
        onlyAuthorized(krnlPayload, abi.encode(name, description, depositAmount, contributionAmount, penalty, maxMembers, cycleDuration))
        returns (uint256)
    {
        require(maxMembers > 0, "Max members > 0");
        require(depositAmount > 0 && contributionAmount > 0, "Amounts > 0");

        // Decode Mock Oracle response
        KernelResponse[] memory resp = abi.decode(krnlPayload.kernelResponses, (KernelResponse[]));
        require(resp.length == 1 && resp[0].kernelId == 875, "Invalid oracle response");
        uint256 ethUsd = abi.decode(resp[0].result, (uint256));
        require(ethUsd > 0, "Oracle price zero");

        // Compute USD equivalents (18-decimal ETH assumed)
        uint256 depositUsd = (depositAmount * ethUsd) / 1e18;
        uint256 contributionUsd = (contributionAmount * ethUsd) / 1e18;

        // Initialize Chama
        chamaCount++;
        Chama storage c = chamas[chamaCount];
        c.id = chamaCount;
        c.creator = msg.sender;
        c.name = name;
        c.description = description;
        c.depositAmount = depositAmount;
        c.contributionAmount = contributionAmount;
        c.depositUsd = depositUsd;
        c.contributionUsd = contributionUsd;
        c.penalty = penalty;
        c.maxMembers = maxMembers;
        c.cycleDuration = cycleDuration;
        c.currentRound = 1;
        c.currentCycle = 1;
        c.nextCycleStart = block.timestamp + cycleDuration;
        c.isActive = true;

        emit ChamaCreated(chamaCount, name, msg.sender, depositUsd, contributionUsd);
        return chamaCount;
    }

    /// @notice Join an existing Chama by staking the deposit
    function joinChama(uint256 chamaId) external payable onlyWhitelisted {
        Chama storage c = chamas[chamaId];
        require(c.isActive, "Inactive");
        require(c.membersCount < c.maxMembers, "Chama full");
        require(msg.value == c.depositAmount, "Incorrect deposit");
        require(!isMember(chamaId, msg.sender), "Already member");

        c.members.push(msg.sender);
        c.membersCount++;
        memberDeposit[chamaId][msg.sender] = c.depositAmount;

        emit JoinedChama(chamaId, msg.sender);
    }

    /// @notice Make a contribution for the current cycle
    function contribute(uint256 chamaId) external payable onlyWhitelisted {
        Chama storage c = chamas[chamaId];
        require(c.isActive, "Inactive");
        require(isMember(chamaId, msg.sender), "Not member");
        require(msg.value == c.contributionAmount, "Incorrect amount");
        require(block.timestamp < c.nextCycleStart, "Cycle over");
        require(!contributions[chamaId][c.currentCycle][msg.sender], "Already contributed");

        contributions[chamaId][c.currentCycle][msg.sender] = true;
        emit ContributionMade(chamaId, c.currentCycle, msg.sender, msg.value);
    }

    /// @notice Execute the round-robin payout for the cycle
    function payout(uint256 chamaId) external nonReentrant onlyWhitelisted {
        Chama storage c = chamas[chamaId];
        require(c.isActive, "Inactive");
        require(block.timestamp >= c.nextCycleStart, "Cycle not ended");
        require(c.membersCount == c.maxMembers, "Chama not full");

        uint256 pool = _calculateTotalPool(chamaId);
        address recipient = c.members[c.currentRound - 1];
        uint256 cycleNum = c.currentCycle;

        c.currentRound = (c.currentRound % c.maxMembers) + 1;
        c.currentCycle++;
        c.nextCycleStart = block.timestamp + c.cycleDuration;

        (bool sent,) = recipient.call{value: pool}("");
        require(sent, "Payout failed");
        emit PayoutExecuted(chamaId, cycleNum, recipient, pool);
    }

    /// @dev Summation of contributions and penalties for cycle
    function _calculateTotalPool(uint256 chamaId) internal returns (uint256 pool) {
        Chama storage c = chamas[chamaId];
        for (uint i = 0; i < c.members.length; i++) {
            address m = c.members[i];
            if (contributions[chamaId][c.currentCycle][m]) {
                pool += c.contributionAmount;
            } else {
                uint256 fee = (c.depositAmount * c.penalty) / 100;
                require(memberDeposit[chamaId][m] >= fee, "Insufficient collateral");
                memberDeposit[chamaId][m] -= fee;
                pool += fee;
            }
        }
    }

    /// @notice Check membership
    function isMember(uint256 chamaId, address user) public view returns (bool) {
        Chama storage c = chamas[chamaId];
        for (uint i = 0; i < c.members.length; i++) {
            if (c.members[i] == user) return true;
        }
        return false;
    }

    receive() external payable {}
}
