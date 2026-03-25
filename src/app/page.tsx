// PAGE D'ACCUEIL (Landing Page)
// C'est la première page que les visiteurs voient
// Contient : hero section, fonctionnalités, tarifs, CTA

import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "IA Intelligente",
    description:
      "Notre IA comprend l'univers de la restauration et crée des posts qui donnent faim.",
  },
  {
    icon: "📱",
    title: "Multi-plateformes",
    description:
      "Instagram, Facebook, Twitter, LinkedIn, Google My Business — tous les réseaux couverts.",
  },
  {
    icon: "⚡",
    title: "En 30 secondes",
    description:
      "Remplis le formulaire, clique, et ton post est prêt à publier. C'est aussi simple que ça.",
  },
  {
    icon: "🎨",
    title: "Ton sur mesure",
    description:
      "Choisis le ton : fun, élégant, promotionnel... L'IA s'adapte à ton restaurant.",
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
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-20 pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span>🔥</span>
            <span>Nouveau : Générez vos posts en 30 secondes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Vos réseaux sociaux
            <br />
            <span className="text-orange-500">gérés par l&apos;IA</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Générez des posts Instagram, Facebook et plus encore pour votre
            restaurant en quelques clics. L&apos;IA fait le travail, vous
            récoltez les clients.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-orange-500 text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-500/25"
            >
              Essayer gratuitement
            </Link>
            <Link
              href="#pricing"
              className="bg-white text-gray-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-gray-50 transition border border-gray-200"
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Pas besoin de carte bancaire pour essayer
          </p>
        </div>
      </section>

      {/* === FONCTIONNALITÉS === */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Pourquoi les restaurants adorent{" "}
              <span className="text-orange-500">RestoSocial</span>
            </h2>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
              Fini les heures passées à chercher quoi poster. Notre IA crée du
              contenu qui attire les clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-orange-50/50 rounded-2xl p-6 hover:shadow-md transition border border-orange-100/50"
              >
                <span className="text-4xl">{feature.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === COMMENT ÇA MARCHE === */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              3 étapes simples pour des posts qui cartonnent
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Décris ton restaurant",
                desc: "Remplis un formulaire rapide avec le type de cuisine, le nom, l'ambiance...",
              },
              {
                step: "2",
                title: "L'IA génère ton post",
                desc: "En quelques secondes, tu reçois un post optimisé pour le réseau social de ton choix.",
              },
              {
                step: "3",
                title: "Publie et attire des clients",
                desc: "Copie le post, publie-le, et regarde ton restaurant se remplir !",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TARIFS === */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Des tarifs simples et transparents
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Choisissez le plan adapté à votre restaurant
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 relative ${
                  plan.popular
                    ? "bg-orange-500 text-white shadow-xl shadow-orange-500/25 scale-105"
                    : "bg-white border-2 border-gray-100"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </span>
                )}
                <h3
                  className={`text-xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${plan.popular ? "text-orange-100" : "text-gray-500"}`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span
                    className={
                      plan.popular ? "text-orange-100" : "text-gray-500"
                    }
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-orange-200" : "text-orange-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`mt-8 block text-center py-3 rounded-xl font-semibold transition ${
                    plan.popular
                      ? "bg-white text-orange-500 hover:bg-orange-50"
                      : "bg-orange-500 text-white hover:bg-orange-600"
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
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Prêt à booster votre restaurant ?
          </h2>
          <p className="mt-4 text-lg text-orange-100">
            Rejoignez des centaines de restaurants qui utilisent déjà RestoSocial
            pour attirer plus de clients.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-block bg-white text-orange-500 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-orange-50 transition shadow-lg"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
