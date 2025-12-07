import ENVIRONMENT from "../config/enviroment";

export async function register (username, email, password){

    try{
        const body = {
            name: username, 
            email,
            password
        }
    
  
        const response_http = await fetch(
            ENVIRONMENT.URL_API + '/api/auth/register',
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(body)
            }
        )
        const response = await response_http.json()
    
        return response
    }
    catch(error){
        console.error('Error al registrar:', error)
        throw new Error('Error interno del servidor')
    }
}

export async function login(email, password) {
  try {
    const body = {
      email,
      password,
    };

    if (!ENVIRONMENT.URL_API || typeof ENVIRONMENT.URL_API !== "string") {
      console.error(
        "[Login] URL_API inválida:",
        ENVIRONMENT.URL_API,
        "tipo:",
        typeof ENVIRONMENT.URL_API
      );
      console.error("[Login] ENVIRONMENT completo:", ENVIRONMENT);
      throw new Error("URL del servidor no configurada correctamente");
    }

    const loginUrl = ENVIRONMENT.URL_API + "/api/auth/login";
    console.log("[Login] URL construida:", loginUrl);

    const response_http = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log(
      "[Login] Response status:",
      response_http.status,
      response_http.statusText
    );
    const text = await response_http.text();
    if (!text) {
      console.warn(
        "[Login] Respuesta vacía del servidor:",
        response_http.status
      );
      return {
        ok: false,
        message: "Respuesta vacía del servidor",
        status: response_http.status,
      };
    }
    try {
      const response = JSON.parse(text);
      return response;
    } catch (parseError) {
      console.error("[Login] respuesta no JSON", parseError, "raw:", text);
      return {
        ok: false,
        message: "Respuesta inválida del servidor",
        raw: text,
        status: response_http.status,
      };
    }
  } catch (error) {
    console.error("[Login] Error capturado:", error);
    return {
      ok: false,
      message: error.message || "Error interno del servidor",
      status: 500,
    };
  }
}
