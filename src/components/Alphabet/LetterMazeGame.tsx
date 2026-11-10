import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Language, StudentProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Trophy, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Gem, Compass } from 'lucide-react';

interface LetterMazeGameProps {
  lang: Language;
  level: StudentProfile['level'];
  onReward: (stars: number, gems: number) => void;
}

interface Position {
  x: number;
  y: number;
}

interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  letter?: string;
  hasGem?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
}

const CHARACTERS = [
  { id: 'camel', icon: '🐪', label: 'Badr' },
  { id: 'boy', icon: '🧒🏽', label: 'Rayan' },
  { id: 'girl', icon: '🧕', label: 'Sofia' },
  { id: 'falcon', icon: '🦅', label: 'Faucon' },
];

export const LetterMazeGame: React.FC<LetterMazeGameProps> = ({ lang, level, onReward }) => {
  // Grid size based on difficulty level
  const gridSize = useMemo(() => {
    return level === 'Débutant' ? 5 : level === 'Intermédiaire' ? 6 : 7;
  }, [level]);

  // Target letter sequences
  const targetLetters = useMemo(() => {
    return level === 'Débutant'
      ? ['أ', 'ب', 'ت', 'ث']
      : level === 'Intermédiaire'
      ? ['ج', 'ح', 'خ', 'د', 'ذ']
      : ['ر', 'ز', 'س', 'ش', 'ص', 'ض'];
  }, [level]);

  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [collectedGemsCount, setCollectedGemsCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [grid, setGrid] = useState<MazeCell[][]>([]);
  const [selectedChar, setSelectedChar] = useState<string>('🐪');

  // Refs for zero-latency, lag-free input handling
  const playerPosRef = useRef<Position>({ x: 0, y: 0 });
  const isWonRef = useRef<boolean>(false);
  const gridRef = useRef<MazeCell[][]>([]);
  const collectedLettersRef = useRef<string[]>([]);
  const lastStepSoundTimeRef = useRef<number>(0);
  const isMovingRef = useRef<boolean>(false);

  // Sync refs with state
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    isWonRef.current = isWon;
  }, [isWon]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    collectedLettersRef.current = collectedLetters;
  }, [collectedLetters]);

  /**
   * Generates a guaranteed connected and solvable procedural maze.
   * Uses a snake-like main corridor from (0,0) to (gridSize-1, gridSize-1)
   * with open side chambers for gems and walls placed only in safe spots.
   */
  const generateMaze = useCallback(() => {
    sound.playPop();

    // 1. Initialize grid with all paths open
    const newGrid: MazeCell[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          x,
          y,
          isWall: false,
          isStart: x === 0 && y === 0,
          isEnd: x === gridSize - 1 && y === gridSize - 1,
        });
      }
      newGrid.push(row);
    }

    // 2. Build guaranteed primary winding path from (0,0) to (gridSize-1, gridSize-1)
    const mainPath: Position[] = [];
    let curX = 0;
    let curY = 0;
    mainPath.push({ x: curX, y: curY });

    while (curX < gridSize - 1 || curY < gridSize - 1) {
      if (curX === gridSize - 1) {
        curY++;
      } else if (curY === gridSize - 1) {
        curX++;
      } else {
        // Step either right or down
        if (Math.random() > 0.5) {
          curX++;
        } else {
          curY++;
        }
      }
      mainPath.push({ x: curX, y: curY });
    }

    // Set of keys on main path to NEVER place walls on
    const pathKeys = new Set(mainPath.map((p) => `${p.x},${p.y}`));

    // 3. Place walls on safe cells that are NOT on main path
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const key = `${x},${y}`;
        if (
          !pathKeys.has(key) &&
          !(x === 0 && y === 0) &&
          !(x === gridSize - 1 && y === gridSize - 1)
        ) {
          // Checkerboard wall pattern with 45% density
          if ((x + y) % 2 === 1 && Math.random() < 0.55) {
            newGrid[y][x].isWall = true;
          }
        }
      }
    }

    // 4. Place target letters along the main path in sequential order!
    // Exclude start (index 0) and end (last index)
    const availablePathSteps = mainPath.slice(1, mainPath.length - 1);
    const stepInterval = Math.max(1, Math.floor(availablePathSteps.length / targetLetters.length));

    targetLetters.forEach((letter, i) => {
      const stepIdx = Math.min(i * stepInterval, availablePathSteps.length - 1);
      const pos = availablePathSteps[stepIdx];
      if (pos && !newGrid[pos.y][pos.x].letter) {
        newGrid[pos.y][pos.x].letter = letter;
      }
    });

    // 5. Place bonus gems in non-wall open chambers
    const emptyCells: Position[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!newGrid[y][x].isWall && !newGrid[y][x].letter && !newGrid[y][x].isStart && !newGrid[y][x].isEnd) {
          emptyCells.push({ x, y });
        }
      }
    }

    // Shuffle and pick 3 gems
    const shuffledEmpty = [...emptyCells].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(3, shuffledEmpty.length); i++) {
      const { x, y } = shuffledEmpty[i];
      newGrid[y][x].hasGem = true;
    }

    // Set state & update refs synchronously
    gridRef.current = newGrid;
    playerPosRef.current = { x: 0, y: 0 };
    collectedLettersRef.current = [];
    isWonRef.current = false;

    setGrid(newGrid);
    setPlayerPos({ x: 0, y: 0 });
    setCollectedLetters([]);
    setCollectedGemsCount(0);
    setIsWon(false);
  }, [gridSize, targetLetters]);

  // Initial maze generation
  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  /**
   * Ultra-fast, zero-lag player movement
   */
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isWonRef.current || gridRef.current.length === 0) return;

      const curPos = playerPosRef.current;
      const newX = curPos.x + dx;
      const newY = curPos.y + dy;

      // 1. Boundary check
      if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        sound.playGentleBoing();
        return;
      }

      // 2. Wall collision check
      const currentGrid = gridRef.current;
      const targetCell = currentGrid[newY]?.[newX];
      if (!targetCell || targetCell.isWall) {
        sound.playGentleBoing();
        return;
      }

      // 3. Throttle footstep audio to avoid audio thread saturation
      const now = Date.now();
      if (now - lastStepSoundTimeRef.current > 85) {
        sound.playStep();
        lastStepSoundTimeRef.current = now;
      }

      // Update position
      const nextPos = { x: newX, y: newY };
      playerPosRef.current = nextPos;
      setPlayerPos(nextPos);

      let gridNeedsUpdate = false;
      const newGrid = currentGrid.map((row) => row.map((c) => ({ ...c })));
      const cellCopy = newGrid[newY][newX];

      // 4. Letter pickup check
      if (cellCopy.letter) {
        const collected = collectedLettersRef.current;
        const expectedNext = targetLetters[collected.length];

        if (cellCopy.letter === expectedNext) {
          // Collected in proper order!
          sound.playLetterCollect();
          sound.playHumanLetter(cellCopy.letter);

          const updatedCollected = [...collected, cellCopy.letter];
          collectedLettersRef.current = updatedCollected;
          setCollectedLetters(updatedCollected);

          cellCopy.letter = undefined;
          gridNeedsUpdate = true;
        } else if (!collected.includes(cellCopy.letter)) {
          // Picked out of order - gentle reminder
          sound.playGentleBoing();
        }
      }

      // 5. Gem pickup check
      if (cellCopy.hasGem) {
        sound.playGemPickup();
        cellCopy.hasGem = false;
        gridNeedsUpdate = true;
        setCollectedGemsCount((prev) => prev + 1);
      }

      if (gridNeedsUpdate) {
        gridRef.current = newGrid;
        setGrid(newGrid);
      }

      // 6. Check reaching the Oasis End
      if (cellCopy.isEnd) {
        const collected = collectedLettersRef.current;
        if (collected.length === targetLetters.length) {
          isWonRef.current = true;
          setIsWon(true);
          sound.playCelebrationFanfare();
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
          });
          onReward(35, 5);
        } else {
          // Remind child to collect remaining letters
          sound.playGentleBoing();
        }
      }
    },
    [gridSize, targetLetters, onReward]
  );

  /**
   * Keyboard Navigation with strict debouncing & single listener binding
   */
  useEffect(() => {
    let keyRepeatTimer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'ArrowDown', 'KeyS', 'ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }

      if (isMovingRef.current) return;
      isMovingRef.current = true;

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        movePlayer(0, -1);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        movePlayer(0, 1);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        movePlayer(-1, 0);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        movePlayer(1, 0);
      }

      keyRepeatTimer = setTimeout(() => {
        isMovingRef.current = false;
      }, 70);
    };

    const handleKeyUp = () => {
      isMovingRef.current = false;
      if (keyRepeatTimer) clearTimeout(keyRepeatTimer);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (keyRepeatTimer) clearTimeout(keyRepeatTimer);
    };
  }, [movePlayer]);

  const nextRequiredLetter = targetLetters[collectedLetters.length];

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-5 md:p-8 shadow-xl border-3 border-amber-300 dark:border-amber-700/50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce">🐪</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
              {lang === 'ar' ? 'متاهة الحروف في الواحة' : lang === 'en' ? 'Letter Oasis Maze' : 'Le Labyrinthe des Lettres'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'قد البطل لجمع الحروف بالترتيب العربي ثم الوصول إلى الواحة 🌴'
              : lang === 'en'
              ? 'Guide your hero to gather letters in order, then reach the oasis 🌴'
              : 'Guide ton voyageur pour ramasser les lettres dans l’ordre alphabétique puis rejoins l’oasis 🌴'}
          </p>
        </div>

        {/* Character selector & reset */}
        <div className="flex items-center gap-2">
          {/* Character avatar picker */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  sound.playPop();
                  setSelectedChar(char.icon);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                  selectedChar === char.icon
                    ? 'bg-amber-400 text-white scale-110 shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700 opacity-70 hover:opacity-100'
                }`}
                title={char.label}
              >
                {char.icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs shadow-2xs">
            <Gem className="w-3.5 h-3.5 text-sky-500" />
            <span>{collectedGemsCount}</span>
          </div>

          <button
            onClick={generateMaze}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-200 dark:hover:bg-amber-900/40 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            title="Générer un nouveau labyrinthe"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة' : 'Nouveau'}</span>
          </button>
        </div>
      </div>

      {/* Target Letter Progress Bar */}
      <div className="mb-5 p-3.5 rounded-2xl bg-amber-100/70 dark:bg-slate-800/90 border border-amber-300/70 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wide">
            {lang === 'ar' ? 'الترتيب المطلوب :' : 'Ordre de collecte :'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {targetLetters.map((tl, idx) => {
            const isPicked = collectedLetters.includes(tl);
            const isNext = collectedLetters.length === idx;
            return (
              <div
                key={idx}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-['Amiri'] font-bold text-xl transition-all border-2 ${
                  isPicked
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : isNext
                    ? 'bg-amber-400 text-white border-amber-500 scale-110 shadow-md ring-2 ring-amber-300'
                    : 'bg-white dark:bg-slate-700 text-slate-400 border-slate-300 dark:border-slate-600'
                }`}
              >
                {tl}
              </div>
            );
          })}
          <span className="text-xl">➡️ 🌴</span>
        </div>
      </div>

      {/* Maze Grid & Controls Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8">
        {/* The Grid Canvas (Optimized CSS - no heavy transitions or frame drops) */}
        <div
          className="grid gap-1.5 p-3 rounded-3xl bg-amber-200/60 dark:bg-slate-800 border-4 border-amber-400 dark:border-slate-700 shadow-inner select-none"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: `${Math.min(gridSize * 58, 380)}px`,
            height: `${Math.min(gridSize * 58, 380)}px`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isTargetLetter = cell.letter === nextRequiredLetter;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative rounded-xl flex items-center justify-center font-bold select-none ${
                    cell.isWall
                      ? 'bg-amber-800/80 dark:bg-stone-800 shadow-sm border border-amber-900/30'
                      : cell.isStart
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300'
                      : cell.isEnd
                      ? 'bg-sky-100 dark:bg-sky-950/40 border-2 border-emerald-400'
                      : 'bg-white/90 dark:bg-slate-700/80 border border-amber-100 dark:border-slate-600'
                  }`}
                >
                  {/* Player Token */}
                  {isPlayer ? (
                    <span className="text-2xl transform scale-115 drop-shadow-sm">
                      {selectedChar}
                    </span>
                  ) : cell.letter ? (
                    <span
                      className={`text-xl font-['Amiri'] font-bold ${
                        isTargetLetter
                          ? 'text-amber-600 dark:text-amber-300 font-extrabold scale-110 drop-shadow-xs'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cell.letter}
                    </span>
                  ) : cell.hasGem ? (
                    <span className="text-base">💎</span>
                  ) : cell.isEnd ? (
                    <span className="text-xl">🌴</span>
                  ) : cell.isStart ? (
                    <span className="text-[10px] font-black text-emerald-600">DÉPART</span>
                  ) : cell.isWall ? (
                    <span className="text-amber-900/40 dark:text-stone-700 text-xs">🧱</span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Ultra-Responsive On-Screen D-Pad (0ms tap latency with pointer events) */}
        <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'ar' ? 'أزرار الحركة السريعة' : 'Boutons de Direction'}
          </span>
          <div className="grid grid-cols-3 gap-2 w-44">
            <div />
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                movePlayer(0, -1);
              }}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md active:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div />

            <button
              onPointerDown={(e) => {
                e.preventDefault();
                movePlayer(-1, 0);
              }}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md active:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-13 h-13 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-400">
              {nextRequiredLetter || '🌴'}
            </div>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                movePlayer(1, 0);
              }}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md active:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            <div />
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                movePlayer(0, 1);
              }}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md active:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <div />
          </div>
          <span className="text-[10px] text-slate-400 mt-2 font-medium">
            Clavier : Flèches ↑ ↓ ← → ou Z Q S D
          </span>
        </div>
      </div>

      {/* Victory Banner */}
      {isWon && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-lg">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300 animate-bounce" />
            <div>
              <div className="font-black text-lg">
                {lang === 'ar' ? 'رائع جداً ! لقد وصلت إلى الواحة بجميع الحروف !' : 'Victoire ! Tu as guidé Badr jusqu’à l’oasis !'}
              </div>
              <div className="text-xs text-emerald-100 font-semibold">
                +35 Étoiles & +5 Diamants gagnés !
              </div>
            </div>
          </div>
          <button
            onClick={generateMaze}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {lang === 'ar' ? 'متاهة جديدة' : 'Niveau suivant'}
          </button>
        </div>
      )}
    </div>
  );
};
