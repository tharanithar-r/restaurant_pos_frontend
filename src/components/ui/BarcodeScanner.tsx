// file = Html5QrcodePlugin.tsx
import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Define the configuration interface
interface Html5QrcodePluginConfig {
  fps: number;
  qrbox?: number | { width: number; height: number };
  aspectRatio?: number;
  disableFlip?: boolean;
}

interface Html5QrcodePluginProps extends Html5QrcodePluginConfig {
  verbose?: boolean;
  qrCodeSuccessCallback: (
    decodedText: string,
    result: Html5QrcodeResult
  ) => void;
  qrCodeErrorCallback?: (error: string) => void;
}

const createConfig = (
  props: Html5QrcodePluginProps
): Html5QrcodePluginConfig => {
  const config: Html5QrcodePluginConfig = { fps: props.fps };
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = (props) => {
  useEffect(() => {
    const config = createConfig(props);
    const verbose = props.verbose === true;

    if (!props.qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is required callback.");
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [props]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
