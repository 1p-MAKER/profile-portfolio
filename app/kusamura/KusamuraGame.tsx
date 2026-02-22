'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './kusamura.module.css';

// --- Type Definitions ---
interface GameState {
    time: number;
    mass: number;
    stamina: number;
    money: number;
    herb: number;
    satisfaction: number;
    isGameOver: boolean;
    gameStatus: 'playing' | 'win' | 'lose';
}

interface LogEntry {
    id: number;
    timeStr: string;
    message: string;
}

// --- Initial State ---
const INITIAL_STATE: GameState = {
    time: 18 * 60, // 18:00
    mass: 0,
    stamina: 100,
    money: 0,
    herb: 0,
    satisfaction: 0,
    isGameOver: false,
    gameStatus: 'playing',
};

// --- Format Helper ---
const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export default function KusamuraGame() {
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
    const [logs, setLogs] = useState<LogEntry[]>([{
        id: 0,
        timeStr: '18:00',
        message: 'ゲームスタート！地球の質量を100%にせよ！'
    }]);
    const logIdCounter = useRef(1);

    // --- BGM Settings ---
    const [isBgmPlaying, setIsBgmPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleBgm = () => {
        if (!audioRef.current) return;
        if (isBgmPlaying) {
            audioRef.current.pause();
            setIsBgmPlaying(false);
        } else {
            audioRef.current.play().catch((err) => {
                console.error("BGM Playback failed", err);
            });
            setIsBgmPlaying(true);
        }
    };

    // --- Helpers ---
    const addLog = (message: string, timeOverride?: number) => {
        const timeToUse = timeOverride !== undefined ? timeOverride : gameState.time;
        const timeStr = formatTime(timeToUse);
        const newLog: LogEntry = {
            id: logIdCounter.current++,
            timeStr,
            message,
        };
        setLogs((prev) => [newLog, ...prev]);
    };

    const checkGameOver = (state: GameState): GameState => {
        let newState = { ...state };
        if (newState.mass >= 100) {
            newState.isGameOver = true;
            newState.gameStatus = 'win';
            addLog('地球の質量が100%に達し、新たな草むらが創生された！【クリア】', newState.time);
        } else if (newState.time >= 24 * 60) {
            newState.isGameOver = true;
            newState.gameStatus = 'lose';
            addLog('24:00になり、時間が尽きた...【ゲームオーバー】', newState.time);
        }
        return newState;
    };

    // --- Actions ---
    const handleExplore = () => {
        if (gameState.isGameOver) return;
        if (gameState.stamina < 10) {
            addLog('体力が少なくて探索できない！仮眠をとろう。');
            return;
        }

        setGameState((prev) => {
            let next = { ...prev };
            next.time += 15;
            next.stamina -= 10;

            const isMoney = Math.random() < 0.6;
            let logMsg = '';
            if (isMoney) {
                const amount = Math.floor(Math.random() * 401) + 100;
                next.money += amount;
                logMsg = `草むらを探索し、小銭を ${amount}円 見つけた！`;
            } else {
                const count = Math.floor(Math.random() * 3) + 1;
                next.herb += count;
                logMsg = `草むらを探索し、野草を ${count}個 摘んだ！`;
            }
            addLog(logMsg, next.time);
            return checkGameOver(next);
        });
    };

    const handleNap = () => {
        if (gameState.isGameOver) return;

        setGameState((prev) => {
            let next = { ...prev };
            next.time += 30;
            const oldStamina = next.stamina;
            next.stamina = Math.min(100, next.stamina + 50);
            const recovered = next.stamina - oldStamina;

            addLog(`水を飲んで仮眠をとった。体力が ${recovered} 回復した。`, next.time);
            return checkGameOver(next);
        });
    };

    const handleSenbero = () => {
        if (gameState.isGameOver) return;
        if (gameState.money < 1000) {
            addLog(`資金が足りない！（所持金: ${gameState.money} / 1000）`);
            return;
        }

        setGameState((prev) => {
            let next = { ...prev };
            next.time += 30;
            next.money -= 1000;

            let baseSat = Math.floor(Math.random() * 21) + 10;
            let herbBonus = next.herb * 5;
            const isGalEvent = Math.random() < 0.3;
            let satGained = baseSat + herbBonus;

            if (isGalEvent) {
                satGained *= 2;
                addLog(`【発生】オタクに優しいギャルが現れ、オタク会話が弾んだ！満足度が2倍！`, next.time);
            }

            next.satisfaction += satGained;
            const usedHerbs = next.herb;
            next.herb = 0;

            addLog(`せんべろを実行！(野草 ${usedHerbs}個消費) 満足度を ${satGained} 獲得！`, next.time);
            return checkGameOver(next);
        });
    };

    const handleConvert = () => {
        if (gameState.isGameOver) return;
        if (gameState.satisfaction < 1) {
            addLog('創生エネルギーに変換するには満足度が最低1pt必要だ。');
            return;
        }

        setGameState((prev) => {
            let next = { ...prev };
            next.time += 15;
            const convertedMass = next.satisfaction;
            const usedSat = convertedMass;
            next.mass += convertedMass;
            next.satisfaction = 0;

            addLog(`満足度を ${usedSat}pt 消費し、地球の質量が ${convertedMass}% 上昇した！`, next.time);
            return checkGameOver(next);
        });
    };

    const handleRestart = () => {
        setGameState(INITIAL_STATE);
        setLogs([{
            id: logIdCounter.current++,
            timeStr: '18:00',
            message: 'ゲームをリスタートしました。18:00からスタートします。'
        }]);
    };

    return (
        <div className={styles.gameContainer}>
            <header className={styles.header}>
                <h1>草むらセンベロ創世記</h1>
                <button
                    className={`${styles.bgmToggle} ${isBgmPlaying ? styles.bgmToggleActive : ''}`}
                    onClick={toggleBgm}
                    title="BGMのON/OFFを切り替えます"
                >
                    {isBgmPlaying ? '🔊 BGM: ON' : '🔈 BGM: OFF'}
                </button>
                <audio ref={audioRef} src="/audio/kusamura_bgm.mp3" loop />
            </header>

            {/* --- Instructions Panel --- */}
            <details className={styles.instructions}>
                <summary>遊び方・用語解説</summary>
                <div className={styles.instructionsContent}>
                    <p><strong>目指せ地球創生！</strong> タイムリミットの24:00までに、地球の質量を100%にしましょう。</p>
                    <ul>
                        <li><strong>体力:</strong> 「探索」で消費、「仮眠」で回復します。なくなると何もできません。</li>
                        <li><strong>お金:</strong> 「探索」で拾い、「せんべろ」に1000円使います。</li>
                        <li><strong>野草:</strong> 「探索」で採取。「せんべろ」時のツマミになり、満足度ボーナスが付きます（実行時に全消費）。</li>
                        <li><strong>満足度:</strong> 「せんべろ」で獲得。これを「創生エネルギー」に変換することで地球の質量が増えます。</li>
                        <li><strong>ギャル:</strong> 「せんべろ」中にランダム(30%)で遭遇。「オタクに優しいギャル」と盛り上がると、その回の獲得満足度がなんと<strong>2倍</strong>になります！</li>
                    </ul>
                </div>
            </details>

            {/* --- Earth Visual Panel --- */}
            <div className={styles.earthPanel}>
                <div className={styles.earthEmojiWrapper}>
                    <div
                        className={styles.earthEmoji}
                        style={{ transform: `scale(${1 + (gameState.mass / 100) * 0.5})` }}
                    >
                        🌎
                    </div>
                </div>
                <div className={styles.massDisplay}>
                    地球の質量: <span>{gameState.mass}%</span>
                </div>
            </div>

            {/* --- Status Panel --- */}
            <div className={styles.statusPanel}>
                <div className={styles.statusBox}>時間: <span>{formatTime(gameState.time)}</span></div>
                <div className={styles.statusBox}>体力: <span>{gameState.stamina}</span> / 100</div>
                <div className={styles.statusBox}>所持金: <span>{gameState.money}</span>円</div>
                <div className={styles.statusBox}>野草: <span>{gameState.herb}</span>個</div>
                <div className={styles.statusBox}>満足度: <span>{gameState.satisfaction}</span>pt</div>
            </div>

            {/* --- Action Panel --- */}
            <div className={styles.actionPanel}>
                <button className={styles.btnAction} disabled={gameState.isGameOver} onClick={handleExplore}>
                    草むらを探索する<br /><span className={styles.costInfo}>(体力-10 / 15分)</span>
                </button>
                <button className={styles.btnAction} disabled={gameState.isGameOver} onClick={handleNap}>
                    水を飲んで仮眠<br /><span className={styles.costInfo}>(体力回復 / 30分)</span>
                </button>
                <button className={styles.btnAction} disabled={gameState.isGameOver} onClick={handleSenbero}>
                    せんべろを実行<br /><span className={styles.costInfo}>(金-1000, 野草全消費 / 30分)</span>
                </button>
                <button className={`${styles.btnAction} ${styles.btnSpecial}`} disabled={gameState.isGameOver} onClick={handleConvert}>
                    創生エネルギーに変換<br /><span className={styles.costInfo}>(満足度全消費 / 15分)</span>
                </button>
            </div>

            {/* --- Result Message --- */}
            {gameState.isGameOver && (
                <div className={styles.messageBox}>
                    {gameState.gameStatus === 'win' && (
                        <div className={styles.winMessage}>
                            <h2>ゲームクリア！</h2>
                            <p>おめでとう！地球の質量は100%になり、新たな世界が創生された！</p>
                        </div>
                    )}
                    {gameState.gameStatus === 'lose' && (
                        <div className={styles.loseMessage}>
                            <h2>ゲームオーバー...</h2>
                            <p>24:00になってしまった...創生は失敗に終わった。</p>
                        </div>
                    )}
                    <button className={styles.btnRestart} onClick={handleRestart}>もう一度プレイする</button>
                </div>
            )}

            {/* --- Log Panel --- */}
            <div className={styles.logPanel}>
                <h3>行動ログ</h3>
                <ul className={styles.logList}>
                    {logs.map((log) => (
                        <li key={log.id}>[{log.timeStr}] {log.message}</li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
