let zg = null;

export const initZego = async () => {
  if (typeof window === "undefined") return null;

  if (!zg) {
    const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");

    zg = new ZegoExpressEngine(
      parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
      process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET,
    );
  }

  return zg;
};

export const getZego = () => zg;
