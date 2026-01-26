// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingWorkflow is Ownable {
    struct Candidate {
        string name;
        uint256 votes;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    bool public votingOpen;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event VotingStatusChanged(bool open);
    event Voted(address indexed voter, uint256 indexed candidateId);

    constructor() Ownable(msg.sender) {}

    function addCandidate(string calldata name) external onlyOwner {
        require(!votingOpen, "Voting already started");
        candidates.push(Candidate({ name: name, votes: 0 }));
        emit CandidateAdded(candidates.length - 1, name);
    }

    function setVotingOpen(bool open) external onlyOwner {
        votingOpen = open;
        emit VotingStatusChanged(open);
    }

    function vote(uint256 candidateId) external {
        require(votingOpen, "Voting is closed");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].votes += 1;

        emit Voted(msg.sender, candidateId);
    }

    function candidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 candidateId) external view returns (string memory, uint256) {
        require(candidateId < candidates.length, "Invalid candidate");
        Candidate memory c = candidates[candidateId];
        return (c.name, c.votes);
    }
}
