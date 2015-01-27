var connectBtn = document.getElementById('connect'),
    disconnectBtn = document.getElementById('disconnect'),
    serverConnected = document.getElementById('serverConnected'),
    serverTime = document.getElementById('serverTime'),
    timestamp = document.getElementById('timestamp'),
    time = document.getElementById('time'),
    origin = document.getElementById('origin'),
    headers = document.getElementById('headers'),
    path = document.getElementById('path'),
    method = document.getElementById('method'),
    payload = document.getElementById('payload');

connect.onclick = function() {
  sio.connect();
};
disconnect.onclick = function() {
  sio.disconnect();
};

disconnect.style.display = 'none';

window.sio = {
  socket: null,

  connect: function() {
    console.log('Connecting...');
    serverConnected.textContent = 'Connecting...';
    connect.style.display = 'none';
    this.socket = io.connect('http://localhost:8888');

    this.socket.on('connect', () => {
      console.log('Connected !');
      serverConnected.textContent = "True";
      disconnect.style.display = 'block';
    });

    this.socket.on('keepAlive', (data) => {
      console.log('Server PID: ' + data.pid + ' time: ' + data.time);
      serverTime.textContent = data.time;
      serverConnected.textContent = data.pid;
    });

    this.socket.on('dataReceived', (data) => {
      console.log('Data received: ' + JSON.stringify(data));

      timestamp.textContent = data.timestamp;
      time.textContent = data.time;
      origin.textContent = data.origin;
      payload.textContent = data.payload;
      path.textContent = data.path;
      method.textContent = data.method;

      var auxHeaders = '<dl>';
      Object.keys(data.headers).forEach(function(key) {
        auxHeaders += '<dt>' + key + '</dt>';
        auxHeaders += '<dd>' + data.headers[key] + '</dd>';
      });
      auxHeaders += '</dl>';
      headers.innerHTML = auxHeaders;
    });

    this.socket.on('otherTryingToConnect', () => {
      console.log('Other trying to connect...');
    });

    this.socket.on('otherConnected', () => {
      console.log('Other Connected');
      this.disconnect();
    });
  },

  disconnect: function() {
    this.socket.close();
    this.socket = null;
    serverConnected.textContent = 'False';
    serverTime.textContent = '';
    connect.style.display = 'block';
    disconnect.style.display = 'none';
  }
};
