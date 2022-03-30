//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract RWD {
    string public name = 'Reward Token';
    string public symbol = 'RWD';
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint _value);

    event Approve(address indexed _owner, address indexed _spender, uint _value);

    error InsufficientFunds();

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowances;

    constructor(){
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns(bool success) {
        allowances[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    function tranferFrom(address _from, address _to, uint _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(allowances[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowances[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}