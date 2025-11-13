import { useState } from "react"

const useFetch = () => {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function sendRequest ( requestCallback ) {
        setError(null)
        setLoading(true)
        try{
            console.log('[useFetch] sendRequest started')
            const response = await requestCallback()
            console.log('[useFetch] Response received:', response)

            // Only treat as error if explicitly ok: false (from auth endpoints)
            // For other endpoints that don't send ok, just pass through
            if(response && response.ok === false){
                console.error('[useFetch] Response indicates error:', response.message)
                setError(response.message || 'Error desconocido')
                return
            }
            
            setResponse(response)
        }
        catch(error){
            console.error('[useFetch] Catch error:', error)
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