import {Figure, FigureNames} from "./Figure";
import {Colors} from "../Colors";
import {Cell} from "../Cell";
import blackLogo from "../../assets/black-king.png";
import whiteLogo from "../../assets/white-king.png";

export class King extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
        this.name = FigureNames.KING;
    }
    canMove(target: Cell): boolean {
        if(!super.canMove(target)) {
            return false
        }
        const absX = Math.abs(target.x - this.cell.x);
        const absY = Math.abs(target.y - this.cell.y);
        if ((absX === 1 && absY === 1)
        || (absX === 1 && absY === 0)
        || (absX === 0 && absY === 1))
            return true;
        return false;
    }
}