import React, { useEffect, useState } from "react";
import useFetch from "../../hook/useFetch.jsx";
import {
  getWorkspaces,
  createWorkspace,
} from "../../services/workspaceService.js";
import { inviteToWorkspace } from "../../services/channelService.js";
import { createChannel } from "../../services/channelService.js";
import { Link } from "react-router";
import "./HomeScreen.css";

const HomeScreen = () => {

  const { sendRequest, response, loading, error } = useFetch();
  const {
    sendRequest: sendCreate,
    loading: creating,
    error: createError,
    response: createResponse,
  } = useFetch();
  const {
    sendRequest: sendInvite,
    loading: inviting,
    error: inviteError,
    response: inviteResponse,
  } = useFetch();
  const [workspaceName, setWorkspaceName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(
  localStorage.getItem("workspace_id") || ""
);

useEffect(
    ()=> {
      sendRequest(
        () => getWorkspaces()
      )
    },
    []
  )
  // Sincronizar estado local cuando llega la respuesta del fetch
  useEffect(() => {
    if (response && Array.isArray(response?.data?.workspaces)) {
      setWorkspaces(response.data.workspaces);
      // Si no hay selección, elegir el primero disponible
      if (!selectedWorkspaceId && response.data.workspaces.length > 0) {
        setSelectedWorkspaceId(response.data.workspaces[0].workspace_id);
      }
    }
  }, [response]);

  useEffect(() => {
    if (createResponse) {
      setWorkspaceName("");
      // Intento de actualización optimista si la API devuelve el workspace creado
      const ws = createResponse?.data?.workspace || createResponse?.workspace || createResponse?.body?.workspace;
      if (ws && ws.workspace_id) {
        setWorkspaces((prev) => {
          const exists = prev.some((w) => w.workspace_id === ws.workspace_id);
          if (exists) return prev;
          return [{ workspace_id: ws.workspace_id, workspace_name: ws.workspace_name || workspaceName }, ...prev];
        });
        // Seleccionar automáticamente el recién creado
        setSelectedWorkspaceId(ws.workspace_id);
      } else {
        // Si la API no devuelve el workspace, agregamos un placeholder optimista
        const tempId = `temp_${Date.now()}`;
        setWorkspaces((prev) => [{ workspace_id: tempId, workspace_name: workspaceName }, ...prev]);
        setSelectedWorkspaceId(tempId);
      }
      // Re-fetch para asegurar consistencia
      sendRequest(() => getWorkspaces());
    }
  }, [createResponse]);

  useEffect(() => {
    if (inviteResponse) {
      setInviteEmail("");
      setInviteRole("member");
    }
  }, [inviteResponse]);

  console.log(response, loading, error);
  return (
    <div className="screen-container home-layout">
      <aside className="home-sidebar">
        <h2 className="sidebar-title">Crear workspace</h2>
        <form
          className="workspace-create"
          onSubmit={(e) => {
            e.preventDefault();
            if (!workspaceName.trim() || creating) return;
            sendCreate(() => createWorkspace(workspaceName.trim()));
          }}
        >
          <input
            className="workspace-input"
            type="text"
            placeholder="Nombre del nuevo workspace"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <button
            className="workspace-create-button"
            type="submit"
            disabled={creating}
          >
            {creating ? "Creando..." : "Crear"}
          </button>
        </form>
        {createError && <div className="workspace-error">{createError}</div>}

        <h2 className="sidebar-title">Invitar al workspace</h2>
        <form
          className="workspace-invite"
          onSubmit={(e) => {
            e.preventDefault();
            if (!inviteEmail.trim() || inviting || !selectedWorkspaceId) return;
            sendInvite(() =>
              inviteToWorkspace(selectedWorkspaceId, inviteEmail.trim(), inviteRole)
            );
          }}
        >
          <select
            className="workspace-select"
            value={selectedWorkspaceId}
            onChange={(e) => setSelectedWorkspaceId(e.target.value)}
          >
            {workspaces.map((ws) => (
              <option key={ws.workspace_id} value={ws.workspace_id}>
                {ws.workspace_name}
              </option>
            ))}
          </select>
          <input
            className="workspace-input"
            type="email"
            placeholder="Email del usuario"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <select
            className="workspace-select"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="member">Miembro</option>
            <option value="admin">Administrador</option>
          </select>
          <button
            className="workspace-create-button"
            type="submit"
            disabled={inviting || !selectedWorkspaceId}
          >
            {inviting ? "Enviando..." : "Invitar"}
          </button>
          {inviteError && <div className="workspace-error">{inviteError}</div>}
          {inviteResponse && (
            <div className="workspace-success">Invitación enviada</div>
          )}
        </form>
      </aside>

      <main className="home-content">
        <h1 className="header-title">Espacios de trabajo</h1>
        {loading ? (
          <span className="loading-message">Cargando...</span>
        ) : (
          Array.isArray(workspaces) && workspaces.length === 0 ? (
            <div className="empty-workspaces">
              <div className="empty-icon">🗂️</div>
              <h3 className="empty-title">No hay workspaces aún</h3>
              <p className="empty-subtitle">Creá tu primer workspace desde la barra lateral</p>
            </div>
          ) : (
            <div className="workspace-list">
              {workspaces.map((workspace) => {
                  return (
                    <div key={workspace.workspace_id} className="workspace-card">
                      <h2 className="workspace-name">
                        {workspace.workspace_name}
                      </h2>
                      <div className="workspace-actions">
                        <Link
                          to={"/workspace/" + workspace.workspace_id}
                          className="workspace-button"
                        >
                          Abrir workspace
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default HomeScreen;
