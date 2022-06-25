import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Pawn} from "./figures/Pawn";
import {King} from "./figures/King";
import {Queen} from "./figures/Queen";
import {Bishop} from "./figures/Bishop";
import {Knight} from "./figures/Knight";
import {Rook} from "./figures/Rook";
import {Figure} from "./figures/Figure";

export class Board {
    cells: Cell[][] = []
    lostBlackFigures: Figure[] = []
    lostWhiteFigures: Figure[] = []

    public initCells() {
        for (let i = 0; i < 8; i++){
            const row: Cell[] = []
            for (let j = 0; j < 8; j++){
                if ((i + j) % 2 !== 0)
                    row.push(new Cell(this, j, i, Colors.BLACK, null)) // black cells
                else
                    row.push(new Cell(this, j, i, Colors.WHITE, null)) // white cells
            }
            this.cells.push(row);
        }
    }

    public getCopy(): Board {
        const newBoard = new Board();
        let cells: Cell[][] = [];
        for (let i = 0; i < 8; i++) {
            const row: Cell[] = []
            for (let j = 0; j < 8; j++) {
                let newCell = new Cell(
                    newBoard,
                    this.cells[i][j].x,
                    this.cells[i][j].y,
                    this.cells[i][j].color,
                    null);
                const fig = this.cells[i][j].figure;
                newCell.figure = fig !== undefined && fig !== null ? newCell.getCopyFigure(fig) : null;
                console.log(fig, newCell.figure);
                row.push(newCell);
            }
            cells.push(row);
        }
        newBoard.cells = cells;

        for (let i = 0; i < this.lostBlackFigures.length; i++) {
            const fig = this.lostBlackFigures[i];
            newBoard.lostBlackFigures.push(newBoard.getCell(fig.cell.x, fig.cell.y).getCopyFigure(fig))
        }
        for (let i = 0; i < this.lostWhiteFigures.length; i++) {
            const fig = this.lostWhiteFigures[i];
            newBoard.lostWhiteFigures.push(newBoard.getCell(fig.cell.x, fig.cell.y).getCopyFigure(fig))
        }
        return newBoard;
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        return newBoard;
    }

    public isCheck(): boolean {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j].figure?.canAttackKing(this.cells))
                    return true;
            }
        }
        return false;
    }

    public canPreventCheck(_cell: Cell): boolean {
        const newBoard = this.getCopy();
        const cell = newBoard.getCell(_cell.x, _cell.y);
        // console.log(cell, _cell);
        for (let i = 0; i < this.cells.length; i++) {
            const row = newBoard.cells[i];
            for (let j = 0; j < row.length; j++) {
                if (cell.figure?.canMove(row[j])) {
                    newBoard.cells[cell.y][cell.x].moveFigure(row[j]);
                    if (!newBoard.isCheck()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public isMate(color: Colors | undefined): boolean {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                console.log(color, row[j].figure?.color)
                if (row[j].figure && color !== row[j].figure?.color && this.canPreventCheck(row[j])) {
                    console.log('if')
                    return false;
                }
            }
        }
        return true;
    }

    public highlightCells(selectedCell: Cell | null) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = !!selectedCell?.figure?.canMove(target);
            }
        }
    }

    public getCell(x: number, y: number){
        return this.cells[y][x];
    }

    private addPawns() {
        for (let i = 0; i < 8; i++) {
            new Pawn(Colors.BLACK, this.getCell(i, 1))
            new Pawn(Colors.WHITE, this.getCell(i, 6))
        }
    }

    private addKings() {
        new King(Colors.BLACK, this.getCell(4, 0))
        new King(Colors.WHITE, this.getCell(4, 7))
    }

    private addQueens() {
        new Queen(Colors.BLACK, this.getCell(3, 0))
        new Queen(Colors.WHITE, this.getCell(3, 7))
    }

    private addKnights() {
        new Knight(Colors.BLACK, this.getCell(1, 0))
        new Knight(Colors.WHITE, this.getCell(6, 7))
        new Knight(Colors.BLACK, this.getCell(6, 0))
        new Knight(Colors.WHITE, this.getCell(1, 7))
    }

    private addRooks() {
        new Rook(Colors.BLACK, this.getCell(0, 0))
        new Rook(Colors.WHITE, this.getCell(7, 7))
        new Rook(Colors.BLACK, this.getCell(7, 0))
        new Rook(Colors.WHITE, this.getCell(0, 7))
    }

    private addBishops() {
        new Bishop(Colors.BLACK, this.getCell(2, 0))
        new Bishop(Colors.WHITE, this.getCell(2, 7))
        new Bishop(Colors.BLACK, this.getCell(5, 0))
        new Bishop(Colors.WHITE, this.getCell(5, 7))
    }

    public addFigures() {
        this.addPawns();
        this.addKings();
        this.addQueens();
        this.addKnights();
        this.addRooks();
        this.addBishops();
    }
}