import { useState } from "react"

const useFetch = () => {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

   async function sendRequest ( requestCallback ) {
        setError(null)
        setLoading(true)
        try{
            console.log('[useFetch] Ejecutando requestCallback...')
            const response = await requestCallback()
            console.log('[useFetch] Response recibido:', response)
            
            if(!response){
                console.error('[useFetch] Response es falsy:', response)
                throw new Error('Respuesta vacía del servidor')
            }
            
            // Si la respuesta tiene ok:false, no es un error de red, es un error lógico
            if(response.ok === false) {
                console.warn('[useFetch] Response.ok === false:', response.message)
                setResponse(response)
                return
            }
            
            setResponse(response)
        }
        catch(error){
            console.error('[useFetch] Error capturado:', error)
            setError(error.message || 'Error desconocido')
        }
        finally{
            setLoading(false)
        }
    }

    function resetResponse () {
        setResponse(null)
    }

    return {
        response,
        loading,
        error,
        sendRequest,
        resetResponse
    }
}

export default useFetch