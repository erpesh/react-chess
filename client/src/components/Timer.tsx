import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {Player} from '../models/Player';
import {Colors} from "../models/Colors";
import SocketContext from "../context/SocketContext";

interface TimerProps {
    currentPlayer: Player | null;
    restart: () => void;
    setCurrentPlayer: (player: Player | null) => void;
    whitePlayer: Player;
    blackPlayer: Player;
}

const Timer: FC<TimerProps> = ({currentPlayer, setCurrentPlayer, restart, whitePlayer, blackPlayer}) => {

    const {playerColor} = useContext(SocketContext);
    const [blackTime, setBlackTime] = useState(60000); // users time
    const [whiteTime, setWhiteTime] = useState(60000);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        startTimer();
    }, [currentPlayer])

    function startTimer() {
        const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
        timer.current = setInterval(callback, 10);

    }

    function decrementBlackTimer() {
        setBlackTime(prevState => prevState - 1)
    }

    function decrementWhiteTimer() {
        setWhiteTime(prevState => prevState - 1)
    }

    const handleRestart = () => {
        setWhiteTime(60000);
        setBlackTime(60000);
        restart();
    }

    const handleStartGame = () => {
        setCurrentPlayer(new Player(playerColor));
    }

    const outOfTime = () => {
        if (blackTime <= 0){
            setCurrentPlayer(null);
            return <div>White player won</div>
        }else if (whiteTime <= 0){
            setCurrentPlayer(null);
            return <div>Black player won</div>
        }
    }

    return (
        <div>
            <div>
                <button onClick={handleStartGame}>{"start game"}</button>
            </div>
            <div>
                <button onClick={handleRestart}>Restart game</button>
            </div>
            <h2>Black player - {blackTime >= 0 ? Math.floor(blackTime / 100) : 0}</h2>
            <h2>White player - {whiteTime >= 0 ? Math.floor(whiteTime / 100) : 0}</h2>
            {outOfTime()}
        </div>
    );
};

export default Timer;