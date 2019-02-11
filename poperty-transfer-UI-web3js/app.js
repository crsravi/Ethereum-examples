if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));   
}

var thisContract =new  web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_verifiedOwner",
				"type": "address"
			},
			{
				"name": "_propertyName",
				"type": "string"
			}
		],
		"name": "allotProperty",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_propertyName",
				"type": "string"
			}
		],
		"name": "transferProperty",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"inputs": [],
		"payable": false,
		"type": "constructor",
		"stateMutability": "nonpayable"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_verifiedOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_totalNoOfPropertyCurrently",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_nameOfProperty",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_msg",
				"type": "string"
			}
		],
		"name": "PropertyAlloted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_propertyName",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_msg",
				"type": "string"
			}
		],
		"name": "PropertyTransferred",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "DA",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_ownerAddress",
				"type": "address"
			}
		],
		"name": "getPropertyCountOfAnyAddress",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_checkOwnerAddress",
				"type": "address"
			},
			{
				"name": "_propertyName",
				"type": "string"
			}
		],
		"name": "isOwner",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "propertiesOwner",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "isSold",
				"type": "bool"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "a1",
				"type": "string"
			},
			{
				"name": "a2",
				"type": "string"
			}
		],
		"name": "stringsEqual",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalNoOfProperty",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	}
],'0x9dae28ce473d771c0280791804cffc9dd676e7d3');

thisContract.methods.totalNoOfProperty().call().then((result) => {
    $("#totalProperties").html('Total Allotted Properties: ' + result);
});
var ownerAccount;
web3.eth.getAccounts().then(function(res){
console.log(res[0]);
ownerAccount = res[0];
});
$("#allotProperty").click(function() {
    thisContract.methods.allotProperty($("#allotToAddress").val(), $("#allotToPropertyName").val())
    .send({from:ownerAccount})
    .then(function(receipt){
        thisContract.methods.totalNoOfProperty().call().then((result) => {
            $("#totalProperties").html('Total Allotted Properties: ' + result);
        });
        $("#resultAllotProperty").html('Result: ' + receipt.events.PropertyAlloted.returnValues[3] + ' with name '+  
        receipt.events.PropertyAlloted.returnValues[2] +' to  '+ receipt.events.PropertyAlloted.returnValues[0]);
    });
});



$("#transferProperty").click(function() {
    thisContract.methods.transferProperty($("#transferToAddress").val(), $("#transferPropertyName").val())
    .send({from:$("#transferOwnerAddress").val()})
    .then(function(receipt){
        $("#resultTransferProperty").html('Result: ' + receipt.events.PropertyTransferred.returnValues[3] + ' with name '+  
        receipt.events.PropertyTransferred.returnValues[2] +' to transfer to '+ receipt.events.PropertyTransferred.returnValues[1]);
    })
});

$("#getPropertiesofAdd").click(function() {
    thisContract.methods.getPropertyCountOfAnyAddress($("#getAddress").val())
    .call({from:ownerAccount})
    .then(function(count){
        $("#noOfProp").html('Total properties for '+$("#getAddress").val()+'  are:   '+count);

    });

    thisContract.methods.propertiesOwner($("#getAddress").val())
    .call({from:ownerAccount})
    .then(function(res){
        console.log(res);
    });
});