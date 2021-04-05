
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

contract WCVN {
    string public name     = "Wrapped CVN";
    string public symbol   = "CVN";
    uint8  public decimals = 18;

    event  Approval(address indexed src, address indexed guy, uint wad);
    event  Transfer(address indexed src, address indexed dst, uint wad);
    event  Deposit(address indexed dst, uint wad);
    event  Withdrawal(address indexed src, uint wad);

    mapping (address => uint)                       public  balanceOf;
    mapping (address => mapping (address => uint))  public  allowance;

    constructor() public payable {
        deposit();
    }
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    

    // TEST!event Withdraw(uint256 step,uint256 info,string message);
    function withdraw(uint wad) public {

        require(balanceOf[msg.sender] >= wad);
        // TEST!emit Withdraw(0,wad,"WCVN check balance ok");
        balanceOf[msg.sender] -= wad;
        // TEST!emit Withdraw(1,wad,"WCVN sub balance ok");
        msg.sender.transfer(wad);
        // TEST!emit Withdraw(2,wad,"WCVN transfer ok");
        emit Withdrawal(msg.sender, wad);
    }
    function getBalanceOf(address addr) public view returns(uint256){
        return balanceOf[addr];
    }

    function totalSupply() public view returns (uint) {
        return address(this).balance;
    }

    function approve(address guy, uint wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
       emit  Approval(msg.sender, guy, wad);
        return true;
    }

    function transfer(address dst, uint wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    function transferFrom(address src, address dst, uint wad)
        public
        returns (bool)
    {
        require(balanceOf[src] >= wad);
        if (src != msg.sender && allowance[src][msg.sender] != uint(-1)) {
            require(allowance[src][msg.sender] >= wad);
            allowance[src][msg.sender] -= wad;
        }
        balanceOf[src] -= wad;
        balanceOf[dst] += wad;
        emit  Transfer(src, dst, wad);
        return true;
    }
}
