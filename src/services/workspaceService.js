import ENVIRONMENT from "../config/enviroment";

export async function getWorkspaces () {
    try {
        console.log('[getWorkspaces] Fetching from:', ENVIRONMENT.URL_API + '/api/workspace')
        const auth_token = localStorage.getItem('auth_token')
        console.log('[getWorkspaces] Auth token presente:', !!auth_token)
        
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/workspace',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${auth_token}`
                }
            }
        )
        console.log('[getWorkspaces] Response status:', response_http.status, response_http.statusText)
        
        if(!response_http.ok){
            const errorText = await response_http.text()
            console.error('[getWorkspaces] Error response:', response_http.status, errorText)
            throw new Error('Error al obtener lista de workspaces: ' + response_http.status)
        }
        
        const text = await response_http.text()
        if (!text) {
            console.warn('[getWorkspaces] Empty response')
            return { ok: true, workspaces: [] }
        }
        
        const response = JSON.parse(text)
        console.log('[getWorkspaces] Response:', response)
        return response
    } catch (error) {
        console.error('[getWorkspaces] Error:', error)
        throw error
    }
}