import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Language, StudentProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Trophy, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Gem } from 'lucide-react';

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

export const LetterMazeGame: React.FC<LetterMazeGameProps> = ({ lang, level, onReward }) => {
  // Grid size based on difficulty level
  const gridSize = level === 'Débutant' ? 5 : level === 'Intermédiaire' ? 6 : 7;

  // Target letter sequence for this run
  const targetLetters =
    level === 'Débutant'
      ? ['أ', 'ب', 'ت', 'ث']
      : level === 'Intermédiaire'
      ? ['ج', 'ح', 'خ', 'د', 'ذ']
      : ['ر', 'ز', 'س', 'ش', 'ص', 'ض'];

  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [collectedGemsCount, setCollectedGemsCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [grid, setGrid] = useState<MazeCell[][]>([]);

  // Generate Maze with path
  const generateMaze = useCallback(() => {
    sound.playPop();
    const newGrid: MazeCell[][] = [];

    for (let y = 0; y < gridSize; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < gridSize; x++) {
        // Simple procedural maze layout with open passages
        // Avoid walls on perimeter paths
        const isWall =
          (x % 2 === 1 && y % 2 === 1 && !(x === 1 && y === 1)) ||
          (x === 2 && y === 3 && gridSize > 5) ||
          (x === 4 && y === 2 && gridSize > 5);

        row.push({
          x,
          y,
          isWall: isWall && !(x === 0 && y === 0) && !(x === gridSize - 1 && y === gridSize - 1),
          isStart: x === 0 && y === 0,
          isEnd: x === gridSize - 1 && y === gridSize - 1,
        });
      }
      newGrid.push(row);
    }

    // Place target letters sequentially along non-wall cells
    const freeCells: Position[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!newGrid[y][x].isWall && !(x === 0 && y === 0) && !(x === gridSize - 1 && y === gridSize - 1)) {
          freeCells.push({ x, y });
        }
      }
    }

    // Shuffle free cells
    const shuffled = [...freeCells].sort(() => Math.random() - 0.5);

    // Place letters
    targetLetters.forEach((letter, idx) => {
      if (shuffled[idx]) {
        const { x, y } = shuffled[idx];
        newGrid[y][x].letter = letter;
      }
    });

    // Place bonus gems on next few cells
    for (let i = targetLetters.length; i < targetLetters.length + 3; i++) {
      if (shuffled[i]) {
        const { x, y } = shuffled[i];
        newGrid[y][x].hasGem = true;
      }
    }

    setGrid(newGrid);
    setPlayerPos({ x: 0, y: 0 });
    setCollectedLetters([]);
    setCollectedGemsCount(0);
    setIsWon(false);
  }, [gridSize, targetLetters]);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  // Movement handler
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isWon || grid.length === 0) return;

      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      // Check bounds
      if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        sound.playGentleBoing();
        return;
      }

      const targetCell = grid[newY][newX];
      if (targetCell.isWall) {
        sound.playGentleBoing();
        return;
      }

      // Valid move!
      sound.playPop();
      setPlayerPos({ x: newX, y: newY });

      // Check letter pickup
      if (targetCell.letter) {
        const expectedNext = targetLetters[collectedLetters.length];
        if (targetCell.letter === expectedNext) {
          // Collected in order!
          sound.playStarChime();
          sound.speakArabic(targetCell.letter);
          setCollectedLetters((prev) => [...prev, targetCell.letter!]);
          targetCell.letter = undefined; // picked up
        } else if (!collectedLetters.includes(targetCell.letter)) {
          // Wrong order tip
          sound.playGentleBoing();
        }
      }

      // Check gem pickup
      if (targetCell.hasGem) {
        sound.playGemPickup();
        setCollectedGemsCount((prev) => prev + 1);
        targetCell.hasGem = false;
      }

      // Check reaching the Oasis End
      if (targetCell.isEnd) {
        // Can only win if all target letters collected
        if (collectedLetters.length === targetLetters.length) {
          sound.playCelebrationFanfare();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          setIsWon(true);
          onReward(35, 5);
        } else {
          // Remind to collect all letters first
          sound.playGentleBoing();
        }
      }
    },
    [playerPos, isWon, grid, gridSize, collectedLetters, targetLetters, onReward]
  );

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-amber-300 dark:border-amber-700/50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐪</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
              {lang === 'ar' ? 'متاهة الحروف في الواحة' : lang === 'en' ? 'Letter Oasis Maze' : 'Le Labyrinthe des Lettres'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'قد البطل الصغير لجمع الحروف بالترتيب الصحيح ثم الوصول إلى الواحة 🌴'
              : lang === 'en'
              ? 'Guide the little explorer to gather letters in order, then reach the oasis 🌴'
              : 'Guide Badr pour ramasser les lettres dans l’ordre alphabétique puis rejoins l’oasis 🌴'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
            <Gem className="w-3.5 h-3.5 text-sky-500" />
            <span>{collectedGemsCount}</span>
          </div>
          <button
            onClick={generateMaze}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة اللعبة' : 'Recommencer'}</span>
          </button>
        </div>
      </div>

      {/* Target Letter Progress Bar */}
      <div className="mb-6 p-3.5 rounded-2xl bg-amber-100/60 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">
          {lang === 'ar' ? 'ترتيب جمع الحروف المطلوبة :' : 'Ordre de collecte :'}
        </span>
        <div className="flex items-center gap-2">
          {targetLetters.map((tl, idx) => {
            const isPicked = collectedLetters.includes(tl);
            const isNext = collectedLetters.length === idx;
            return (
              <div
                key={idx}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-['Amiri'] font-bold text-xl transition-all shadow-xs border-2 ${
                  isPicked
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : isNext
                    ? 'bg-amber-400 text-white border-amber-500 animate-pulse ring-2 ring-amber-300'
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
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* The Grid Canvas */}
        <div
          className="grid gap-1.5 p-3 rounded-3xl bg-amber-200/50 dark:bg-slate-800 border-4 border-amber-400 dark:border-slate-700 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: `${Math.min(gridSize * 56, 380)}px`,
            height: `${Math.min(gridSize * 56, 380)}px`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos.x === x && playerPos.y === y;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`relative rounded-xl flex items-center justify-center text-xl font-bold transition-all select-none ${
                    cell.isWall
                      ? 'bg-amber-800/80 dark:bg-stone-800 shadow-md border border-amber-900/40'
                      : cell.isStart
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300'
                      : cell.isEnd
                      ? 'bg-sky-100 dark:bg-sky-950/40 border-2 border-emerald-400'
                      : 'bg-white/80 dark:bg-slate-700/60 border border-amber-100 dark:border-slate-600'
                  }`}
                >
                  {/* Player Token */}
                  {isPlayer ? (
                    <span className="text-2xl animate-bounce transform -translate-y-0.5">
                      🐪
                    </span>
                  ) : cell.letter ? (
                    <span className="text-xl font-['Amiri'] font-bold text-amber-700 dark:text-amber-300 animate-pulse">
                      {cell.letter}
                    </span>
                  ) : cell.hasGem ? (
                    <span className="text-base animate-pulse">💎</span>
                  ) : cell.isEnd ? (
                    <span className="text-xl">🌴</span>
                  ) : cell.isStart ? (
                    <span className="text-xs font-black text-emerald-600">DÉPART</span>
                  ) : cell.isWall ? (
                    <span className="text-amber-900/60 dark:text-stone-700 text-xs">🧱</span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* On-Screen D-Pad for Mobile & Touchscreens */}
        <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {lang === 'ar' ? 'أزرار التوجيه' : 'Boutons de Direction'}
          </span>
          <div className="grid grid-cols-3 gap-2 w-44">
            <div />
            <button
              onClick={() => movePlayer(0, -1)}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div />

            <button
              onClick={() => movePlayer(-1, 0)}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-13 h-13 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
              OK
            </div>
            <button
              onClick={() => movePlayer(1, 0)}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            <div />
            <button
              onClick={() => movePlayer(0, 1)}
              className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-600 active:scale-95 transition-transform cursor-pointer"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <div />
          </div>
          <span className="text-[10px] text-slate-400 mt-2">
            Touches clavier : ↑ ↓ ← → ou Z Q S D
          </span>
        </div>
      </div>

      {/* Victory Banner */}
      {isWon && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div>
              <div className="font-black text-lg">
                {lang === 'ar' ? 'رائع جداً ! لقد وصلت إلى الواحة بجميع الحروف !' : 'Victoire ! Tu as guidé Badr jusqu’à l’oasis !'}
              </div>
              <div className="text-xs text-emerald-100">
                +35 Étoiles & +5 Diamants gagnés !
              </div>
            </div>
          </div>
          <button
            onClick={generateMaze}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-black text-xs shadow-md hover:scale-105 transition-transform cursor-pointer"
          >
            {lang === 'ar' ? 'متاهة جديدة' : 'Niveau suivant'}
          </button>
        </div>
      )}
    </div>
  );
};
