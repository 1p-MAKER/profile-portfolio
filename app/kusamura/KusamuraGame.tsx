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
    consecutiveSenberoCount: number;
    yabaKusa: number;
    gyaruEncounterCount: number;
    totalHerbConsumed: number;
    currentImage: string | null;
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
    consecutiveSenberoCount: 0,
    yabaKusa: 0,
    gyaruEncounterCount: 0,
    totalHerbConsumed: 0,
    currentImage: null,
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
            if (newState.gyaruEncounterCount >= 3) {
                addLog('【ギャル男エンド】地球質量が100%に達し、全てがギャル語で話す新世界が創生された！', newState.time);
            } else if (newState.totalHerbConsumed >= 50) {
                addLog('【草食系エンド】地球質量が100%に達し、見渡す限り大自然の世界が創生された！', newState.time);
            } else if (newState.money >= 10000) {
                addLog('【成金エンド】地球質量が100%に達し、黄金に輝くVIP専用の世界が創生された！', newState.time);
            } else if (newState.time === 23 * 60 + 45) {
                addLog('【ギリギリ創生】地球質量が100%に達し、ギリギリで滅亡を回避した奇跡の世界が創生された！', newState.time);
            } else {
                addLog('【ノーマルエンド】地球の質量が100%に達し、新たな草むらが普通に創生された！', newState.time);
            }
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
            next.consecutiveSenberoCount = 0; // Reset

            const rand = Math.random();
            let logMsg = '';

            if (rand < 0.40) {
                const amount = Math.floor(Math.random() * 301);
                if (amount === 0) {
                    logMsg = `草むらを探索したが、何も見つからなかった...`;
                    next.currentImage = '/images/kusamura/ojisan.png';
                } else {
                    next.money += amount;
                    logMsg = `草むらを探索し、小銭を ${amount}円 見つけた！`;
                    next.currentImage = '/images/kusamura/coins.png';
                }
            } else if (rand < 0.70) {
                const count = Math.floor(Math.random() * 3) + 1;
                next.herb += count;
                logMsg = `草むらを探索し、野草を ${count}個 摘んだ！あとでつまみにしよう🌿`;
                next.currentImage = '/images/kusamura/ojisan.png';
            } else if (rand < 0.80) {
                next.time += 30;
                logMsg = `【ハプニング】警察の職務質問に遭遇！ 対応で30分ロスした...`;
                next.currentImage = '/images/kusamura/police.png';
            } else if (rand < 0.90) {
                logMsg = `草むらを隅々まで探したが、ただ虚無の時間が流れた...`;
                next.currentImage = '/images/kusamura/ojisan.png';
            } else if (rand < 0.99) {
                next.yabaKusa += 1;
                logMsg = `【奇跡】ヤバそうな紫色の草を1個手に入れた...嫌な予感がする。`;
                next.currentImage = '/images/kusamura/yaba.png';
            } else {
                next.money += 10000;
                logMsg = `【大穴フィーバー】10000円札が落ちていた！！ラッキー！`;
                next.currentImage = '/images/kusamura/jackpot.png';
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
            next.consecutiveSenberoCount = 0; // Reset
            next.currentImage = '/images/kusamura/ojisan.png';

            const oldStamina = next.stamina;
            next.stamina = Math.min(100, next.stamina + 50);
            const recovered = next.stamina - oldStamina;

            addLog(`水を飲んで仮眠をとった。体力が ${recovered} 回復した。`, next.time);
            return checkGameOver(next);
        });
    };

    const handleSenbero = () => {
        if (gameState.isGameOver) return;

        const senberoCost = 1000;

        if (gameState.money < senberoCost) {
            addLog(`資金が足りない！（所持金: ${gameState.money} / 1000）`);
            return;
        }

        setGameState((prev) => {
            let next = { ...prev };
            next.time += 30;
            next.money -= senberoCost;

            next.consecutiveSenberoCount += 1;
            const consecutiveBonus = 1 + (next.consecutiveSenberoCount * 0.2);
            const consecutiveStaminaDamage = next.consecutiveSenberoCount > 1 ? (next.consecutiveSenberoCount * 5) : 0;
            if (consecutiveStaminaDamage > 0) {
                next.stamina = Math.max(0, next.stamina - consecutiveStaminaDamage);
                addLog(`【連続飲み】酔いが回って体力が ${consecutiveStaminaDamage} 削られた...。`, next.time);
            }

            let baseSat = Math.floor(Math.random() * 21) + 10;
            let herbBonus = next.herb * 5;
            const isGalEvent = Math.random() < 0.3;

            let satGained = Math.floor((baseSat + herbBonus) * consecutiveBonus);

            if (isGalEvent) {
                satGained *= 2;
                next.gyaruEncounterCount += 1;
                addLog(`【発生】オタクに優しいギャルが現れ、会話が弾んだ！満足度がさらに2倍！`, next.time);
                next.currentImage = '/images/kusamura/gyaru.png';
            } else {
                next.currentImage = '/images/kusamura/senbero.png';
            }

            if (next.yabaKusa > 0) {
                next.yabaKusa--;
                if (Math.random() < 0.5) {
                    satGained *= 5;
                    addLog(`【ヤバ草覚醒】ヤバそうな草をツマミにしたら、脳内物質が溢れて満足度が5倍に！！`, next.time);
                } else {
                    next.stamina = Math.floor(next.stamina / 2);
                    next.time += 30;
                    addLog(`【ヤバ草中毒】体調を崩してトイレに篭った...体力半減＆30分ロス...`, next.time);
                }
            }

            next.satisfaction += satGained;
            const usedHerbs = next.herb;
            next.totalHerbConsumed += usedHerbs;
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
                        <li><strong>探索ボーナス:</strong> まれに10000円の大穴フィーバーや、紫色の「ヤバそうな草」を拾うことも。また、職質を受けると時間をロスします。</li>
                        <li><strong>体力:</strong> 「探索」で消費、「仮眠」で回復します。なくなると何もできません。</li>
                        <li><strong>お金:</strong> 「探索」で拾い、「せんべろ」に1000円使います。</li>
                        <li><strong>野草 & ヤバ草:</strong> 「せんべろ」時に<strong>おつまみ</strong>として自動で全消費され、満足度にボーナスが付きます。ヤバ草は強力ですが、運が悪いとお腹を壊します。</li>
                        <li><strong>せんべろ:</strong> 連続で行くと「連続飲みボーナス」で満足度に倍率がかかりますが、体力がガンガン削られます。</li>
                        <li><strong>ギャル:</strong> 「せんべろ」中にランダム(30%)で遭遇。「オタクに優しいギャル」と盛り上がると、その回の獲得満足度がなんと<strong>2倍</strong>になります！</li>
                    </ul>
                </div>
            </details>

            {/* --- Earth Visual Panel --- */}
            <div className={styles.earthPanel}>
                <div className={styles.visualRow}>
                    {gameState.currentImage && (
                        <div className={styles.eventImageWrapper}>
                            <img src={gameState.currentImage} alt="Event Visual" className={styles.eventImage} />
                        </div>
                    )}
                    <div className={styles.earthEmojiWrapper}>
                        <div
                            className={styles.earthEmoji}
                            style={{ transform: `scale(${1 + (gameState.mass / 100) * 0.5})` }}
                        >
                            🌎
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Status Panel --- */}
            <div className={styles.statusPanel}>
                <div className={styles.statusBox}>時間: <span>{formatTime(gameState.time)}</span></div>
                <div className={`${styles.statusBox} ${styles.statusMass}`}>質量: <span>{gameState.mass}%</span></div>
                <div className={styles.statusBox}>体力: <span>{gameState.stamina}</span> / 100</div>
                <div className={styles.statusBox}>所持金: <span>{gameState.money}</span>円</div>
                <div className={styles.statusBox}>野草: <span>{gameState.herb}</span>個</div>
                <div className={styles.statusBox}>満足度: <span>{gameState.satisfaction}</span>pt</div>
                {gameState.yabaKusa > 0 && (
                    <div className={styles.statusBox}>ヤバ草: <span style={{ color: '#c175ff' }}>{gameState.yabaKusa}</span>個</div>
                )}
                {gameState.consecutiveSenberoCount > 1 && (
                    <div className={styles.statusBox}>連続飲み: <span style={{ color: '#ffb347' }}>x{(1 + (gameState.consecutiveSenberoCount * 0.2)).toFixed(1)}</span></div>
                )}
            </div>

            {/* --- Latest Log Panel --- */}
            {logs.length > 0 && (
                <div key={logs[0].id} className={styles.latestLogWrapper}>
                    💬 {logs[0].message}
                </div>
            )}

            {/* --- Action Panel --- */}
            <div className={styles.actionPanel}>
                <div className={styles.actionGrid}>
                    <button className={styles.btnAction} disabled={gameState.isGameOver} onClick={handleExplore}>
                        探索する<br /><span className={styles.costInfo}>(体力-10 / 15分)</span>
                    </button>
                    <button className={styles.btnAction} disabled={gameState.isGameOver} onClick={handleNap}>
                        仮眠をとる<br /><span className={styles.costInfo}>(体力回復 / 30分)</span>
                    </button>
                    <button className={styles.btnAction} disabled={gameState.isGameOver} onClick={handleSenbero}>
                        せんべろ<br /><span className={styles.costInfo}>(金-1000 / 30分)</span>
                    </button>
                    <button className={`${styles.btnAction} ${styles.btnSpecial}`} disabled={gameState.isGameOver} onClick={handleConvert}>
                        創生エネルギー<br /><span className={styles.costInfo}>(満足度全消費 / 15分)</span>
                    </button>
                </div>
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
