// npm install --save-dev @thirdweb-dev/cli
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Course {
    address public immutable instructor;
    string  public title;
    string  public description;
    uint256 public price;
    uint256 public seatLimit;
    uint64  public startTime;

    uint256 public enrolledCount;
    bool    public canceled;
    mapping(address => bool) public isEnrolled;
    mapping(address => bool) public refunded;

    enum Status { Open, Closed, Canceled }

    event Enrolled (address indexed student, uint256 paid);
    event Withdrawn(address indexed instructor, uint256 amount);
    event Refunded (address indexed student, uint256 amount);
    event Canceled ();

    modifier onlyInstructor() { require(msg.sender == instructor, "Not instructor"); _; }
    modifier courseOpen()     { require(status() == Status.Open, "Not open"); _; }

    constructor(
        address _instructor,
        string memory _title,
        string memory _description,
        uint256 _priceWei,
        uint256 _seatLimit,
        uint64  _startTime
    ) {
        require(_seatLimit > 0, "Seat limit");
        require(_startTime > block.timestamp, "Start in future");

        instructor  = _instructor;
        title       = _title;
        description = _description;
        price       = _priceWei;
        seatLimit   = _seatLimit;
        startTime   = _startTime;
    }

    function enroll() external payable courseOpen {
        require(!isEnrolled[msg.sender], "Already in");
        require(msg.value == price,       "Fee mismatch");
        require(enrolledCount < seatLimit, "Full");

        isEnrolled[msg.sender] = true;
        enrolledCount += 1;
        emit Enrolled(msg.sender, msg.value);
    }

    function withdraw() external onlyInstructor {
        require(status() == Status.Closed, "Not closed");
        uint256 bal = address(this).balance;
        require(bal > 0, "Zero");
        payable(instructor).transfer(bal);
        emit Withdrawn(instructor, bal);
    }

    function cancel() external onlyInstructor courseOpen {
        canceled = true;
        emit Canceled();
    }

    function refund() external {
        require(canceled, "Not canceled");
        require(isEnrolled[msg.sender], "Not enrolled");
        require(!refunded[msg.sender],  "Refunded");

        refunded[msg.sender] = true;
        payable(msg.sender).transfer(price);
        emit Refunded(msg.sender, price);
    }

    function status() public view returns (Status) {
        if (canceled) return Status.Canceled;
        if (block.timestamp >= startTime || enrolledCount == seatLimit)
            return Status.Closed;
        return Status.Open;
    }
}
