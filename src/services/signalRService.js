import * as signalR from '@microsoft/signalr';

let connection = null;

export const startSignalRConnection = (onStockUpdate) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://stockmarcket.runasp.net/stockHub", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .build();

  connection
    .start()
    .then(() => console.log("✅ SignalR Connected"))
    .catch((err) => console.error("❌ SignalR Connection Error:", err));

  connection.on("StockDataUpdated", (updatedStock) => {
    console.log("📡 Received Stock Update:", updatedStock);
    onStockUpdate(updatedStock);
  });
};
