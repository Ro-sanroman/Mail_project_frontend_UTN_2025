import { useState } from "react";

const useFetch = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendRequest(requestCallback) {
    if (!requestCallback) {
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const response = await requestCallback();

      // Si la respuesta tiene la propiedad 'ok' y es false, lanzar error
      if (response && typeof response === 'object' && 'ok' in response && response.ok === false) {
        throw new Error(response.message || "Error desconocido");
      }
      setResponse(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function resetResponse() {
    setResponse(null);
  }

  return {
    response,
    loading,
    error,
    sendRequest,
    resetResponse,
  };
};

export default useFetch;
