import React, { useState } from 'react';
import { Language, StudentProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import { ShoppingBag, Coins, Sparkles, CheckCircle2, Crown, Gem, Gift, Award, Backpack } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface SouqMarketProps {
  lang: Language;
  student: StudentProfile;
  onUpdateStudent: (updater: (prev: StudentProfile) => StudentProfile) => void;
}

interface SouqShopItem {
  id: string;
  name: Record<Language, string>;
  category: 'hats' | 'pens' | 'mounts';
  priceStars: number;
  priceGems: number;
  emoji: string;
  description: Record<Language, string>;
}

const SHOP_ITEMS: SouqShopItem[] = [
  {
    id: 'crown_sultan',
    name: { fr: 'Couronne du Sultan', ar: 'تاج السلطان', en: 'Sultan Crown', es: 'Corona del Sultán' },
    category: 'hats',
    priceStars: 5000,
    priceGems: 250,
    emoji: '👑',
    description: { fr: 'Une magnifique couronne royale en or pur pour votre avatar.', ar: 'تاج ملكي رائع من الذهب الخالص.', en: 'A magnificent royal crown for your avatar.', es: 'Una magnífica corona real.' },
  },
  {
    id: 'scholar_cap',
    name: { fr: 'Chapeau de Petit Savant', ar: 'قبعة العالم الصغير', en: 'Little Scholar Cap', es: 'Gorro de Sabio' },
    category: 'hats',
    priceStars: 2000,
    priceGems: 100,
    emoji: '🎓',
    description: { fr: 'Le chapeau traditionnel des grands savants de Cordoue.', ar: 'قبعة العلماء التقليدية.', en: 'The traditional cap of great scholars.', es: 'El gorro tradicional.' },
  },
  {
    id: 'ruby_pen',
    name: { fr: 'Stylo d’Or & Rubis', ar: 'قلم الذهب والياقوت', en: 'Gold & Ruby Pen', es: 'Pluma de Oro y Rubí' },
    category: 'pens',
    priceStars: 3000,
    priceGems: 150,
    emoji: '🖋️',
    description: { fr: 'Un stylo magique pour calligraphier l’arabe avec élégance.', ar: 'قلم سحرى لكتابة الحروف بأناقة.', en: 'A magic pen for elegant calligraphy.', es: 'Una pluma mágica.' },
  },
  {
    id: 'golden_ink',
    name: { fr: 'Encre Étincelante', ar: 'حبر لامع سحري', en: 'Sparkling Golden Ink', es: 'Tinta Dorada' },
    category: 'pens',
    priceStars: 1500,
    priceGems: 75,
    emoji: '✨',
    description: { fr: 'Une encre qui brille comme les étoiles du ciel nocturne.', ar: 'حبر يتلألأ مثل نجوم السماء.', en: 'Ink that shines like night stars.', es: 'Tinta brillante.' },
  },
  {
    id: 'magic_carpet',
    name: { fr: 'Tapis Volant de Bagdad', ar: 'بساط بغداد السحري', en: 'Baghdad Magic Carpet', es: 'Alfombra Mágica' },
    category: 'mounts',
    priceStars: 10000,
    priceGems: 500,
    emoji: '🪄',
    description: { fr: 'Voyagez à travers les mondes magiques de NoorKids !', ar: 'سافر عبر عوالم نوركيدز السحرية!', en: 'Travel across magical worlds!', es: '¡Viaja por mundos mágicos!' },
  },
  {
    id: 'oasis_camel',
    name: { fr: 'Chameau de l’Oasis', ar: 'جمل الواحة الأمين', en: 'Oasis Camel', es: 'Camello del Oasis' },
    category: 'mounts',
    priceStars: 4000,
    priceGems: 200,
    emoji: '🐪',
    description: { fr: 'Un fidèle compagnon pour traverser le désert en musique.', ar: 'رفيق وفي لقطع الصحراء.', en: 'A loyal companion across the desert.', es: 'Un compañero fiel.' },
  },
];

export const SouqMarketGame: React.FC<SouqMarketProps> = ({ lang, student, onUpdateStudent }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory'>('shop');
  const [activeCategory, setActiveCategory] = useState<'all' | 'hats' | 'pens' | 'mounts'>('all');

  const purchased = student.purchasedSouqItems || [];
  const equipped = student.equippedItem;

  const handleBuyItem = (item: SouqShopItem) => {
    if (purchased.includes(item.id)) return;

    if (student.stars < item.priceStars || student.gems < item.priceGems) {
      sound.playGentleBoing();
      alert(lang === 'ar' ? 'عذراً، رصيدك لا يكفي لشراء هذا الغرض!' : 'Oups ! Tu n’as pas assez d’étoiles ou de diamants pour cet article.');
      return;
    }

    sound.playCelebrationFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    onUpdateStudent((prev) => ({
      ...prev,
      stars: prev.stars - item.priceStars,
      gems: prev.gems - item.priceGems,
      purchasedSouqItems: [...(prev.purchasedSouqItems || []), item.id],
      equippedItem: item.emoji, // Auto equip on purchase
      badges: [...new Set([...prev.badges, 'souq_shopper'])],
    }));
  };

  const handleEquipItem = (emoji: string) => {
    sound.playStarChime();
    onUpdateStudent((prev) => ({
      ...prev,
      equippedItem: prev.equippedItem === emoji ? undefined : emoji,
    }));
  };

  const filteredItems = activeCategory === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950 rounded-3xl text-white shadow-2xl border-2 border-amber-500/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سوق الحروف - عالم التسوق والكنوز' : 'Souq Al-Huruf - Marché de Luxe'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'باقة الكنوز والهدايا الفاخرة' : 'Boutique des Trésors & Inventaire'}
          </h2>
          <p className="text-xs text-amber-200">
            {lang === 'ar'
              ? 'انفق نجومك واجمع أفضل التيجان والمقود الإمبراطورية!'
              : 'Dépense tes étoiles et diamants bien mérités et gère ton inventaire personnel !'}
          </p>
        </div>

        {/* Student Wallet */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-3 rounded-2xl border border-amber-400/40 shadow-xl">
          <div className="flex items-center gap-1.5" title="Étoiles disponibles">
            <span className="text-xl">⭐</span>
            <span className="font-black text-amber-300 text-sm">{student.stars}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5" title="Diamants disponibles">
            <Gem className="w-4 h-4 text-sky-400 fill-sky-400" />
            <span className="font-black text-sky-300 text-sm">{student.gems}</span>
          </div>
        </div>
      </div>

      {/* Mode Tabs: Boutique vs Inventaire */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => { sound.playPop(); setActiveTab('shop'); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'shop' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'bg-white/10 hover:bg-white/25 text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Boutique Souq 🛒</span>
        </button>

        <button
          onClick={() => { sound.playPop(); setActiveTab('inventory'); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer relative ${
            activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 font-black shadow-lg' : 'bg-white/10 hover:bg-white/25 text-white'
          }`}
        >
          <Backpack className="w-4 h-4" />
          <span>Mon Inventaire ({purchased.length}) 🎒</span>
        </button>
      </div>

      {activeTab === 'shop' ? (
        <div className="space-y-6">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: { fr: '✨ Tous les articles', ar: 'جميع الأغراض', en: 'All Items', es: 'Todos' } },
              { id: 'hats', label: { fr: '👑 Chapeaux & Couronnes', ar: 'التيجان والقبعات', en: 'Hats & Crowns', es: 'Sombreros' } },
              { id: 'pens', label: { fr: '🖋️ Stylos & Encre', ar: 'الأقلام والحبر', en: 'Pens & Ink', es: 'Plumas' } },
              { id: 'mounts', label: { fr: '🪄 Tapis & Montures', ar: 'البساط والمقود', en: 'Mounts & Carpets', es: 'Monturas' } },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { sound.playPop(); setActiveCategory(cat.id as any); }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-lg font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {cat.label[lang] || cat.label.fr}
              </button>
            ))}
          </div>

          {/* Shop Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const isOwned = purchased.includes(item.id);
              const canAfford = student.stars >= item.priceStars && student.gems >= item.priceGems;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between text-left relative overflow-hidden ${
                    isOwned
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-xl'
                      : 'bg-white/5 border-white/10 hover:border-amber-400 shadow-xl'
                  }`}
                >
                  {isOwned && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Possédé ✓</span>
                    </div>
                  )}

                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-4xl flex items-center justify-center mb-4 shadow-inner">
                      {item.emoji}
                    </div>
                    <h3 className="text-lg font-black font-['Fredoka'] text-white mb-1">
                      {item.name[lang] || item.name.fr}
                    </h3>
                    <p className="text-xs text-amber-200/80 mb-4 leading-relaxed">
                      {item.description[lang] || item.description.fr}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="text-amber-300 flex items-center gap-1">⭐ {item.priceStars}</span>
                      <span className="text-sky-300 flex items-center gap-1">💎 {item.priceGems}</span>
                    </div>

                    {isOwned ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                        Dans l'inventaire
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBuyItem(item)}
                        className={`px-5 py-2 rounded-xl font-bold text-xs shadow-lg cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-700 text-slate-400 opacity-70 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Acheter 🎁' : 'Fonds insuffisants'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Inventory & Equipment Tab */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
            <h3 className="text-lg font-black font-['Fredoka'] text-amber-300">
              🎒 Mon Inventaire d'Accessoires Équipés
            </h3>
            <p className="text-xs text-amber-200/80">
              Clique sur un objet pour l'équiper sur ton profil ou l'enlever.
            </p>

            {purchased.length === 0 ? (
              <div className="text-center py-12 text-amber-200/60 text-xs">
                Ton inventaire est vide. Rends-toi dans la boutique pour acheter tes premiers accessoires !
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchased.map((itemId) => {
                  const item = SHOP_ITEMS.find((i) => i.id === itemId);
                  if (!item) return null;
                  const isEquipped = equipped === item.emoji;

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        isEquipped
                          ? 'bg-amber-500/20 border-amber-400 shadow-lg'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-3xl flex items-center justify-center">
                          {item.emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white font-['Fredoka']">
                            {item.name[lang] || item.name.fr}
                          </h4>
                          <span className="text-[11px] text-amber-300">
                            {isEquipped ? '✨ Équipé sur l’avatar' : 'Dans le coffre'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleEquipItem(item.emoji)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-md ${
                          isEquipped
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                        }`}
                      >
                        {isEquipped ? 'Équipé ✓' : 'Équiper'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-amber-500/10 border border-amber-400/30 p-4 rounded-2xl text-center text-xs text-amber-300 font-semibold">
        💡 Vos objets achetés et équipés s'affichent instantanément à côté de votre avatar dans toute l'application !
      </div>
    </div>
  );
};
