"use client";
import React, { useEffect, useRef } from "react";
// Correct import for the web package
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const LiveStreamingRoom = ({ liveID, isHost, userID, userName, onLeave }) => {
  const containerRef = useRef(null);
  const [appID, setAppID] = React.useState(null);
  const [appSign, setAppSign] = React.useState(null);

  useEffect(() => {
    // Get credentials from environment variables
    setAppID(parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID));
    setAppSign(process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET);
  }, []);

  useEffect(() => {
    const initZego = async () => {
      if (!appID || !appSign || !containerRef.current) return;

      // Generate a Kit Token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        appSign,
        liveID,
        userID,
        userName,
      );

      // Initialize the ZegoUIKitPrebuilt instance
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // --- Audio-Only Configuration ---
      // This object customizes the behavior for host and audience
      const customConfig = {
        // --- Common Config for All Roles ---
        // We want to disable video entirely
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: false,
        showAudioVideoSettingsButton: false,

        // --- Role-Based Audio Config ---
        // The logic for audio publishing/subscribing is handled by the 'role' and 'config' below
      };

      if (isHost) {
        // Host: Join as a host, turn on microphone to publish audio, keep camera off.
        zp.joinRoom({
          ...customConfig,
          role: ZegoUIKitPrebuilt.Host, // Important: This enables publishing
          turnOnMicrophoneWhenJoining: true,
          showTurnOffRemoteCameraMenu: false, // No remote video to worry about
          showRemoveUserButton: false,
          showLeaveRoomConfirmDialog: true,
          container: containerRef.current,
          onLeaveRoom: () => {
            if (onLeave) onLeave();
          },
        });
      } else {
        // Audience: Join as an audience member, keep microphone off.
        // They will automatically subscribe to the host's audio stream.
        zp.joinRoom({
          ...customConfig,
          role: ZegoUIKitPrebuilt.Audience,
          turnOnMicrophoneWhenJoining: false,
          useSpeakerWhenJoining: true, // Ensure audio plays through speaker
          showRoomDetailsButton: false,
          container: containerRef.current,
          onLeaveRoom: () => {
            if (onLeave) onLeave();
          },
        });
      }
    };

    initZego();
  }, [appID, appSign, liveID, userID, userName, isHost, onLeave]);

  if (!appID || !appSign) {
    return <div>Loading ZegoCloud...</div>;
  }

  // The container div where Zego will mount its UI
  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default LiveStreamingRoom;
