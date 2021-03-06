var dotenv = require('dotenv');
dotenv.load();

var conParamsHost1 = {
  host:         process.env.SERVER1_HOST,
  port:         process.env.PORT,
  userName:     process.env.SERVER1_USER_NAME,
  password:     process.env.SERVER1_PASSWORD,
  passPhrase:   process.env.SERVER1_PASS_PHRASE,
  privateKey:   ""
 },
 conParamsHost2 = {
  host:         process.env.SERVER2_HOST,
  port:         process.env.PORT,
  userName:     process.env.SERVER2_USER_NAME,
  password:     process.env.SERVER2_PASSWORD,
  passPhrase:   process.env.SERVER2_PASS_PHRASE,
  privateKey:   ''
 },
 conParamsHost3 = {
  host:         process.env.SERVER3_HOST,
  port:         process.env.PORT,
  userName:     process.env.SERVER3_USER_NAME,
  password:     process.env.SERVER3_PASSWORD,
  passPhrase:   process.env.SERVER3_PASS_PHRASE,
  privateKey:   ''
 }

//Host objects:
var host1 = {
  server:              conParamsHost1,
  commands:            [
    "msg:connected to host: passed",
    "ls -la"
  ],
  connectedMessage:    "Connected to Primary host1",
  readyMessage:        "Running commands Now",
  closedMessage:       "Completed",
  onCommandComplete:   function( command, response, sshObj ) {
    //we are listing the dir so output it to the msg handler
    if (command == "ls -l"){      
      sshObj.msg.send(response);
    }
  }
},

host2 = {
  server:              conParamsHost2,
  commands:            [
    "msg:connected to host: passed",
    "sudo su",
    "cd ~/",
    "ls -la"
  ],
  onCommandComplete:   function( command, response, sshObj ) {
    //we are listing the dir so output it to the msg handler
    if (command == "sudo su"){      
      sshObj.msg.send("Just ran a sudo su command");
    }
  }
},

host3 = {
  server:              conParamsHost3,
  commands:            [
    "msg:connected to host: passed",
    "sudo su",
    "cd ~/",
    "ls -la"
  ],
  onCommandComplete:   function( command, response, sshObj ) {
    //we are listing the dir so output it to the msg handler
    if (command.indexOf("cd") != -1){  
      sshObj.msg.send("Just ran a cd command:");    
      sshObj.msg.send(response);
    }
  }
}

//Set the two hosts you are tunnelling to through host1
host1.hosts = [ host2, host3 ];

//or the alternative nested tunnelling method outlined above:
//host2.hosts = [ host3 ];
//host1.hosts = [ host2 ];

//Create the new instance
var SSH2Shell = require ('../lib/ssh2shell'),
    SSH       = new SSH2Shell(host1);

//default on end event handler used by all hosts
SSH.on ('end', function onEnd( sessionText, sshObj ) {
  //show the full session output. This could be emailed or saved to a log file.
  sshObj.msg.send("\nSession text for " + sshObj.server.host + ":\n" + sessionText + "\nThe End\n\n");
 });

//Start the process
SSH.connect();