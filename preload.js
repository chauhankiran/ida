const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ida", {
    name: () => "Ida",
    version: () => "0.0.1",
});
