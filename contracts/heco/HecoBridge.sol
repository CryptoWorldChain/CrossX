// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interface/ITaskStore.sol";
import "../utils/OperatorSet.sol";
import "../library/TransferHelper.sol";

contract HecoBridge is  OperatorSet, Pausable {

    using SafeMath for uint256;

    
    uint8 internal constant DIR_WITHDRAW = 0;
    uint8 internal constant DIR_DEPOSIT = 1;
    
    ITaskStore public store;

    string public constant name = "HecoBridge";

    event DepositRequest(address indexed from, address indexed to,uint256 value,  bytes32 txid);
    event DepositDone(address indexed from, address indexed to,uint256 value, bytes32 txid);

    event WithdrawRequest(address indexed from,address indexed to, uint256 value, bytes32 txid);
    
    event WithdrawDone(address indexed from,address indexed to, uint256 value, bytes32 txid);
    
    address public cvnt;
    address public feeAddr;
    uint256 public feePerTx;
    uint8 public voteNum;

    constructor(address _store,address _cvnt,address _feeAddr,uint256 _feePerTx)public{
        store=ITaskStore(_store);
        cvnt = _cvnt;
        feeAddr = _feeAddr;
        feePerTx = _feePerTx;
        voteNum = 1;
    }


    function changeStore(address _store) public onlyOwner {
        store = ITaskStore(_store);
    }

    function changeVoteNum(uint8 _vote) public onlyOwner{
        voteNum = _vote;
    }

    function changeFeeAddr(address _feeAddr) public onlyOwner{
        feeAddr = _feeAddr;
    }

    function changeFeePerTx(uint256 _feePerTx) public onlyOwner{
        feePerTx = _feePerTx;
    }


    function deposit(address _to, uint256 _amount, bytes32 _txid) public payable returns (bytes32 taskHash, bool isNewTask){
        require(_to!=address(0x0),"address error");
        require(ERC20(cvnt).balanceOf(msg.sender)>=_amount,"Not Enough Balance");
        require(_amount>feePerTx,"Not Enough Balance for fee");
        uint256 amount = _amount;
        bool needFee = (feeAddr!=address(0x0)&&feePerTx>0);
        if(needFee){
            amount = amount.sub(feePerTx);
        }
        (taskHash,isNewTask) = store.addTask(msg.sender,_to,DIR_DEPOSIT,_amount,feePerTx,_txid,voteNum);
        if(isNewTask)
        {
            if(needFee){
                TransferHelper.safeTransferFrom(cvnt,msg.sender,feeAddr,feePerTx);
            }
            TransferHelper.safeTransferFrom(cvnt,msg.sender,address(store),amount);
            emit DepositRequest(msg.sender,_to,amount, _txid);
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

        (taskHash ,isNewTask)= store.addTask(_from,_to,DIR_WITHDRAW,_amount,0,_txid,voteNum);

        if(isNewTask){
            //new task;
            emit WithdrawRequest(_from,_to,_amount, _txid);
        }        
        (uint8 status,bool statusChanged) = store.voteTaskStatus(taskHash,msg.sender);

        if(statusChanged&&status == 2){
            // TransferHelper.safeTransfer(cvnt,_to,_amount);
            emit WithdrawDone(_from,_to,_amount, _txid);
        }

    }

    function isTaskWithdrawable(bytes32 taskHash) public view returns (bool){
        return store.getTaskStatus(taskHash) == 2;
    }


    function withdrawTokenByHash(bytes32 taskHash) public {
        store.withdrawToken(taskHash,cvnt);
    }

    function withdrawToken(address _from,address _to,uint256 _amount,bytes32 _txid) public {
        bytes32 taskHash = keccak256(abi.encodePacked(_from,_to,DIR_WITHDRAW,_amount,_txid));
        store.withdrawToken(taskHash,cvnt);
    }



    

}