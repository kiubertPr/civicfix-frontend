import { useState } from 'react';
import { set, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {Home} from '../../app';
import {BackLink, ErrorDisplay} from '../../common';
import { X } from 'lucide-react';

import * as surveyActions from '../actions';

const SurveyForm = ({mode = "create", initialData = {}, OnSuccess}) => {

  const [backendErrors, setBackendErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEditMode = mode === "edit";

  const {register, handleSubmit, control, formState: {errors}} = useForm({
    defaultValues: {
      question: initialData.question || "",
      options: initialData.options || [{option: ""}, {option: ""}],
      surveyType: initialData.surveyType || "",
      endDateTime: initialData.endDateTime ? new Date(initialData.endDateTime).toISOString().slice(0, 16) : "",
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "options",
    rules: {
      required: "Debe haber al dos una opción",
      minLength: {
        value: 2,
        message: "Debe haber al menos dos opciones"
      }
    }
  });


  const onSubmit = async (data) => {
    setIsLoading(true);
    setBackendErrors(null);

    const surveyRequestDto = {
      question: data.question,
      options: data.options.map(opt => opt.option).filter(opt => opt.trim() !== ""),
      surveyType: data.surveyType,
      endDateTime: data.endDateTime ? new Date(data.endDateTime).toISOString() : null,
    };

    if (isEditMode) {
      surveyRequestDto.id = initialData.id; // Assuming initialData contains the id for edit mode
    }

    try {
      
      if (isEditMode) {
        //Algo va a pasar aqui
      }else {

        dispatch(surveyActions.createSurvey(
          surveyRequestDto,
          () => {
            setIsLoading(false);
            OnSuccess? OnSuccess() : navigate("/");
          },
          (errors) => {
            setIsLoading(false);
            setBackendErrors(errors);
          },
        ));
      
      }

    } catch (error) {
      setBackendErrors(error.response?.data || "Error desconocido al enviar el formulario");
      setIsLoading(false);
    }
  
  };


  return (
    <Home>
        <div className="lg:w-3/5 max-w-5xl w-full lg:mt-0 mt-15 mx-auto px-4 py-6 overflow-y-auto scroll-auto scroll no-scrollbar">
            <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-5">
                <BackLink />
                <div className="border-b border-gray-700 p-6">
                  <h2 className="text-2xl font-bold text-white"> Formulario de Encuestas</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                  {backendErrors && (
                    <ErrorDisplay backendErrors={backendErrors} handleCancelClick={() => setBackendErrors(null)} />
                  )}

                  <div className="space-y-2">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-300">
                      Pregunta
                    </label>
                    <textarea
                      id="question"
                      disabled={isLoading}
                      {...register("question", { required: "La pregunta es obligatoria" })}
                      className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition min-h-30"
                      placeholder="Pregunta para la encuesta"
                      defaultValue={initialData.question || ""}
                    />
                    {errors.question && <span className="text-red-500 text-sm">{errors.question.message}</span>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="surveyType" className="block text-sm font-medium text-gray-300">
                      Tipo de Encuesta
                    </label>
                    <select
                      id="surveyType"
                      disabled={isLoading}
                      {...register("surveyType", { required: "El tipo de encuesta es obligatorio"})}
                      className="bg-gray-700 text-white lg:text-base text-sm rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                      defaultValue={initialData.surveyType || ""}
                    >
                      <option value="" disabled>Seleccione un tipo de encuesta</option>
                      <option value="0">Opción única</option>
                      <option value="1">Opción múltiple</option>
                    </select>
                    {errors.surveyType && <span className="text-red-500 text-sm">{errors.surveyType.message}</span>}
                  </div>

                  {/* Nuevo campo de Fecha y Hora de Finalización */}
                  <div className="space-y-2">
                    <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-300">
                      Fecha y Hora de Finalización
                    </label>
                    <input
                      type="datetime-local"
                      id="endDateTime"
                      disabled={isLoading}
                      {...register("endDateTime", {
                        required: "La fecha y hora de finalización es obligatoria",
                        validate: (value) => {
                          if (!value) return "La fecha y hora de finalización es obligatoria"
                          const selectedDate = new Date(value)
                          const now = new Date()
                          const fiveHoursLater = new Date(now.getTime() + 5 * 60 * 60 * 1000)

                          if (selectedDate.getTime() < fiveHoursLater.getTime()) {
                            return "La fecha y hora de finalización debe ser al menos 5 horas después de ahora."
                          }
                          return true
                        },
                      })}
                      className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                    />
                    {errors.endDateTime && <span className="text-red-500 text-sm">{errors.endDateTime.message}</span>}
                  </div>

                  {fields.map((item, index) => (
                    <div key={item.id} className="space-y-2">
                      <label htmlFor={`options.${index}.option`} className="block text-sm font-medium text-gray-300">
                        Opción {index + 1}
                      </label>
                      <section className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={isLoading || fields.length <= 2}
                          hidden={fields.length <= 2}
                          aria-label="Eliminar opción"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 transition">
                            <X className="h-5 w-5 inline-block mr-2" />
                          </button>
                        <input
                          id={`options.${index}.option`}
                          disabled={isLoading}
                          {...register(`options.${index}.option`, { required: "La opción es obligatoria" })}
                          className="bg-gray-700 text-white rounded-lg p-3 w-full border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                          placeholder={`Opción ${index + 1}`}
                        />
                      </section>
                      {errors.options && errors.options[index] && errors.options[index].option && (
                        <span className="text-red-500 text-sm">{errors.options[index].option.message}</span>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => append({ option: "" })}
                    className="text-amber-500 hover:text-amber-600 transition"
                  >
                    Añadir otra opción
                  </button>

                  {/* Botón de envío */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full font-medium rounded-lg py-3 px-4 transition-colors
                            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800
                            flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white"`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      isEditMode ? "Actualizar Survey" : "Crear Survey"
                    )}
                  </button>
                </form>
            </div>
        </div>
    </Home>
  );
}

export default SurveyForm;