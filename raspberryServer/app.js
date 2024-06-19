// Reference code not final

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Puerto serial (reemplaza '/dev/ttyUSB0' con tu puerto serial)
const port = new SerialPort("/dev/ttyUSB0", { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

// Conexión al puerto serial
port.on("open", () => {
  console.log("Conexión establecida con el puerto serial");
});

// Configuración de WebSocket con Socket.io
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Escucha de datos desde el cliente (app cliente)
  socket.on("message", (data) => {
    console.log("Mensaje desde el cliente:", data);
    // Enviar datos al Arduino a través del puerto serial
    port.write(data);
  });

  // Escucha de datos desde el Arduino (puerto serial)
  parser.on("data", (data) => {
    console.log("Datos desde el Arduino:", data);
    // Enviar datos al cliente (app cliente)
    socket.emit("arduinoData", data);
  });

  // Manejo de desconexiones
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Iniciar el servidor
const portNumber = 3000; // Puerto en el que se ejecutará el servidor
server.listen(portNumber, () => {
  console.log(`Servidor escuchando en http://localhost:${portNumber}`);
});
