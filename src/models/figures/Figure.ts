import {Colors} from "../Colors";
import logo from '../../assets/black-bishop.png'
import {Cell} from "../Cell";
import {Board} from "../Board";

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

    getCopy(cell: Cell): Figure {
        let newFigure = new Figure(this.color, cell);
        newFigure.logo = this.logo;
        newFigure.name = this.name;
        newFigure.id = this.id;
        return newFigure;
    }

    canAttackKing(cells: Cell[][]): boolean {
        for (let i = 0; i < cells.length; i++){
            const row = cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                if (target.figure?.name === FigureNames.KING && this.cell.figure?.canMove(target))
                    return true;
            }
        }
        return false;
    }

    canMove(target: Cell): boolean{
        if (target.figure?.color === this.color)
            return false;
        // if (target.figure?.name === FigureNames.KING)
        //     return false;
        return true;
    }
    moveFigure(target: Cell) {
    }
}