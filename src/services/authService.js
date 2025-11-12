import ENVIRONMENT from "../config/enviroment"

export async function register (name, email, password){

    try{
        const body = {
            name: name, 
            email: email,
            password
        }
        
        // Validar que URL_API está disponible y es string
        if (!ENVIRONMENT.URL_API || typeof ENVIRONMENT.URL_API !== 'string') {
            console.error('[Register] URL_API inválida:', ENVIRONMENT.URL_API, 'tipo:', typeof ENVIRONMENT.URL_API)
            console.error('[Register] ENVIRONMENT completo:', ENVIRONMENT)
            throw new Error('URL del servidor no configurada correctamente')
        }
        
        const registerUrl = ENVIRONMENT.URL_API + '/api/auth/register'
        console.log('[Register] URL construida:', registerUrl)
    
        //Fetch es una funcion nativa de JS para hacer consultas HTTP
        const response_http = await fetch(registerUrl, {
            method: 'POST',
            headers: {
                //Indica a mi servidor que voy a enviar un JSON por body
                "Content-Type": 'application/json'
            },
            //Transformo el objeto de JS a JSON (texto)
            body: JSON.stringify(body)
        })
        
        console.log('[Register] Response status:', response_http.status, response_http.statusText)
        
        //Transformamos el body de respuesta de JSON a objeto de JS 
        const text = await response_http.text()
        if(!text) {
            console.warn('[Register] Respuesta vacía del servidor:', response_http.status)
            return { ok: false, message: 'Respuesta vacía del servidor', status: response_http.status }
        }
        try {
            const response = JSON.parse(text)
            return response
        }
        catch(parseError){
            console.error('[Register] respuesta no JSON', parseError, 'raw:', text)
            return { ok: false, message: 'Respuesta inválida del servidor', raw: text, status: response_http.status }
        }
    }
    catch(error){
        console.error('[Register] Error capturado:', error)
        return { ok: false, message: error.message || 'Error interno del servidor', status: 500 }
    }
}

export async function login (email, password){
    try{
        const body = {
            email, 
            password
        }
        
        // Validar que URL_API está disponible y es string
        if (!ENVIRONMENT.URL_API || typeof ENVIRONMENT.URL_API !== 'string') {
            console.error('[Login] URL_API inválida:', ENVIRONMENT.URL_API, 'tipo:', typeof ENVIRONMENT.URL_API)
            console.error('[Login] ENVIRONMENT completo:', ENVIRONMENT)
            throw new Error('URL del servidor no configurada correctamente')
        }
        
        const loginUrl = ENVIRONMENT.URL_API + '/api/auth/login'
        console.log('[Login] URL construida:', loginUrl)
    
        const response_http = await fetch(loginUrl, {
            method: 'POST',
            headers: {
                //Indica a mi servidor que voy a enviar un JSON por body
                "Content-Type": 'application/json'
            },
            //Transformo el objeto de JS a JSON (texto)
            body: JSON.stringify(body)
        })
        
        // Log status y headers para debug
        console.log('[Login] Response status:', response_http.status, response_http.statusText)
        
        // Leer como texto primero para evitar errores al parsear JSON vacio o HTML
        const text = await response_http.text()
        if(!text) {
            console.warn('[Login] Respuesta vacía del servidor:', response_http.status)
            return { ok: false, message: 'Respuesta vacía del servidor', status: response_http.status }
        }
        try {
            const response = JSON.parse(text)
            return response
        }
        catch(parseError){
            console.error('[Login] respuesta no JSON', parseError, 'raw:', text)
            return { ok: false, message: 'Respuesta inválida del servidor', raw: text, status: response_http.status }
        }

    }
    
    catch(error){
        console.error('[Login] Error capturado:', error)
        return { ok: false, message: error.message || 'Error interno del servidor', status: 500 }
    }
}