// PAGE D'ACCUEIL (Landing Page)
// Design sombre luxueux avec accents dorés/cuivre

import Link from "next/link";

const features = [
  {
    icon: "✦",
    title: "IA Intelligente",
    description: "Notre IA comprend l'univers de la restauration et crée des posts qui donnent faim.",
  },
  {
    icon: "◈",
    title: "Multi-plateformes",
    description: "Instagram, Facebook, Twitter, LinkedIn, Google My Business — tous les réseaux couverts.",
  },
  {
    icon: "⚡",
    title: "En 30 secondes",
    description: "Remplis le formulaire, clique, et ton post est prêt à publier.",
  },
  {
    icon: "◆",
    title: "Ton sur mesure",
    description: "Choisis le ton : fun, élégant, promotionnel... L'IA s'adapte à ton restaurant.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "49",
    period: "/mois",
    description: "Parfait pour démarrer",
    features: [
      "30 générations par mois",
      "Posts Instagram & Facebook",
      "Historique 30 jours",
      "Support par email",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Pro",
    price: "99",
    period: "/mois",
    description: "Pour les restaurants ambitieux",
    features: [
      "Générations illimitées",
      "Tous les réseaux sociaux",
      "Historique illimité",
      "Support prioritaire",
      "Tons personnalisés",
    ],
    cta: "Passer Pro",
    popular: true,
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* === HERO SECTION === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#111111]">
        {/* Cercle décoratif doré (inspiré de l'image) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#C9A96E]/30 animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#C9A96E]/10 pointer-events-none" />

        {/* Gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111111]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 border border-[#C9A96E]/30 text-[#C9A96E] px-5 py-2 rounded-full text-sm tracking-wider mb-8">
            <span className="w-2 h-2 bg-[#C9A96E] rounded-full animate-pulse" />
            NOUVEAU — Générez vos posts en 30 secondes
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Vos réseaux sociaux
            <br />
            <span className="text-[#C9A96E]">gérés par l&apos;IA</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Générez des posts Instagram, Facebook et plus encore pour votre
            restaurant en quelques clics. L&apos;IA fait le travail, vous
            récoltez les clients.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-[#C9A96E] text-black px-8 py-4 rounded text-lg font-semibold hover:bg-[#D4B87A] transition glow-gold uppercase tracking-wider"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="#pricing"
              className="border border-gray-600 text-gray-300 px-8 py-4 rounded text-lg font-semibold hover:border-[#C9A96E] hover:text-[#C9A96E] transition uppercase tracking-wider"
            >
              Voir les tarifs
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-600 tracking-wider">
            Pas besoin de carte bancaire pour essayer
          </p>
        </div>
      </section>

      {/* === FONCTIONNALITÉS === */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white">
              Pourquoi les restaurants adorent{" "}
              <span className="text-[#C9A96E]">RestoSocial</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Fini les heures passées à chercher quoi poster. Notre IA crée du
              contenu qui attire les clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A] hover:border-[#C9A96E]/30 transition group"
              >
                <span className="text-2xl text-[#C9A96E]">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === COMMENT ÇA MARCHE === */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              3 étapes simples pour des posts qui cartonnent
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Décris ton restaurant",
                desc: "Remplis un formulaire rapide avec le type de cuisine, le nom, l'ambiance...",
              },
              {
                step: "02",
                title: "L'IA génère ton post",
                desc: "En quelques secondes, tu reçois un post optimisé pour le réseau social de ton choix.",
              },
              {
                step: "03",
                title: "Publie et attire des clients",
                desc: "Copie le post, publie-le, et regarde ton restaurant se remplir !",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-[family-name:var(--font-playfair)] font-bold text-[#C9A96E]/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TARIFS === */}
      <section id="pricing" className="py-24 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white">
              Des tarifs simples et transparents
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Choisissez le plan adapté à votre restaurant
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 relative ${
                  plan.popular
                    ? "bg-[#C9A96E] text-black glow-gold"
                    : "bg-[#1A1A1A] border border-[#2A2A2A]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-[#C9A96E] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Populaire
                  </span>
                )}
                <h3 className={`text-xl font-bold ${plan.popular ? "text-black" : "text-white"}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.popular ? "text-black/60" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className={plan.popular ? "text-black/60" : "text-gray-500"}>
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-black/40" : "text-[#C9A96E]"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`mt-8 block text-center py-3 rounded font-semibold transition uppercase tracking-wider text-sm ${
                    plan.popular
                      ? "bg-black text-[#C9A96E] hover:bg-gray-900"
                      : "bg-[#C9A96E] text-black hover:bg-[#D4B87A]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA FINAL === */}
      <section className="py-24 bg-[#0D0D0D] relative overflow-hidden">
        {/* Cercle décoratif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#C9A96E]/10 pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white">
            Prêt à booster votre restaurant ?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Rejoignez des centaines de restaurants qui utilisent déjà RestoSocial
            pour attirer plus de clients.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-block bg-[#C9A96E] text-black px-8 py-4 rounded text-lg font-semibold hover:bg-[#D4B87A] transition glow-gold uppercase tracking-wider"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
