import React, { useEffect, useState } from "react";
import useFetch from "../../hook/useFetch.jsx";
import {
  getWorkspaces,
  createWorkspace,
} from "../../services/workspaceService.js";
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
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    sendRequest(() => getWorkspaces());
  }, []);

  useEffect(() => {
    if (createResponse) {
      setWorkspaceName("");
      sendRequest(() => getWorkspaces());
    }
  }, [createResponse]);

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
      </aside>

      <main className="home-content">
        <h1 className="header-title">Espacios de trabajo</h1>
        {loading ? (
          <span className="loading-message">Cargando...</span>
        ) : (
          <div className="workspace-list">
            {response &&
              response.data.workspaces.map((workspace) => {
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
        )}
      </main>
    </div>
  );
};

export default HomeScreen;
