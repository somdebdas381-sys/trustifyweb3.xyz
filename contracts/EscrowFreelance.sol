// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EscrowFreelance {
    struct Job {
        address client;
        address freelancer;
        uint256 amount;
        string description;
        bool accepted;
        bool completed;
        bool paid;
    }
    
    Job[] public jobs;
    mapping(address => uint[]) public clientJobs;
    
    event JobCreated(uint indexed jobId, address indexed client, uint256 amount);
    event JobAccepted(uint indexed jobId, address indexed freelancer);
    event JobCompleted(uint indexed jobId);
    event PaymentReleased(uint indexed jobId);
    
    function createJob(string memory _description, uint256 _amount) external payable {
        require(msg.value == _amount, "Incorrect amount sent");
        require(_amount > 0, "Amount must be greater than 0");
        
        uint jobId = jobs.length;
        jobs.push(Job({
            client: msg.sender,
            freelancer: address(0),
            amount: _amount,
            description: _description,
            accepted: false,
            completed: false,
            paid: false
        }));
        
        clientJobs[msg.sender].push(jobId);
        emit JobCreated(jobId, msg.sender, _amount);
    }
    
    function acceptJob(uint _jobId) external {
        Job storage job = jobs[_jobId];
        require(_jobId < jobs.length, "Job does not exist");
        require(!job.accepted, "Already accepted");
        require(job.client != msg.sender, "Client cannot accept own job");
        require(job.freelancer == address(0), "Already has freelancer");
        
        job.freelancer = msg.sender;
        job.accepted = true;
        emit JobAccepted(_jobId, msg.sender);
    }
    
    function markCompleted(uint _jobId) external {
        Job storage job = jobs[_jobId];
        require(_jobId < jobs.length, "Job does not exist");
        require(job.freelancer == msg.sender, "Only freelancer can mark complete");
        require(job.accepted, "Job not accepted yet");
        require(!job.completed, "Already marked completed");
        
        job.completed = true;
        emit JobCompleted(_jobId);
    }
    
    function releasePayment(uint _jobId) external {
        Job storage job = jobs[_jobId];
        require(_jobId < jobs.length, "Job does not exist");
        require(job.client == msg.sender, "Only client can release payment");
        require(job.completed, "Job not completed yet");
        require(!job.paid, "Already paid");
        
        job.paid = true;
        payable(job.freelancer).transfer(job.amount);
        emit PaymentReleased(_jobId);
    }
    
    function getJob(uint _jobId) external view returns (
        address client,
        address freelancer,
        uint256 amount,
        string memory description,
        bool accepted,
        bool completed,
        bool paid
    ) {
        require(_jobId < jobs.length, "Job does not exist");
        Job memory job = jobs[_jobId];
        return (
            job.client,
            job.freelancer,
            job.amount,
            job.description,
            job.accepted,
            job.completed,
            job.paid
        );
    }
    
    function getJobCount() external view returns (uint) {
        return jobs.length;
    }
    
    function getClientJobs(address _client) external view returns (uint[] memory) {
        return clientJobs[_client];
    }
}