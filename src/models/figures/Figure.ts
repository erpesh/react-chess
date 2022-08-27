import {Colors} from "../Colors";
import logo from '../../assets/black-bishop.png'
import {Cell} from "../Cell";

export enum FigureNames {
    FIGURE = 'figure',
    KING = 'king',
    QUEEN = 'queen',
    BISHOP = 'bishop',
    ROOK = 'rook',
    KNIGHT = 'knight',
    PAWN = 'pawn'
}

export class Figure {
    color: Colors;
    logo: typeof logo | null;
    cell: Cell;
    name: FigureNames;
    id: number;


    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.cell = cell;
        this.cell.figure = this;
        this.logo = null;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
    }

    canAttackKing(cells: Cell[][]): boolean {
        for (let i = 0; i < cells.length; i++){
            const row = cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                if (this.name === FigureNames.QUEEN && this.color === Colors.BLACK && target.figure?.name === FigureNames.KING)
                    console.log("xxxx", this, target)
                if (target.figure?.name === FigureNames.KING && this.canMove(target))
                    return true;

            }
        }
        return false;
    }

    canMoveIfCheck(target: Cell): boolean {
        let newBoard = this.cell.board.getCopy();
        console.log(newBoard);
        const newTarget = newBoard.getCell(target.x, target.y);
        newBoard.getCell(this.cell.x, this.cell.y).moveFigure(newTarget);
        console.log(newBoard.isCheck(), !newBoard.isCheck());
        return !newBoard.isCheck();
    }

    canMove(target: Cell): boolean{
        if (target.figure?.color === this.color)
            return false;
        return true;
    }
    moveFigure(target: Cell) {
    }
}