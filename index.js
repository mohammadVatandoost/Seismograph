const { app, BrowserWindow } = require('electron')
const electron = require('electron');
const ipc = electron.ipcMain;
const path = require('path');  
// const NativeImage = require('native-image');

  let sp;
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600}) //, icon: __dirname+'/icons/raiwan.png'
  
    // and load the index.html of the app.
    win.loadFile('index.html')
  
    // Open the DevTools.
    win.webContents.openDevTools()

    win.webContents.on('did-finish-load', () => {
       getConnectedArduino();
    })
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }

  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  var SerialPort = require('serialport');
console.log("serial port");
// open the port
// var port = new SerialPort('/dev/ttyACM0');
// port.write('hello arduino')

function getConnectedArduino() {
  console.log("getConnectedArduino");
  SerialPort.list(function(err, ports) {
    var allports = ports.length;
    var count = 0;
    var done = false;
    console.log("serialport ports length"); console.log(allports);
    ports.forEach(function(port) {
      count += 1;
      pm = port['manufacturer'];
      
      if (typeof pm !== 'undefined'){
        console.log("serialport ports manufacturer"); console.log(pm);console.log(port.comName.toString());
        if (win === null) {
          console.log("win is null");
         }
        win.webContents.send('receive-ports',port.comName.toString());
        // ipc.send('receive-ports',port.comName.toString());
      }
      // if (typeof pm !== 'undefined' && pm.includes('arduino')) {
        
        
      //   done = true;
      // }
      // if (count === allports && done === false) {
      //    console.log('cant find arduino')
      // }
    });

  });
}




ipc.on('send-serial-port', function(event,arg) {
  // body...
  // console.log("ipc send-serial-port");console.log(arg);
  if(sp !== null) {
    sp.write(arg);
  }
  
  // for send to renderer
  // event.sender.send('send Back','send to service');
})

ipc.on('open-serial-port', function(event,arg) {
  // body...
  console.log("ipc open-serial-port");
  var serialPort = require('serialport');console.log(arg);
  // var parserSerialPort = serialPort.SerialPort;
  // var Readline = serialPort.parsers.Readline;
  // const Readline = require('@serialport/parser-readline')
  sp = new serialPort(arg, {buadRate: 9600 });
  // var parser = new Readline();
  // const parser = new Readline();
  // sp.pipe(parser)
  // parser.on('data', console.log)
  sp.on('open', function() {
          console.log('done! PC is now connected at port: ' + arg)
        })

  

  // serialPort.on('open', function () {
  //   console.log('Communication is on!')
  //  })
  // Read data that is available but keep the stream from entering "flowing mode"
  // sp.on('readable', function () {
  //   let data = sp.read();
  //   console.log('readable :', data);
  //   win.webContents.send('receive-serial-port',data);
  // });

  // Switches the port into "flowing mode"
  sp.on('data', function (data) {
    console.log('data:', data.toString("utf-8"));
    win.webContents.send('receive-serial-port',data.toString("utf-8"));
  });
  // for send to renderer
  // event.sender.send('send Back','send to service');
})

ipc.on('close-serial-port', function(event,arg) {
  // body...
  console.log("close-serial-port");
  // for send to renderer
  // event.sender.send('send Back','send to service');
})

