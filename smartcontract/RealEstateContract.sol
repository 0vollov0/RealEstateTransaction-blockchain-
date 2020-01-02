pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract RealEstateContract {
    enum Status{
        Trading,Complete,Terminated
    }

    struct Info{
        string _title;
        address _seller;
        address _buyer;
        //string _latitudeLongitude;
        string _locationAddress;
        uint256 _value;
        Status _status;
    }
    
    mapping(string => uint256) private timestamp;

    Info private info;

    constructor (address seller,string memory latitudeLongitude,string memory locationAddress,uint256 value) public {
        info._seller = seller;
        //info._latitudeLongitude = latitudeLongitude;
        info._locationAddress = locationAddress;
        info._value = value;
        info._status = Status.Trading;
        timestamp[statusToString(Status.Trading)] = now;
    }

    modifier onlySeller(){
        require(msg.sender == info._seller);
        _;
    }

    modifier onlyBuyer(){
        require(msg.sender == info._buyer);
        _;
    }

    modifier statusCompleted(){
        require(info._status != Status.Complete);
        _;
    }

    function statusToString(Status status) private pure returns (string memory) {
        if (Status.Trading == status) return "trading";
        if (Status.Complete == status) return "complete";
        if (Status.Terminated == status) return "terminated";
        return "";
    }

    function getTitle() public view returns (string memory) {
        return info._title;
    }

    function getSellerAddress() public view returns (address) {
        return info._seller;
    }

    function getBuyerAddress() public view returns (address) {
        return info._buyer;
    }

    // function getLatitudeLongitude() public view returns (string memory) {
    //     return info._latitudeLongitude;
    // }

    function getLocationAddress() public view returns (string memory) {
        return info._locationAddress;
    }

    function getValue() public view returns (uint256) {
        return info._value;
    }

    function setValue(uint256 value) public onlyBuyer statusCompleted{
        info._value = value;
    }

    function setTitle(string memory title) public onlySeller statusCompleted{
        info._title = title;
    }


    function getStatus() public view returns (string memory){
        if (Status.Trading == info._status) return "trading";
        if (Status.Complete == info._status) return "complete";
        if (Status.Terminated == info._status) return "terminated";
        return "";
    }

    function getInfo() public view returns (Info memory){
        return info;
    }

    function updateStatus(uint8 status) public statusCompleted {
        if(status == 0) info._status = Status.Trading;
        if(status == 1) info._status = Status.Complete;
        if(status == 2) info._status = Status.Terminated;
    }

}