import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Server } from "socket.io";
// Custom APIs for renderer

var io, sck;

const api = {
  createWsServer: (port, pub_key, on_server_got_key, on_server_got_msg) => {
    io = new Server(port, {
      cors: {
        origin: "*"
      }
    });
    console.log("Server started");
    io.on("connection", (socket) => {
      sck = socket;
      socket.emit("server-key-send", pub_key);
      socket.on("client-key-send", (key) => {
        on_server_got_key(key);
      })
      socket.on("client-msg", (msg) => {
        on_server_got_msg(msg);
      })
    })
  },
  closeWsServer: () => {
    io.close();
    // make all Socket instances disconnect
    io.disconnectSockets();
  },
  sendMsg: (m) => {
    sck.emit("server-msg", m);
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
