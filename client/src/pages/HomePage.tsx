import React, {FC, useContext} from 'react';
import GamePage from "./GamePage";
import {useNavigate} from "react-router-dom";
import SocketContext from "../context/SocketContext";
import {Colors} from "../models/Colors";

interface HomePageProps {
}

const HomePage: FC<HomePageProps> = () => {
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
      <div>
        <button onClick={createGame}>Create Game</button>
        <button onClick={joinGame}>Join Game</button>
      </div>
  );
};

export default HomePage;