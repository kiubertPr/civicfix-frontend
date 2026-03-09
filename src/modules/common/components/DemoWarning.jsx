import { useEffect, useState } from "react";

function DemoWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem("demo-warning");

    if (!shown) {
      setVisible(true);
      localStorage.setItem("demo-warning", "true");
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 text-center animate-fade-in">

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Versión de Demostración
        </h2>

        <p className="text-gray-600 mb-4 text-justify">
          Esta es una versión de demostración de <span className="font-semibold">CivicFix</span>.
          La aplicación está limitada por el hardware de servicios gratuitos y puede experimentar peticiones lentas o fallos ocasionales. Por favor, ten paciencia y disfruta explorando la plataforma.
        </p>

        <ul className="text-sm text-gray-500 text-left mb-6 space-y-1">
          <li>• Los datos van a ser reiniciados periódicamente</li>
          <li>• Las imágenes cargadas van a ser eliminadas automáticamente</li>
          <li>• Algunas funciones pueden estar restringidas</li>
          <li>• Si encuentras un error, por favor repórtalo para mejorar la aplicación</li>
        </ul>

        <button
          onClick={() => setVisible(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
            Entendido
        </button>

      </div>
    </div>
  );
}

export default DemoWarning;