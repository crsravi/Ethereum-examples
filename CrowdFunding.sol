pragma solidity ^0.5.0;

contract CrowdFunding{
    uint public time;
    uint public projectSubmissionEndTime;
    uint public projectVotingEndTime;
    uint public entryFeeLimit;
    uint public totalEntryFee;
    uint public totalAmountFunded;
    address  payable public winnerAddress;
    uint public winnigProjAmountFunded;
    bool public fundingComplete;
    struct project {
        string projOwnername;
        string projOwnerUrl;
        uint amountSponsoredForProj;
        bool addedFlag;
        address payable projOwnerAddr;
    }
    address[] public adressesAllProjects;
    mapping (address => project) public projects;
    
    constructor(uint _projectSubmissionEndTime, uint _projectVotingEndTime,uint _entryFeeLimit) public{
        time = block.timestamp;
        projectSubmissionEndTime = time + _projectSubmissionEndTime;
        projectVotingEndTime = time + _projectVotingEndTime;
        entryFeeLimit = _entryFeeLimit;
    }
    
    function submitProject(string memory _projOwnername, string memory _projOwnerUrl) public payable{
        if (now <  projectSubmissionEndTime && msg.value == entryFeeLimit && projects[msg.sender].addedFlag == false ){
            projects[msg.sender] = project (_projOwnername,_projOwnerUrl,0,true,msg.sender);
            totalEntryFee = totalEntryFee + msg.value;
            adressesAllProjects.push(msg.sender);
        }else{
            msg.sender.transfer(msg.value);
        }
        
    }
    
    function getTimeNow()  public  view  returns(uint){
        return now;
    }
    
    function voteForProjects(address _addressOfProj) public payable{
        if (now < projectVotingEndTime){
            if (projects[_addressOfProj].addedFlag != false ){
                projects[_addressOfProj].amountSponsoredForProj = projects[_addressOfProj].amountSponsoredForProj + msg.value;
                totalAmountFunded = totalAmountFunded + msg.value;
            } else{
                msg.sender.transfer(msg.value);
            }
        }else{
            if(fundingComplete == false){
                findWinner();
                winnerAddress.transfer(address(this).balance);
                msg.sender.transfer(msg.value);
                fundingComplete = true;
            }else{
                msg.sender.transfer(msg.value);
            }
            
        }
    }
    
    function findWinner() private {
        for (uint i = 0; i < adressesAllProjects.length ; i++){
            if(projects[adressesAllProjects[i]].amountSponsoredForProj > winnigProjAmountFunded){
                winnigProjAmountFunded = projects[adressesAllProjects[i]].amountSponsoredForProj;
                winnerAddress = projects[adressesAllProjects[i]].projOwnerAddr;
            }
        }
    }
    
    function adressesAllProjectsLength() public view returns (uint){
        return adressesAllProjects.length;
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}