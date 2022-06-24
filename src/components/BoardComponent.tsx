import React, {FC, useEffect, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {Player} from "../models/Player";
import {FigureNames} from "../models/figures/Figure";

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
}

const BoardComponent: FC<BoardProps> = ({board, setBoard, currentPlayer, swapPlayer}) => {

    const [isCheck, setIsCheck] = useState(false);
    const [isMate, setIsMate] = useState(false);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    useEffect(() => {
        highlightCells();
    }, [selectedCell])

    function click(cell: Cell) {
        if (selectedCell === null) {
            console.log("fafa")
        }
        if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
            if (cell.figure?.name === FigureNames.KING)
                return;
            selectedCell.moveFigure(cell);
            const _isCheck = board.isCheck();
            setIsCheck(_isCheck);
            if (_isCheck) {
                setIsMate(board.isMate(currentPlayer?.color));
            }
            swapPlayer();
            setSelectedCell(null);
        } else if (selectedCell === cell) {
            setSelectedCell(null);
        } else if (cell.figure?.color === currentPlayer?.color) {
            setSelectedCell(cell);
        }
    }

    function highlightCells() {
        board.highlightCells(selectedCell);
        updateBoard();
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    return (
        <div>
            <h3>Current player: {currentPlayer?.color}</h3>
            <h3>{isCheck ? "Check!" : ""}</h3>
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