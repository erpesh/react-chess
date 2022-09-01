import React, {FC, useContext, useEffect, useState} from 'react';
import Timer from "../components/Timer";
import BoardComponent from "../components/BoardComponent";
import LostFigures from "../components/LostFigures";
import {Board} from "../models/Board";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import SocketContext from "../context/SocketContext";
import {Cell} from "../models/Cell";


const GamePage = () => {
  const {playerColor, doStep, board, setBoard, currentPlayer, setCurrentPlayer} = useContext(SocketContext)
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK));

  // useEffect(() => {
  //   restart();
  // }, [])

  function restart() {
    const newBoard = new Board();
    setBoard(newBoard);
  }

  function swapPlayer(data: {selectedCell: Cell, target: Cell}) {
    setCurrentPlayer(playerColor === Colors.BLACK ? whitePlayer : blackPlayer);
    doStep(data);
  }
  return (
      <div className="game">
        {/*<Timer*/}
        {/*    currentPlayer={currentPlayer}*/}
        {/*    setCurrentPlayer={setCurrentPlayer}*/}
        {/*    restart={restart}*/}
        {/*    whitePlayer={whitePlayer}*/}
        {/*    blackPlayer={blackPlayer}*/}
        {/*/>*/}
        <BoardComponent
            board={board}
            setBoard={setBoard}
            currentPlayer={currentPlayer}
            swapPlayer={swapPlayer}
        />
        <div>
          <LostFigures title={"Black figures"} figures={board.lostBlackFigures}/>
          <LostFigures title={"White figures"} figures={board.lostWhiteFigures}/>
        </div>
      </div>
  );
};

export default GamePage;