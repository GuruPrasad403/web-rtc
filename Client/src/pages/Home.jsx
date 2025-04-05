import React, { useCallback, useState } from "react";

export default function Home() {
  const [emailId, setEmailId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const handelSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(emailId, roomCode);
    },
    [emailId, roomCode],
  );
  return (
    <div>
      <h1>Lobby </h1>
      <div>
        <form>
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
