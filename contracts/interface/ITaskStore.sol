// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

interface ITaskStore {
    function addTask(address _from,address _to,uint8 _direction,uint256 _amount,uint256 _fee,bytes32 _txid,uint8 _voteNum)  external returns (bytes32 taskHash,bool isNewTask);
    function voteTaskStatus(bytes32 taskHash,address operator)  external  returns (uint8,bool);
    function getTaskStatus(bytes32 taskHash) external view returns (uint8);
    function withdrawToken(bytes32 taskHash,address token) external;
    function withdrawNative(bytes32 taskHash,address token) external;


}