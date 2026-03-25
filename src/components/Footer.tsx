// Pied de page — style sombre luxueux

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-[family-name:var(--font-playfair)] font-bold text-lg text-white">
            Resto<span className="text-[#C9A96E]">Social</span>
          </span>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RestoSocial. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
