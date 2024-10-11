import { Button, Divider, Flex, Typography } from "antd";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { QRCode } from "antd";
import io, { Socket } from "socket.io-client";

function App() {
  const { Title, Paragraph } = Typography;
  const [showQR, setShowQR] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [deviceConnected, setDeviceConnected] = useState<{
    name: string;
    phone: string;
    platform: string;
  }>();
  const socketRef = useRef<Socket>();

  function handleLink() {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = io("/");
    setLoadingQR(true);

    socketRef.current.on("connect", () => {
      socketRef.current!.emit("init-client");
    });

    socketRef.current.on("newqr", (qr: string) => {
      setQrCode(qr);
      setLoadingQR(false);
      setShowQR(true);
    });

    socketRef.current.on("deviceConnected", (deviceInfo) => {
      setDeviceConnected(deviceInfo);
      console.log("🚀 ~ socketRef.current.on ~ deviceInfo:", deviceInfo);
      setShowQR(false);
    });
  }

  return (
    <Flex justify="flex-start" align="flex-start" vertical>
      <Title>Farmabot</Title>
      <Divider />
      {!deviceConnected && !loadingQR && (
        <Button type="primary" onClick={handleLink}>
          Vincular dispositivo
        </Button>
      )}
      {loadingQR && (
        <Paragraph style={{ marginTop: "10px" }}>
          Cargando codigo QR...
        </Paragraph>
      )}
      {showQR && !deviceConnected && (
        <>
          <Paragraph style={{ marginTop: "10px" }}>
            📱 Escanea el código QR con tu dispositivo
          </Paragraph>
          <QRCode
            value={qrCode}
            size={400}
            type="svg"
            style={{ marginTop: "10px" }}
          />
        </>
      )}
      {deviceConnected && (
        <>
          <Paragraph style={{ marginTop: "10px" }}>
            ✅ Dispositivo vinculado:
            <ul style={{ textAlign: "left" }}>
              <li>
                {deviceConnected.platform} de {deviceConnected.name}
              </li>
              <li>linea {deviceConnected.phone.slice(3)}</li>
            </ul>
          </Paragraph>
          <Button color="danger" variant="solid">
            Desvincular dispositivo
          </Button>
        </>
      )}
    </Flex>
  );
}

export default App;
