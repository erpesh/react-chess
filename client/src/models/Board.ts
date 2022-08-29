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

    constructor() {
        this.initCells();
        this.addFigures();
    }

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

    public deepClone(obj : any, hash = new WeakMap()) : any {
        // Do not try to clone primitives or functions
        if (Object(obj) !== obj || obj instanceof Function) return obj;
        if (hash.has(obj)) return hash.get(obj); // Cyclic reference
        try { // Try to run constructor (without arguments, as we don't know them)
            var result = new obj.constructor();
        } catch(e) { // Constructor failed, create object without running the constructor
            result = Object.create(Object.getPrototypeOf(obj));
        }
        // Optional: support for some standard constructors (extend as desired)
        if (obj instanceof Map)
            Array.from(obj, ([key, val]) => result.set(this.deepClone(key, hash),
                this.deepClone(val, hash)) );
        else if (obj instanceof Set)
            Array.from(obj, (key) => result.add(this.deepClone(key, hash)) );
        // Register in hash
        hash.set(obj, result);
        // Clone and assign enumerable own properties recursively
        return Object.assign(result, ...Object.keys(obj).map (
            key => ({ [key]: this.deepClone(obj[key], hash) }) ));
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        return newBoard;
    }

    public isCheck(): Colors | boolean | undefined {
        let result : Colors | undefined | boolean = false;
        let count = 0;
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j].figure?.canAttackKing(this.cells)) {
                    result = row[j].figure?.color;
                    count++;
                }
            }
        }
        if (count === 2)
            return true
        return result;
    }

    public canPreventCheck(_cell: Cell): boolean {
        const newBoard = this.deepClone(this);
        const cell = newBoard.getCell(_cell.x, _cell.y);
        for (let i = 0; i < this.cells.length; i++) {
            const row = newBoard.cells[i];
            for (let j = 0; j < row.length; j++) {
                if (cell.figure?.canMove(row[j])) {
                    const condition = cell.figure.canMoveIfCheck(row[j])
                    if (condition === cell.figure.color || !condition) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public isMate(currentColor: Colors | undefined): boolean {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                if (row[j].figure && row[j].figure?.color !== currentColor && this.canPreventCheck(row[j])) {
                    return false;
                }
            }
        }
        return true;
    }

    public highlightCells(selectedCell: Cell | null, isCheck: Colors | boolean | undefined) {
        for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                const canMove = !!selectedCell?.figure?.canMove(target)
                const canMoveIfCheck =
                    isCheck !== false &&
                    isCheck !== undefined &&
                    (selectedCell?.figure?.color !== isCheck &&
                    !selectedCell?.figure?.canMoveIfCheck(target));
                const canMoveIfNotCheck =
                    (isCheck === false ||
                    isCheck === undefined) &&
                    (selectedCell?.figure?.canMoveIfCheck(target) === selectedCell?.figure?.color ||
                    selectedCell?.figure?.canMoveIfCheck(target) === false)
                target.available = canMove && (canMoveIfCheck || canMoveIfNotCheck);
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