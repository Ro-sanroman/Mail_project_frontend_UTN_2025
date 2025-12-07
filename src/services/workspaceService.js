import ENVIRONMENT from "../config/enviroment.js";

export async function getWorkspaces() {
  const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspace`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
  });
  
  console.log('[getWorkspaces] response_http status:', response_http.status);
  
  if (!response_http.ok) {
    throw new Error("Error al obtener lista de workspaces");
  }
  
  const response = await response_http.json();
  console.log('[getWorkspaces] response completo:', JSON.stringify(response, null, 2));
  console.log('[getWorkspaces] response.data:', response.data);
  console.log('[getWorkspaces] response.data.workspaces:', response.data?.workspaces);
  console.log('[getWorkspaces] es array?:', Array.isArray(response.data?.workspaces));
  console.log('[getWorkspaces] length:', response.data?.workspaces?.length);
  
  const workspaces = response.data?.workspaces || [];
  console.log('[getWorkspaces] retornando:', workspaces);
  return workspaces;
}
export async function createWorkspace(workspace_name) {
  const body = { name: workspace_name };
  const response_http = await fetch(ENVIRONMENT.URL_API + "/api/workspace", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    body: JSON.stringify(body),
  });
  let response;
  try {
    response = await response_http.json();
  } catch (e) {
    response = { ok: response_http.ok, status: response_http.status };
  }
  console.log(
    "[workspaceService][POST] status:",
    response_http.status,
    "response:",
    response
  );
  if (!response_http.ok || response?.ok === false) {
    throw new Error(response?.message || "Error al crear workspace");
  }
  return response;
}

export async function deleteWorkspace(workspace_id) {
  const response_http = await fetch(
    `${ENVIRONMENT.URL_API}/api/workspace/${workspace_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }
  );

  let response;
  try {
    response = await response_http.json();
  } catch (e) {
    response = { ok: response_http.ok, status: response_http.status };
  }

  if (!response_http.ok || response?.ok === false) {
    throw new Error(response?.message || "Error al eliminar workspace");
  }
  return response;
}
