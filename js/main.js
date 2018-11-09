const electron = require("electron");
// const {BrowserWindow} = require('electron').remote
const ipc = electron.ipcRenderer;


var portName ;

const openButton = document.getElementById('openButton');
openButton.addEventListener('click', function () {
	console.log("openButton");
	ipc.send('open-serial-port',portName);
});

const closeButton = document.getElementById('closeButton');

closeButton.addEventListener('click', function () {
	console.log("closeButton");
	ipc.send('close-serial-port');
});

const sendButton = document.getElementById('sendText');

sendButton.addEventListener('click', function () {
	console.log("sendButton");
	console.log(document.getElementById('textForSending').value);
	ipc.send('send-serial-port',document.getElementById('textForSending').value);
	document.getElementById('textForSending').value = "";
});

ipc.on('receive-serial-port',function(event,arg) {
  // body...
  console.log("ipc receive-serial-port");
  // for send to renderer
  // event.sender.send('send Back','send to service');
  document.getElementById('recieveText').innerHTML = document.getElementById('recieveText').innerHTML + arg;
  console.log(arg);
})

ipc.on('receive-ports',function(event,arg) {
	console.log("receive-ports");console.log(arg);
	document.getElementById('ports').innerHTML = document.getElementById('recieveText').innerHTML + arg;
	portName = arg;
})