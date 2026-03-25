// Pied de page simple affiché sur toutes les pages

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="font-bold text-white">
              Resto<span className="text-orange-500">Social</span>
            </span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} RestoSocial. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
