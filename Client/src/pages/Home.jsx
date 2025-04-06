import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { socket } = useSocket();
  const [emailId, setEmailId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const handelSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("join-room", { emailId, roomCode });
    },
    [emailId, roomCode],
  );

  const handelRoomJoined = useCallback((data) => {
    const { eamilId, roomCode } = data;
    navigate(`/room/${roomCode}`);
    // console.log("room joined", { eamilId, roomCode });
  });

  useEffect(() => {
    socket.on("joined-room", handelRoomJoined);
    return () => {
      socket.off("joined-room", handelRoomJoined);
    };
  }, [socket]);
  return (
    <div>
      <h1>Lobby </h1>
      <div>
        <form method="POST">
          <div>
            Room Code {"\t"}
            <input
              type="eamil"
              id="email"
              name="email"
              placeholder="Enter Your Email Id "
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div>
            Room Code {"\t"}
            <input
              type="text"
              id="room"
              name="room"
              placeholder=" Enter the Room Code"
              onChange={(e) => setRoomCode(e.target.value)}
            />
          </div>
          <div>
            <br></br>
            <button onClick={handelSubmit}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
