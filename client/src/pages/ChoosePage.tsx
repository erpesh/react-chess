import React, {FC, useContext, useEffect, useState} from 'react';
import SocketContext from "../context/SocketContext";
import {io} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {Colors} from "../models/Colors";


interface ChoosePageProps {
}

const ChoosePage: FC<ChoosePageProps> = () => {

  const {isCreate, roomId, setRoomId, joinRoom, setPlayerColor, isSecondPlayerReady} = useContext(SocketContext)
  const [roomInput, setRoomInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isSecondPlayerReady) {
      navigate(`/game/${roomId}`)
    }
  }, [isSecondPlayerReady])

  return (
      <>
        {isCreate ? <div className="page">
          <h1>Room id: {roomId}</h1>
          <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div> : <div className="page">
          <h1>Enter room id</h1>
          <input onChange={event => setRoomInput(event.target.value)}/>
          <button onClick={() => {
            if (roomInput !== '') {
              joinRoom(roomInput);
              setRoomId(roomInput);
              setPlayerColor(Colors.BLACK);
              navigate(`/game/${roomInput}`);
            }
          }
          }>Join</button>
        </div>}
      </>
  );
};

export default ChoosePage;