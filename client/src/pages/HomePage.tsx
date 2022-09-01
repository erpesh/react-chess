import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import SocketContext from "../context/SocketContext";


const HomePage = () => {
  const navigate = useNavigate();

  const {setIsCreate, setRoomId, joinRoom, isPlayerReady} = useContext(SocketContext)

  const createGame = () => {
    setIsCreate(true);
    const roomNumber = Math.round(Math.random() * (100000 - 1) + 1).toString();
    setRoomId(roomNumber);
    joinRoom(roomNumber);
    isPlayerReady();
    navigate("/choose");
  }

  const joinGame = () => {
    setIsCreate(false);
    navigate("/choose");
  }

  return (
      <div className="page">
        <h1>Let's play chess!</h1>
        <button onClick={createGame}>Create Game</button>
        <button onClick={joinGame}>Join Game</button>
      </div>
  );
};

export default HomePage;