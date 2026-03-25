// Configuration de l'API Claude (Anthropic)
// Genere les posts pour les reseaux sociaux

// Types pour la generation
export interface GenerationRequest {
  restaurantName: string;
  cuisineType: string;
  postType: string;
  platform: string;
  tone: string;
  details?: string;
}

// Fonction principale qui genere le contenu via Claude
export async function generateSocialPost(
  request: GenerationRequest
): Promise<string> {
  // CLAUDE_API_KEY est utilise car le SDK Anthropic ecrase ANTHROPIC_API_KEY
  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Cle API Anthropic manquante ! Va dans ton fichier .env.local et ajoute CLAUDE_API_KEY=ta-cle"
    );
  }

  // Import dynamique pour eviter que le SDK ecrase process.env au chargement
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const anthropic = new Anthropic({ apiKey });

  const { restaurantName, cuisineType, postType, platform, tone, details } =
    request;

  const systemPrompt = `Tu es un expert en marketing digital spécialisé dans la restauration.
Tu crées des posts pour les réseaux sociaux qui donnent envie de venir manger.
Tu écris toujours en français.
Tu utilises des emojis de façon appropriée.
Tu connais les codes de chaque plateforme (hashtags Instagram, format LinkedIn pro, etc).
Tu ne mets JAMAIS de guillemets autour du post.
Tu génères UNIQUEMENT le contenu du post, rien d'autre.`;

  const userPrompt = `Génère un post ${platform} pour le restaurant "${restaurantName}".

Type de cuisine : ${cuisineType}
Type de post : ${postType}
Ton souhaité : ${tone}
${details ? `Détails supplémentaires : ${details}` : ""}

Règles :
- Le post doit être optimisé pour ${platform}
- Utilise le ton ${tone}
- Ajoute des hashtags pertinents si c'est pour Instagram ou Twitter
- Le post doit donner envie de venir au restaurant
- Adapte la longueur au format ${platform}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Erreur : Claude n'a pas renvoye de texte.");
  }

  return textBlock.text;
}
