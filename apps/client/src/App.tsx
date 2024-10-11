import { Button, Flex, Typography } from "antd";
import { useRef, useState } from "react";
import { QRCode } from "antd";
import "./App.css";
import io, { Socket } from "socket.io-client";
import { Header } from "./components/Header";

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
      setShowQR(false);
    });

    socketRef.current.on("deviceDisconnected", () => {
      setDeviceConnected(undefined);
      setShowQR(false);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    });
  }

  function handleUnlink() {
    socketRef.current!.emit("stop-client");
  }

  return (
    <>
      <Header
        logo={
          <Flex justify="center" align="center">
            <img
              style={{ height: "36px", marginRight: "8px" }}
              src="whatsapp.png"
            />
            <Title style={{ margin: "10px" }}>Farmabot</Title>
          </Flex>
        }
      />
      <Flex
        style={{ maxWidth: "1024px", padding: "0 24px" }}
        justify="flex-start"
        align="flex-start"
        vertical
      >
        {!deviceConnected && !loadingQR && !showQR && (
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
            <Title level={3} style={{ marginTop: "10px" }}>
              📱 Escanea el código QR con tu dispositivo
            </Title>
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
            <Button color="danger" variant="solid" onClick={handleUnlink}>
              Desvincular dispositivo
            </Button>
          </>
        )}
      </Flex>
    </>
  );
}

export default App;
