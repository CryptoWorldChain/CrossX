// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "../interface/ITaskStore.sol";
import "../library/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TaskStorage is Ownable,ITaskStore{
    
    uint8 internal constant DIR_WITHDRAW = 0;
    uint8 internal constant DIR_DEPOSIT = 1;


    struct Task{
        address   from;
        address   to;
        uint8     direction;//[0:cvn-->heco, 1:heco-->cvn];
        uint256   amount;
        uint8     status;//[0:init, 1:processing, 2:done, 3: withdraw];
        bytes32   txid;
        uint256   blocktime;
        uint8     voteNum;
        uint8     currVote;
        EnumerableSet.AddressSet    votes;
    }
	
    mapping (bytes32 => Task) tasks;

    address public caller;
    constructor() public {
        
	}

    function changeCaller(address _caller) public onlyOwner{
        caller = _caller;
    }

    modifier onlyCaller() {
        require(caller==msg.sender, "wrong operator");
        _;
    }

    function getTask(bytes32 taskHash) public view returns (uint8 status,uint256 blocktime,uint256 amount,bytes32 txid,uint voteCount){
        
        Task storage task = tasks[taskHash];
        status = task.status;
        blocktime = task.blocktime;
        amount = task.amount;
        txid = task.txid;
        voteCount = EnumerableSet.length(task.votes);
    }
 
    function addTask(address _from,address _to,uint8 _direction,uint256 _amount,bytes32 _txid,uint8 _voteNum) public override returns (bytes32 taskHash,bool isNewTask){
        
        taskHash = keccak256(abi.encodePacked(_from,_to,_direction,_amount,_txid));
        Task storage task = tasks[taskHash];

        if(task.blocktime == 0){
            isNewTask = true;
            task.from=_from;
            task.to=_to;
            task.direction=_direction;
            task.amount=_amount;
            task.status = 0;
            task.txid = _txid;
            task.blocktime = block.timestamp;
            task.voteNum = _voteNum;
        }else{
            isNewTask = false;
        }
        
        


    }

    function getTaskStatus(bytes32 taskHash) public view override returns (uint8){
        Task storage task = tasks[taskHash];
        return task.status;
    }


    function voteTaskStatus(bytes32 taskHash,address operator) public onlyCaller override returns (uint8 status,bool statusChanged){
        Task storage task = tasks[taskHash];
        require(task.blocktime > 0 ,"vote task not exist");
        require(task.status < 2,"vote task status error");

        EnumerableSet.add(task.votes,operator);
        uint len = EnumerableSet.length(task.votes);

        
        if(len == task.voteNum && task.status == 1){
            //move to next status
            task.status = 2;
            statusChanged = true;
        }
        else {
            if(task.status==0)
            {
                task.status = 1;
                statusChanged = true;
            }else{
                statusChanged = false;
            }
        }
        status = task.status;
    }

    function withdrawToken(bytes32 taskHash,address token) public override 
    {
        Task storage task = tasks[taskHash];
        require(task.blocktime > 0 ," task not exist");
        require(task.status == 2," task status error");
        require(task.direction == DIR_WITHDRAW," task direction error");

        require(ERC20(token).balanceOf(address(this))>=task.amount,"contract balance not enough");
        
        TransferHelper.safeTransfer(token,task.to,task.amount);
        task.status = 3;


    }
    

}