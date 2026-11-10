import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client server-side if key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'NoorKids Arabe & Coran',
    author: 'Maryam et son fils',
    hasGemini: !!ai,
  });
});

// AI Interactive Storytelling & Guidance endpoint
app.post('/api/gemini/story-helper', async (req, res) => {
  try {
    const { prompt, language = 'fr', age = 6, childName = 'Petit Savant' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      // Safe high-quality fallback if API key is not configured in secrets
      return res.json({
        reply: getFallbackStoryReply(prompt, language, childName),
        source: 'local-companion',
      });
    }

    const systemInstruction = `Tu es "Noor l'Ami Sage", un conteur chaleureux, bienveillant et pédagogue pour les enfants qui apprennent la langue arabe, les histoires des Prophètes et le Saint Coran.
Cette application a été créée avec amour par "Maryam et son fils".
Règles :
1. Réponds toujours dans la langue demandée : ${language === 'ar' ? 'Arabe' : language === 'en' ? 'Anglais' : language === 'es' ? 'Espagnol' : 'Français'}.
2. Adapte ton vocabulaire à un enfant de ${age} ans (ton joyeux, doux, encourageant, plein d'émerveillement).
3. Intègre quelques mots arabes simples avec leur translittération et traduction (ex: Shukran / Merci, Jamil / Beau, Bismillah / Au nom de Dieu).
4. Si l'enfant demande une suite d'histoire ou une leçon morale, raconte un court paragraphe captivant avec une belle valeur (la patience, la gentillesse, le respect des parents, l'amitié).
5. Ne fais jamais de réponses trop longues : 2 à 3 paragraphes courts maximum avec des emojis réconfortants.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || getFallbackStoryReply(prompt, language, childName);
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error generating story response:', error);
    res.json({
      reply: getFallbackStoryReply(req.body.prompt, req.body.language || 'fr', req.body.childName || 'Petit Savant'),
      source: 'fallback-on-error',
    });
  }
});

// Personalized Reading Recommendations endpoint
app.post('/api/gemini/recommendations', async (req, res) => {
  try {
    const { masteredLettersCount = 10, currentLevel = 'Débutant', interests = [] } = req.body;

    if (!ai) {
      return res.json({
        recommendations: [
          {
            title: "L'Arche du Prophète Nuh (Noé)",
            arabicTitle: "سَفِينَةُ نُوحٍ",
            category: "Histoire des Prophètes",
            difficulty: "Facile",
            reason: "Parfait pour apprendre le vocabulaire des animaux et la patience !",
            recommendedSurah: "Al-Fil (L'Éléphant)",
          },
          {
            title: "Le Voyage du Petit Chameau Badr",
            arabicTitle: "رِحْلَةُ بَدْرٍ",
            category: "Littérature Enfants",
            difficulty: "Intermédiaire",
            reason: "Une aventure palpitante à travers le désert avec les lettres de l'alphabet.",
            recommendedSurah: "Al-Kawthar (L'Abondance)",
          },
          {
            title: "Yunus et la Baleine Lumineuse",
            arabicTitle: "يُونُسُ فِي بَطْنِ الحُوتِ",
            category: "Histoire des Prophètes",
            difficulty: "Facile",
            reason: "Une histoire magique sous l'océan pleine d'espoir et de pardon.",
            recommendedSurah: "Al-Ikhlas (La Pureté)",
          },
        ],
      });
    }

    const prompt = `Génère 3 recommandations personnalisées de lecture et de mémorisation pour un enfant qui connaît ${masteredLettersCount} lettres de l'alphabet arabe, au niveau ${currentLevel}. Centre d'intérêts : ${interests.join(', ') || 'animaux, nature, contes'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `Tu es le conseiller pédagogique de NoorKids, créé par Maryam et son fils.
Réponds UNIQUEMENT sous forme d'un tableau JSON d'objets avec :
- title (titre en français)
- arabicTitle (titre en arabe vocalisé)
- category (catégorie)
- difficulty (Facile, Moyen, Avancé)
- reason (pourquoi c'est adapté à cet enfant)
- recommendedSurah (sourate courte recommandée)`,
        responseMimeType: 'application/json',
      },
    });

    let recs = [];
    try {
      recs = JSON.parse(response.text || '[]');
    } catch {
      recs = [];
    }

    res.json({ recommendations: recs.length > 0 ? recs : [] });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.json({ recommendations: [] });
  }
});

function getFallbackStoryReply(prompt: string, language: string, name: string): string {
  if (language === 'ar') {
    return `أهلاً بك يا بطلنا الصغير ${name} ! 🌟 ما أجمل هذا السؤال عن لغتنا العربية الجميلة. تذكر دائماً أن تبدأ عملك بـ "بِسْمِ اللَّه" وأن تكون عطوفاً كالنبي محمد صلى الله عليه وسلم. هل تريد أن نستكشف قصة سفينة نوح معاً؟ ⛵`;
  }
  if (language === 'en') {
    return `Hello little explorer ${name}! 🌟 What a wonderful question. Arabic is full of treasures! Remember to always say "Bismillah" (In the name of God) and be kind like the prophets. Would you like to read the adventure of Prophet Yunus and the big whale today? 🐋`;
  }
  return `Bonjour cher petit savant ${name} ! 🌟 Quelle belle curiosité ! La langue arabe est comme un coffre rempli de perles brillantes. Savais-tu que chaque lettre a sa propre musique ?
Rappelle-toi toujours d'être généreux et bienveillant, comme nous l'enseignent les beaux récits des Prophètes.
Veux-tu que nous découvrions ensemble une nouvelle aventure ou un mot magique aujourd'hui ? 📖✨`;
}

// Dev vs Prod handling
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ NoorKids Applet running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
