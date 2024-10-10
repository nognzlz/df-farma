import { Button, Divider, Flex, Typography } from "antd";
import "./App.css";
import { useEffect, useState } from "react";
import { QRCode } from "antd";
import io from "socket.io-client";

function App() {
  const { Title, Paragraph } = Typography;
  const [showQR, setShowQR] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [deviceConnected, setDeviceConnected] = useState("");

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.text())
      .then(setGreeting);
  }, []);

  function handleLink() {
    setLoadingQR(true);
    const socket = io("/");
    socket.on("connect", () => {
      socket.emit("init-client");
    });

    socket.on("newqr", (qr: string) => {
      setQrCode(qr);
      setLoadingQR(false);
      setShowQR(true);
    });

    socket.on("deviceConnected", () => {
      setDeviceConnected("connected");
      setShowQR(false);
    });
  }

  return (
    <Flex justify="flex-start" align="flex-start" vertical>
      <Title>Farmabot {greeting}</Title>
      <Divider />
      {!deviceConnected && (
        <Button type="primary" onClick={handleLink}>
          Vincular dispositivo
        </Button>
      )}
      {loadingQR && (
        <Paragraph style={{ marginTop: "10px" }}>
          Cargando codigo QR...
        </Paragraph>
      )}
      {showQR && (
        <QRCode value={qrCode} size={400} style={{ marginTop: "10px" }} />
      )}
      {deviceConnected === "connected" && (
        <Paragraph style={{ marginTop: "10px" }} type="success">
          Dispositivo vinculado ✅
        </Paragraph>
      )}
    </Flex>
  );
}

export default App;
