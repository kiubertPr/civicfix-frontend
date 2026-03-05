import backend from '../../backend';

export const contact = (data, onSuccess, onErrors) => {
  return (dispatch) => {
    
    backend.mailService.contact(
      data,
      (response) => {
        // Despachar acción de éxito
        dispatch({
          type: "CONTACT_SUCCESS",
          payload: response,
        })
        if (onSuccess) onSuccess(response)
      },
      (errors) => {
        // Despachar acción de error
        dispatch({
          type: "CONTACT_ERROR",
          payload: errors,
        })
        if (onErrors) onErrors(errors)
      },
    )
  }
}