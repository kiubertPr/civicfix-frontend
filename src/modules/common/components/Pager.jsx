import { ChevronLeft, ChevronRight } from "lucide-react";

const Pager = ({ page, totalPages, size, onPageChange, onSizeChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800 rounded-lg p-4 border border-gray-700 gap-4 mb-2">
        {/* Tamaño por página (solo visible en sm en adelante) */}
        <div className="hidden sm:flex items-center space-x-2">
            <span className="text-sm text-gray-400">Mostrar:</span>
            <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-amber-500 focus:outline-none"
            >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-400">por página</span>
        </div>

        <div className="flex items-center justify-center w-full sm:w-auto space-x-4">
            <span className="text-sm text-gray-400 hidden sm:inline">
            Página {page + 1} de {totalPages}
            </span>
            <div className="flex space-x-2">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 0}
                className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
            >
                <ChevronLeft size={16} className="mr-1" />
                <span className="hidden sm:inline">Anterior</span>
            </button>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
            >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight size={16} className="ml-1" />
            </button>
            </div>
        </div>
    </div>
  );
};

export default Pager;
