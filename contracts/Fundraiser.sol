// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Fundraiser {
    address public owner;
    uint256 public totalDonations;
    
    mapping(address => uint256) public donations;

    event DonationReceived(address indexed donor, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalDonations = 0;
    }

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        donations[msg.sender] += msg.value;
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    function getDonationBalance(address donor) external view returns (uint256) {
        return donations[donor];
    }

    function withdrawFunds() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function getFundraiserInfo() external pure returns (string memory) {
        return "This is a fundraiser for humanitarian causes.";
    }

    function sendDonationToCharity(address charity) external onlyOwner {
        require(address(this).balance > 0, "No funds to send");
        payable(charity).transfer(address(this).balance);
    }
}
