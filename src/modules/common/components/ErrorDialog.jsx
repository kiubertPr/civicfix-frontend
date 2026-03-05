import PropTypes from 'prop-types';
import { NetworkError } from '../../../backend';

const ErrorDialog = ({ error, onClose }) => {
    if (error == null) return null;

    const message = error instanceof NetworkError
        ? 'Ha ocurrido un error en la red.'
        : error.message;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-200">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-red-600">Error</h2>
                </div>
                <div className="px-6 py-4">
                    <p className="text-gray-700">{message}</p>
                </div>
                <div className="px-6 py-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

ErrorDialog.propTypes = {
    error: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default ErrorDialog;
