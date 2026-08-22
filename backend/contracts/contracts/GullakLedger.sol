// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GullakLedger {
    address public owner;
    
    struct Activity {
        string userId;
        string transactionId;
        string action;
        uint256 amount;
        uint256 timestamp;
    }
    
    Activity[] public activities;
    
    event ActivityLogged(
        uint256 indexed id,
        string userId,
        string transactionId,
        string action,
        uint256 amount,
        uint256 timestamp
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function logActivity(
        string memory _userId,
        string memory _transactionId,
        string memory _action,
        uint256 _amount
    ) public onlyOwner returns (uint256) {
        Activity memory newActivity = Activity({
            userId: _userId,
            transactionId: _transactionId,
            action: _action,
            amount: _amount,
            timestamp: block.timestamp
        });
        
        activities.push(newActivity);
        uint256 newId = activities.length - 1;
        
        emit ActivityLogged(
            newId,
            _userId,
            _transactionId,
            _action,
            _amount,
            block.timestamp
        );
        
        return newId;
    }
    
    function getActivitiesCount() public view returns (uint256) {
        return activities.length;
    }
    
    function getActivity(uint256 _id) public view returns (
        string memory userId,
        string memory transactionId,
        string memory action,
        uint256 amount,
        uint256 timestamp
    ) {
        require(_id < activities.length, "Activity ID out of bounds");
        Activity memory act = activities[_id];
        return (act.userId, act.transactionId, act.action, act.amount, act.timestamp);
    }
}
