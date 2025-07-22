// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Course} from "./Course.sol";

contract CourseFactory {
    address public owner;
    uint256 public nextId;
    mapping(uint256 => address) public courseById;
    address[] public allCourses;

    event CourseCreated(
        uint256 indexed id,
        address indexed course,
        address indexed owner,
        string  title
    );

    // Course[] public courses;
    mapping(address => address[]) public userCourses;

    constructor(){
        owner = msg.sender;
    } 

    function createCourse(
        string memory _title,
        string memory _description,
        uint256 _priceWei,
        uint256 _seatLimit,
        uint64  _startTime
    ) external returns (address) {
        Course c = new Course(
            msg.sender,
            _title,
            _description,
            _priceWei,
            _seatLimit,
            _startTime
        );

        uint256 id = ++nextId;
        courseById[id] = address(c);
        allCourses.push(address(c));
        userCourses[msg.sender].push(address(c));

        emit CourseCreated(id, address(c), msg.sender, _title);
        return address(c);
    }

    function getAllCourses() external view returns (address[] memory) {
        return allCourses;
    }

    function getUserCourses() external view returns (address[] memory) {
        return userCourses[msg.sender]; 
    }
}
