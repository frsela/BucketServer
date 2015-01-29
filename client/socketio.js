var connectBtn = document.getElementById('connect'),
    disconnectBtn = document.getElementById('disconnect'),
    serverConnected = document.getElementById('serverConnected'),
    serverTime = document.getElementById('serverTime'),
    receivedTraces = document.getElementById('receivedTraces');

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
    this.socket = io.connect(window.location.origin);

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

      var templateContent = document.getElementById('dataContent').content;
      var timestamp = templateContent.getElementById('timestamp'),
          time = templateContent.getElementById('time'),
          origin = templateContent.getElementById('origin'),
          headers = templateContent.getElementById('headers'),
          path = templateContent.getElementById('path'),
          method = templateContent.getElementById('method'),
          payload = templateContent.getElementById('payload');

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

      var clone = document.importNode(templateContent, true);
      receivedTraces.appendChild(clone);
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
