import React, { useEffect, useState } from "react";
import useFetch from "../../hook/useFetch.jsx";
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace as deleteWorkspaceService,
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
    sendRequest: sendDelete,
    loading: deletingWorkspace,
    error: deleteWorkspaceError,
    response: deleteWorkspaceResponse,
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
  const [workspacePendingDelete, setWorkspacePendingDelete] = useState(null);

  useEffect(() => {
    sendRequest(() => getWorkspaces());
  }, []);
  useEffect(() => {
    console.log('[HomeScreen] useEffect response:', response);
    console.log('[HomeScreen] es array?', Array.isArray(response));
    console.log('[HomeScreen] tipo:', typeof response);
    if (response && Array.isArray(response)) {
      console.log('[HomeScreen] Actualizando workspaces:', response);
      setWorkspaces(response);
      if (!selectedWorkspaceId && response.length > 0) {
        setSelectedWorkspaceId(response[0].workspace_id);
      }
    }
  }, [response]);

  useEffect(() => {
    if (createResponse) {
      setWorkspaceName("");
      const newWorkspace = createResponse?.data?.workspace;
      if (newWorkspace && newWorkspace.workspace_id) {
        setSelectedWorkspaceId(newWorkspace.workspace_id);
      }
      sendRequest(() => getWorkspaces());
    }
  }, [createResponse]);

  useEffect(() => {
    if (deleteWorkspaceResponse?.ok && workspacePendingDelete) {
      setWorkspaces((prev) => {
        const updated = prev.filter(
          (ws) => ws.workspace_id !== workspacePendingDelete
        );
        if (selectedWorkspaceId === workspacePendingDelete) {
          setSelectedWorkspaceId(updated[0]?.workspace_id || "");
        }
        return updated;
      });
      setWorkspacePendingDelete(null);
      sendRequest(() => getWorkspaces());
    }
  }, [deleteWorkspaceResponse, workspacePendingDelete, selectedWorkspaceId]);

  useEffect(() => {
    if (inviteResponse) {
      setInviteEmail("");
      setInviteRole("member");
    }
  }, [inviteResponse]);

  console.log(response, loading, error);



  function handleDeleteWorkspace(workspace_id) {
    if (!workspace_id) return;
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este workspace?"
    );
    if (!confirmed) return;
    setWorkspacePendingDelete(workspace_id);
    sendDelete(() => deleteWorkspaceService(workspace_id));
  }

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
              inviteToWorkspace(
                selectedWorkspaceId,
                inviteEmail.trim(),
                inviteRole
              )
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
        ) : Array.isArray(workspaces) && workspaces.length === 0 ? (
          <div className="empty-workspaces">
            <div className="empty-icon">🗂️</div>
            <h3 className="empty-title">No hay workspaces aún</h3>
            <p className="empty-subtitle">
              Creá tu primer workspace desde la barra lateral
            </p>
          </div>
        ) : (
          <div className="workspace-list">
            {workspaces.map((workspace) => {
              return (
                <div key={workspace.workspace_id} className="workspace-card">
                  <h2 className="workspace-name">{workspace.workspace_name}</h2>
                  <div className="workspace-actions">
                    <Link
                      to={"/workspace/" + workspace.workspace_id}
                      className="workspace-button"
                    >
                      Abrir workspace
                    </Link>
                    <button
                      className="workspace-delete-button"
                      type="button"
                      onClick={() =>
                        handleDeleteWorkspace(workspace.workspace_id)
                      }
                      disabled={
                        deletingWorkspace &&
                        workspacePendingDelete === workspace.workspace_id
                      }
                    >
                      {deletingWorkspace &&
                      workspacePendingDelete === workspace.workspace_id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </div>
                  {deleteWorkspaceError &&
                    workspacePendingDelete === workspace.workspace_id && (
                      <div className="workspace-error">
                        {deleteWorkspaceError}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeScreen;
