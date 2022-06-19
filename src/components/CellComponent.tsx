import React, {FC} from 'react';
import {Colors} from "../models/Colors";
import {Cell} from "../models/Cell";

interface CellComponents {
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
}

const CellComponent: FC<CellComponents> = ({cell, selected, click}) => {
    return (
        <div
            className={
                [
                    'cell',
                    cell.color,
                    selected ? 'selected' : '',
                    cell.available && cell.figure ? "green" : ''
                ].join(' ')}
            onClick={() => click(cell)}
        >
            {cell.available && !cell.figure && <div className="available"/>}
            {cell.figure?.logo && <img src={cell.figure.logo} alt={""}/>}
        </div>
    );
};

export default CellComponent;