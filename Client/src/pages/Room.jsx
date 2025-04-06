import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";
import peer from "../services/peer";
export default function Room() {
  const { socket } = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [emailId, setEmailId] = useState("");
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const handelRoomJoined = (data) => {
    const { emailId, id } = data;
    console.log("room joined", { emailId, id });
    setEmailId(emailId);
    setRemoteSocketId(id);
  };
  const handelIncomingCall = useCallback(async (data) => {
    console.log("incoming call", data);
    // creating the answer and sending
    const myStrem = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(myStrem);
    setRemoteSocketId(data?.from);
    const ans = await peer.getAns(data?.offer);
    socket.emit("call-accepted", { to: data?.from, ans });
  });
  const sendStreems = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);
  const handelCallAccepted = useCallback(
    async (data) => {
      peer.setLocalDescription(data?.ans);
      console.log("call accepted", data);
    },
    [myStream],
  );

  const handelNegotiationIncoming = useCallback(
    async (data) => {
      const ans = await peer.getAns(data?.offer);
      socket.emit("nego-tiation-done", { ans, to: data?.from });
      sendStreems();
    },
    [myStream],
  );
  const handelNegotiationFinal = useCallback(async (data) => {
    await peer.setLocalDescription(data?.ans);
    console.log("nego-tiation-final", data);
  }, []);
  useEffect(() => {
    socket.on("user-joined", handelRoomJoined);
    socket.on("incoming-call", handelIncomingCall);
    socket.on("call-accepted", handelCallAccepted);
    socket.on("nego-tiation-needed", handelNegotiationIncoming);
    socket.on("nego-tiation-final", handelNegotiationFinal);
    return () => {
      socket.off("user-joined", handelRoomJoined);
      socket.off("incoming-call", handelIncomingCall);
      socket.off("call-accepted", handelCallAccepted);
      socket.off("nego-tiation-final", handelNegotiationFinal);
    };
  }, [socket, handelRoomJoined, handelIncomingCall]);
  const handDelIncomingStream = useCallback(
    (e) => {
      const stream = e.streams;
      setRemoteStream(stream[0]);
    },
    [myStream],
  );
  const handelNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("nego-tiation-needed", { offer, to: remoteSocketId });
  }, [myStream]);

  useEffect(() => {
    peer.peer.addEventListener("track", handDelIncomingStream);
    peer.peer.addEventListener("negotiationneeded", handelNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener("track", handDelIncomingStream);
      peer.peer.removeEventListener(
        "negotiationneeded",
        handelNegotiationNeeded,
      );
    };
  });
  const handleCallUser = useCallback(
    async (e) => {
      e.preventDefault();
      const myStrem = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = await peer.getOffer();
      socket.emit("call-user", { offer, to: remoteSocketId });
      setMyStream(myStrem);
    },

    [remoteSocketId, socket],
  );
  return (
    <div>
      <h1>This is the Room</h1>
      <h2>{remoteSocketId ? "Connected" : "No One in the Room"}</h2>
      {remoteSocketId && (
        <button onClick={handleCallUser}>Call {emailId}</button>
      )}

      {remoteSocketId && <button onClick={sendStreems}>Send Stream</button>}
      {remoteSocketId && (
        <ReactPlayer url={myStream} playing muted></ReactPlayer>
      )}
      {remoteStream && (
        <ReactPlayer url={remoteStream} playing muted></ReactPlayer>
      )}
    </div>
  );
}
