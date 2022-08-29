import {createContext, Dispatch, FC, useEffect, useState} from "react";
import {io} from "socket.io-client";
import {Colors} from "../models/Colors";
import {Board} from "../models/Board";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";

const socket = io("http://localhost:3001/");

const INITIAL_STATE = {
  isCreate: false,
  setIsCreate: (() => undefined) as Dispatch<any>,
  roomId: "",
  setRoomId: (() => undefined) as Dispatch<any>,
  joinRoom: (roomNumber: string) => {},
  isPlayerReady: () => {},
  playerColor: Colors.WHITE,
  setPlayerColor: (() => undefined) as Dispatch<any>,
  board: new Board(),
  setBoard: (() => undefined) as Dispatch<any>,
  isSecondPlayerReady: false,
  doStep: (data: {selectedCell: Cell, target: Cell}) => {},
  updateBoard: () => {},
  receiveData: () => {},
  currentPlayer: new Player(Colors.WHITE),
  setCurrentPlayer: (() => undefined) as Dispatch<any>
};

const SocketContext = createContext(INITIAL_STATE);

export default SocketContext;

export const SocketProvider: FC<{children: any}> = ({children}) => {

  const [isCreate, setIsCreate] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [playerColor, setPlayerColor] = useState<Colors>(Colors.WHITE);
  const [board, setBoard] = useState(new Board());
  const [isSecondPlayerReady, setIsSecondPlayerReady] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(new Player(Colors.WHITE));

  useEffect(() => {
    receiveData()
  }, [socket])

  const receiveData = () => {
    socket.on("receive_message", data => {
      console.log(data, board)
      const selectedCell = board.cells[data.selectedCell.y][data.selectedCell.x];
      const targetCell = board.cells[data.targetCell.y][data.targetCell.x];
      selectedCell.moveFigure(targetCell);
      setBoard(board)
      setCurrentPlayer(new Player(playerColor));
    })
  }

  const doStep = (data: {selectedCell: Cell, target: Cell}) => {
    socket.emit("send_message", {
      selectedCell: {x: data.selectedCell.x, y: data.selectedCell.y},
      targetCell: {x: data.target.x, y: data.target.y},
      room: roomId,
      nextPlayer: playerColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK
    })
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  const isPlayerReady = () => {
    socket.on("is_second_user", data => {
      if (data) {
        setIsSecondPlayerReady(data);
        return;
      }
    })
  }

  const joinRoom = (roomNumber: string) => {
      socket.emit("join_room", roomNumber)
  }

  const contextData = {
    isCreate: isCreate,
    roomId: roomId,
    playerColor: playerColor,
    board: board,
    isSecondPlayerReady: isSecondPlayerReady,
    currentPlayer: currentPlayer,

    setIsCreate: setIsCreate,
    setRoomId: setRoomId,
    setPlayerColor: setPlayerColor,
    setBoard: setBoard,
    setCurrentPlayer: setCurrentPlayer,
    joinRoom: joinRoom,
    isPlayerReady: isPlayerReady,
    doStep: doStep,
    updateBoard: updateBoard,
    receiveData: receiveData
  }

  return (
      <SocketContext.Provider value={contextData}>
        {children}
      </SocketContext.Provider>
  )
}