import PropTypes from "prop-types";

const ErrorDisplay = ({ backendErrors, handleCancelClick }) => {

    const getErrorMessage = (error) => {
        console.log("Error recibido:", error);

        switch (error.globalError) {
            case "project.exceptions.IncorrectLoginException":
                return "El nombre de usuario o contraseña no son válidos. Verifica los datos e intenta nuevamente.";
            case "IncorrectPasswordException":
                return "La contraseña ingresada es incorrecta. Por favor, inténtalo de nuevo.";   
            case "DuplicateInstanceException":
                return "El elemento que intentas crear ya existe. Por favor, verifica los datos e intenta de nuevo.";
            case "InstanceNotFoundException":
                return "No se ha encontrado esta instancia.";
            case "project.exceptions.SurveyEndedException":
                return "La encuesta ha finalizado. No se pueden enviar más respuestas.";
            case "project.exceptions.NotEnoughPointsException":
                return "No tienes suficientes puntos para realizar esta acción.";
            case "project.exceptions.PermissionException":
                return "No tienes permiso para realizar esta acción. Por favor, contacta al administrador si crees que esto es un error.";
            case "project.exceptions.DuplicateEmailException":
                return "Ya existe una cuenta con este correo electrónico. Por favor, utiliza otro correo o inicia sesión con el existente.";
            case "project.exceptions.DuplicateUsernameException":
                return "El nombre de usuario ya está en uso. Por favor, elige otro nombre de usuario.";
            case "project.exceptions.ForbiddenFileTypeException":
                return "El tipo de archivo que intentas subir no está permitido. Por favor, verifica el tipo de archivo e intenta nuevamente.";
            case "project.exceptions.MaxFileSizeException":
                return "El archivo que intentas subir excede el tamaño máximo permitido (15MB). Por favor, verifica el tamaño del archivo e intenta nuevamente.";
            case "project.exceptions.UserDisableException":
                return "Tu cuenta ha sido deshabilitada. Por favor, contacta al administrador para más información.";
           default:
                return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.";
        } 
    };

    return backendErrors.globalError ? (
        <div className="mt-3 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded relative">
            <strong className="font-bold">Advertencia:</strong>
            <p className="mt-1">{getErrorMessage(backendErrors)}</p>
            <button 
                onClick={handleCancelClick} 
                className="absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900"
            >
                &times;
            </button>
        </div>
    ) : (
        
            <div className="mt-3 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded relative">
                <strong className="font-bold">Advertencia</strong>
                <p className="mt-1">{backendErrors}</p>
                <button 
                    onClick={handleCancelClick} 
                    className="absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900"
                >
                    &times;
                </button>
            </div>
        
    );
};

ErrorDisplay.propTypes = {
    backendErrors: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
    handleCancelClick: PropTypes.func.isRequired
};

export default ErrorDisplay;