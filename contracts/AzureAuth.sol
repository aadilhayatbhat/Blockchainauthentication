// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AzureAuth {
    struct User {
        string username;
        string email;
        bytes32 passwordHash;
        address userAddress;
    }

    mapping(address => User) public users;
    mapping(string => bool) private usernames;
    mapping(string => bool) private emails;
    mapping(string => address) private usernameToAddress;

    event UserRegistered(address userAddress, string username, string email);

    function registerUser(string memory _username, string memory _email, string memory _password) public {
        require(!usernames[_username], "Username already registered");
        require(!emails[_email], "Email already registered");

        bytes32 passwordHash = keccak256(abi.encodePacked(_password));
        users[msg.sender] = User(_username, _email, passwordHash, msg.sender);
        usernames[_username] = true;
        emails[_email] = true;
        usernameToAddress[_username] = msg.sender;

        emit UserRegistered(msg.sender, _username, _email);
    }

    function verifyUser(string memory _username, string memory _password) public view returns (bool) {
        address userAddress = usernameToAddress[_username];
        if (userAddress == address(0)) {
            return false;
        }
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));
        return users[userAddress].passwordHash == passwordHash;
    }
        function getAddressByUsername(string memory _username) public view returns (address) {
        return usernameToAddress[_username];
    }
}