import React, { useState } from 'react';
import { sound } from '../utils/soundEngine';
import { Sparkles, X, Lightbulb, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose, lang }) => {
  const [filter, setFilter] = useState<string>('all');

  if (!isOpen) return null;

  const suggestions = [
    { id: 1, cat: 'coran', title: 'Mode Récitation en Groupe (Halaqa Virtuelle)', desc: 'Permet aux enfants de réciter ensemble avec un compteur de souffle et de justesse Tajwid.' },
    { id: 2, cat: 'alphabet', title: 'Chasse aux Trésors des Lettres en Réalité Augmentée', desc: 'Scanner la pièce pour trouver des lettres cachées en 3D.' },
    { id: 3, cat: 'admin', title: 'Journal d’Audit Automatique des Connexions', desc: 'Historique détaillé des connexions des élèves avec horodatage IP sécurisé.' },
    { id: 4, cat: 'stories', title: 'Générateur de BD Personnalisée sur les Prophètes', desc: 'Créer sa propre bande dessinée interactive avec des choix moraux.' },
    { id: 5, cat: 'gamification', title: 'Compagnon Animal Virtuel Nourri aux Étoiles', desc: 'Un petit chameau ou oiseau de paradis qui grandit à mesure qu’on apprend.' },
    { id: 6, cat: 'coran', title: 'Reconnaissance Vocale de Sourates Entières', desc: 'Vérification automatique de la récitation par IA avec surbrillance du texte.' },
    { id: 7, cat: 'alphabet', title: 'Atelier de Pâtisserie des Lettres Arabes', desc: 'Façonner des biscuits en forme de lettres avec de la pâte magique virtuelle.' },
    { id: 8, cat: 'admin', title: 'Export de Rapports au Format PDF Officiel', desc: 'Génération d’un bulletin scolaire complet pour l’école ou les parents.' },
    { id: 9, cat: 'stories', title: 'Bande Sonore Immersive par Écosystème', desc: 'Sons de vagues pour le Prophète Nouh, bruits de feu pour le Prophète Ibrahim.' },
    { id: 10, cat: 'gamification', title: 'Tournoi Hebdomadaires de Quiz en Duo', desc: 'Affronter un camarade en temps réel sur 10 questions d’arabe.' },
    { id: 11, cat: 'coran', title: 'Traduction Visuelle Mot à Mot en Français', desc: 'Cliquer sur n’importe quel mot coranique pour voir sa racine et sa traduction instantanée.' },
    { id: 12, cat: 'alphabet', title: 'Concours de Calligraphie Néon', desc: 'Dessiner les plus belles lettres avec des pinceaux lumineux étincelants.' },
    { id: 13, cat: 'admin', title: 'Sauvegarde Cloud Sécurisée sur Google Drive', desc: 'Synchronisation automatique des progrès de toute la classe.' },
    { id: 14, cat: 'stories', title: 'Quiz Moral à la Fin de Chaque Récit', desc: 'Questions interactives sur la générosité, la patience et la gratitude.' },
    { id: 15, cat: 'gamification', title: 'Boutique de Chapeaux et Accessoires d’Avatar', desc: 'Acheter des couronnes, des écharpes et des lunettes magiques avec ses pièces.' },
    { id: 16, cat: 'coran', title: 'Rappels Quotidiens de Douaa (Invocations)', desc: 'Apprendre une invocation par jour avec audio et traduction.' },
    { id: 17, cat: 'alphabet', title: 'Jeu de Pêche aux Mots dans l’Océan', desc: 'Attraper des poissons qui portent les lettres initiales, médianes et finales.' },
    { id: 18, cat: 'admin', title: 'Système d’Alerte de Fatigue pour l’Enfant', desc: 'Suggestion automatique de pause après 30 minutes d’écran continu.' },
    { id: 19, cat: 'stories', title: 'Mode Conteur Automatique (Livre Audio)', desc: 'Écouter l’histoire défiler comme un dessin animé sans effort.' },
    { id: 20, cat: 'gamification', title: 'Quête du Désert des 28 Oasis', desc: 'Voyager d’oasis en oasis en maîtrisant chaque lettre de l’alphabet.' },
    { id: 21, cat: 'coran', title: 'Mode Nuit Spécial Méditation Coranique', desc: 'Thème sombre apaisant avec étoiles filantes et récitation douce.' },
    { id: 22, cat: 'alphabet', title: 'Dictionnaire Illustré Animé en 3 Langues', desc: 'Français, Arabe et Anglais avec prononciation native humaine.' },
    { id: 23, cat: 'admin', title: 'Gestionnaire de Devoirs à la Maison', desc: 'Assigner des sourates ou des lettres à réviser pour le weekend.' },
    { id: 24, cat: 'stories', title: 'Carte Interactive des Lieux Historiques', desc: 'Explorer la Mecque, Médine, Jérusalem et l’Arche de Noé sur une carte 3D.' },
    { id: 25, cat: 'gamification', title: 'Cartes à Collectionner des Prophètes', desc: 'Gagner des cartes rares holographiques en terminant les chapitres.' },
    { id: 26, cat: 'coran', title: 'Comparateur de Récitateurs Célèbres', desc: 'Écouter le même verset par Alafasy, Al-Sudais et Al-Minshawi.' },
    { id: 27, cat: 'alphabet', title: 'Puzzle de Reconstruction de Mots Croisés Arabes', desc: 'Résoudre des grilles de mots croisés adaptés aux enfants.' },
    { id: 28, cat: 'admin', title: 'Mode Multi-Classes pour Écoles et Mosquées', desc: 'Gérer plusieurs groupes d’élèves séparément avec un seul compte admin.' },
    { id: 29, cat: 'stories', title: 'Arbre Généalogique Interactif des Prophètes', desc: 'Visualiser les liens de parenté de Adam jusqu’à Mohammed ﷺ.' },
    { id: 30, cat: 'gamification', title: 'Roulette Magique des Récompenses Quotidiennes', desc: 'Tourner la roue chaque jour pour gagner des bonus mystères.' },
    { id: 31, cat: 'coran', title: 'Assistant de Mémorisation Répétitive (Hifz Loop)', desc: 'Répéter un verset en boucle jusqu’à mémorisation parfaite.' },
    { id: 32, cat: 'alphabet', title: 'Jeu de Cartes Mémo (Memory) des Formes de Lettres', desc: 'Associer la forme isolée à sa forme attachée.' },
    { id: 33, cat: 'admin', title: 'Journal d’Humeur et de Motivation des Élèves', desc: 'Permettre aux enfants d’indiquer s’ils sont joyeux, curieux ou fatigués.' },
    { id: 34, cat: 'stories', title: 'Effets Visuels Magiques sur les Pages de Récits', desc: 'Faire pleuvoir des flocons d’or ou des étoiles filantes en touchant l’écran.' },
    { id: 35, cat: 'gamification', title: 'Système de Parrainage de Petits Savants', desc: 'Inviter un ami et gagner des diamants bonus.' },
    { id: 36, cat: 'coran', title: 'Explication Simplifiée (Tafsir pour Enfants)', desc: 'Notes explicatives courtes et amusantes pour chaque verset.' },
    { id: 37, cat: 'alphabet', title: 'Détecteur de Fautes de Prononciation par IA', desc: 'Conseils vocaux personnalisés pour améliorer l’accentuation.' },
    { id: 38, cat: 'admin', title: 'Personnalisation des Couleurs du Thème de l’École', desc: 'Changer la palette de couleurs principale depuis l’admin.' },
    { id: 39, cat: 'stories', title: 'Mode Théâtre de Marionnettes Virtuelles', desc: 'Mettre en scène les histoires des prophètes avec des personnages rigolos.' },
    { id: 40, cat: 'gamification', title: 'Trophées Cachés dans l’Application (Easter Eggs)', desc: 'Trouver des secrets cachés pour débloquer des badges exclusifs.' },
    { id: 41, cat: 'coran', title: 'Mode Hors-Ligne Intégral avec Audio Compressé', desc: 'Télécharger tout le Coran et les histoires pour voyager sans Wi-Fi.' },
    { id: 42, cat: 'alphabet', title: 'Chansons et Comptines de l’Alphabet Arabe en Vidéo', desc: 'Chanter en chœur avec des mélodies rythmées et joyeuses.' },
    { id: 43, cat: 'admin', title: 'Analyse des Erreurs Fréquentes par l’IA', desc: 'Rapport intelligent montrant quelles lettres posent le plus de soucis aux élèves.' },
    { id: 44, cat: 'stories', title: 'Quiz de Rapidité sur les Récits', desc: 'Répondre en 10 secondes pour doubler ses points.' },
    { id: 45, cat: 'gamification', title: 'Série de Connexion Ininterrompue (Streak Bonus 30j)', desc: 'Gagner un super badge légendaire après un mois de pratique quotidienne.' },
    { id: 46, cat: 'coran', title: 'Livre d’Or des Duas Personnelles', desc: 'Noter ses propres vœux et prières dans un journal intime sécurisé.' },
    { id: 47, cat: 'alphabet', title: 'Jeu de Construction de Phrases VSO (Verbe-Sujet-Objet)', desc: 'Apprendre la grammaire arabe en assemblant des blocs de couleurs.' },
    { id: 48, cat: 'admin', title: 'Créateur de Quiz Personnalisés pour les Professeurs', desc: 'Rédiger ses propres questions d’examen en 2 clics.' },
    { id: 49, cat: 'stories', title: 'Effet Parallaxe 3D sur les Illustrations des Histoires', desc: 'Les décors bougent en inclinant la tablette ou la souris.' },
    { id: 50, cat: 'gamification', title: 'Cérémonie de Remise des Diplômes Virtuelle avec Fanfare', desc: 'Animation spectaculaire de fin de niveau avec confettis géants.' },
  ];

  const filtered = filter === 'all' ? suggestions : suggestions.filter((s) => s.cat === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto relative space-y-6"
      >
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto text-3xl shadow-sm mb-2">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-['Fredoka']">
            50 Suggestions & Idées Magiques NoorKids
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Inspirations créatives et pédagogiques pour enrichir l'avenir de l'application (Créé par Maryam et son fils).
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { key: 'all', label: 'Toutes (50)' },
            { key: 'coran', label: '📖 Coran & Hifz' },
            { key: 'alphabet', label: '🔤 Alphabet & Arabe' },
            { key: 'stories', label: '📜 Histoires' },
            { key: 'gamification', label: '🎮 Gamification' },
            { key: 'admin', label: '⚙️ Admin & Prof' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                sound.playPop();
                setFilter(f.key);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filter === f.key
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid of 50 Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-black">
                    #{item.id}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{item.cat}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/50 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                <span>Suggestion validée ✨</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
