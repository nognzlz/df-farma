import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { WapClient } from "./WapClient.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const wapclient = new WapClient();

io.on("connection", (socket) => {
  console.log("a user connected");
  wapclient.onQRCode((qr) => socket.emit("newqr", qr));
  wapclient.onDeviceConnected(() => socket.emit("deviceConnected"));

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("init-client", () => {
    console.log("initializing client...");
    wapclient.start();
  });
});

server.listen(4001, () => {
  console.log("server running at http://localhost:4001");
});
