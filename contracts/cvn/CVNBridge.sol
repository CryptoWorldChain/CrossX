// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interface/ITaskStore.sol";
import "../cvn/WCVN.sol";
import "../utils/OperatorSet.sol";
import "../library/TransferHelper.sol";

contract CVNBridge is  OperatorSet, Pausable {

    using SafeMath for uint256;


    uint8 internal constant DIR_WITHDRAW = 0;
    uint8 internal constant DIR_DEPOSIT = 1;
    
    ITaskStore store;

    string public constant name = "HecoBridge";

    event DepositRequest(address indexed from, address indexed to,uint256 value,  bytes32 txid);
    event DepositDone(address indexed from, address indexed to,uint256 value, bytes32 txid);

    event WithdrawRequest(address indexed from,address indexed to, uint256 value, bytes32 txid);
    
    event WithdrawDone(address indexed from,address indexed to, uint256 value, bytes32 txid);
    
    WCVN cvnt;
    uint8 public voteNum ;
    constructor(address _store,address _cvnt)public{
        store=ITaskStore(_store);
        cvnt = WCVN(_cvnt);
        voteNum = 1;
    }

    function changeStore(address _store) public onlyOwner {
        store = ITaskStore(_store);
    }

    function changeVoteNum(uint8 _vote) public onlyOperator{
        voteNum = _vote;
    }


    function depositNative(address _to, uint256 _amount, bytes32 _txid) public payable returns (bytes32 taskHash, bool isNewTask){
        require(_to!=address(0x0),"address error");
        (taskHash,isNewTask) = store.addTask(msg.sender,_to,DIR_DEPOSIT,_amount,_txid,voteNum);
        if(isNewTask)
        {
            cvnt.deposit{value: _amount}();
            assert(cvnt.transfer(address(store), _amount));
            emit DepositRequest(msg.sender,_to,_amount, _txid);
        }
    }

    function getTaskStatus(bytes32 taskHash) public view  returns (uint8){
        return store.getTaskStatus(taskHash);
    }

    
    function getTaskHash(address _from,address _to,uint8 direction,uint256 _amount,bytes32 _txid) public pure  returns (bytes32){
        return keccak256(abi.encodePacked(_from,_to,direction,_amount,_txid));
    }

    function getDepositTaskHash(address _from,address _to,uint256 _amount,bytes32 _txid) public pure  returns (bytes32){
        return keccak256(abi.encodePacked(_from,_to,DIR_DEPOSIT,_amount,_txid));
    }

    function getWithdrawTaskHash(address _from,address _to,uint256 _amount,bytes32 _txid) public pure  returns (bytes32){
        return keccak256(abi.encodePacked(_from,_to,DIR_WITHDRAW,_amount,_txid));
    }


    function voteDepositTask(address _from,address _to,uint256 _amount,bytes32 _txid) public onlyOperator returns (uint8){
        bytes32 taskHash = keccak256(abi.encodePacked(_from,_to,DIR_DEPOSIT,_amount,_txid));
        (uint8 status,bool statusChanged) = store.voteTaskStatus(taskHash,msg.sender);

        if(status==2&&statusChanged){
            //just done
            emit DepositDone(_from,_to,_amount, _txid);
        }
        return status;
    }


    function approveWithdrawTask(address _from,address _to,uint256 _amount,bytes32 _txid) public onlyOperator returns (bytes32 taskHash,bool isNewTask){

        require(_to!=address(0x0),"address error");

        (taskHash ,isNewTask)= store.addTask(_from,_to,DIR_WITHDRAW,_amount,_txid,voteNum);

        if(isNewTask){
            //new task;
            emit WithdrawRequest(_from,_to,_amount, _txid);
        }        
        (uint8 status,bool statusChanged) = store.voteTaskStatus(taskHash,msg.sender);

        if(statusChanged&&status == 2){

            emit WithdrawDone(_from,_to,_amount, _txid);
        }

    }

    function isTaskWithdrawable(bytes32 taskHash) public view returns (bool){
        return store.getTaskStatus(taskHash) == 2;
    }


    function withdrawNativeByHash(bytes32 taskHash) public {
        store.withdrawNative(taskHash,address(cvnt));
    }

    function withdrawNative(address _from,address _to,uint256 _amount,bytes32 _txid) public {
        bytes32 taskHash = keccak256(abi.encodePacked(_from,_to,DIR_WITHDRAW,_amount,_txid));
        store.withdrawNative(taskHash,address(cvnt));
    }
   

}