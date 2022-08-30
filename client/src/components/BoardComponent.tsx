import React, {FC, useContext, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import {FigureNames} from "../models/figures/Figure";
import {Colors} from "../models/Colors";
import SocketContext from "../context/SocketContext";


interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: (data: {selectedCell: Cell, target: Cell}) => void;
}

const BoardComponent: FC<BoardProps> = ({board, currentPlayer, swapPlayer}) => {

  const {playerColor, updateBoard, isCheck, setIsCheck, isMate, setIsMate} = useContext(SocketContext);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    highlightCells();
  }, [selectedCell])

  function click(cell: Cell) {
    if (currentPlayer?.color !== playerColor)
      return;
    if (selectedCell !== null && selectedCell !== cell && selectedCell.figure?.canMove(cell) && cell.available) {
      if (cell.figure?.name === FigureNames.KING)
        return;
      selectedCell.moveFigure(cell);
      const _isCheck = board.isCheck();
      setIsCheck(_isCheck);
      if (_isCheck) {
        const _isMate = board.isMate(currentPlayer?.color);
        setIsMate(_isMate);
      }
      setSelectedCell(null);
      swapPlayer({selectedCell: selectedCell, target: cell});
    } else if (selectedCell === cell) {
      setSelectedCell(null);
    } else if (cell.figure?.color === currentPlayer?.color) {
      setSelectedCell(cell);
    }
  }

  function highlightCells() {
    board.highlightCells(selectedCell, isCheck);
    updateBoard();
  }

  return (
        <div>
          <h3>Current player: {currentPlayer?.color}</h3>
          <h3>{isCheck ? `Check by ${isCheck}!` : ""}</h3>
          <h3>{isMate ? "Mate!" : ""}</h3>
          <div className="board">
            {board.cells.map((row, index) =>
                <React.Fragment key={index}>
                  {row.map((cell) =>
                      <CellComponent
                          cell={cell}
                          click={click}
                          selected={selectedCell?.x === cell.x && selectedCell?.y === cell.y}
                          key={cell.id}
                      />
                  )}
                </React.Fragment>
            )}
          </div>
        </div>
  );
};

export default BoardComponent;