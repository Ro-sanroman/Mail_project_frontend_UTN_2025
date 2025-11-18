import React, { useEffect } from 'react'
import useFetch from '../../hook/useFetch.jsx'
import { getWorkspaces } from '../../services/workspaceService.js'
import { Link } from 'react-router'
import "./HomeScreen.css"


const HomeScreen = () => {

  const { sendRequest, response, loading, error } = useFetch()

  useEffect(
    ()=> {
      sendRequest(
        () => getWorkspaces()
      )
    },
    []
  )

  console.log(response, loading, error)
  return (
   <div className="screen-container">
    <h1 className="header-title">Lista de espacios de trabajo</h1>
    {
    loading
    ? <span className="loading-message">Cargando...</span>
    : <div className="workspace-list">
        {
        response
        &&
        response.data.workspaces.map(
            (workspace) => {
                return (
                    <div key={workspace.workspace_id} className="workspace-card">
                        <h2 className="workspace-name">{workspace.workspace_name}</h2>
                        <Link to={'/workspace/' + workspace.workspace_id} className="workspace-button">Abrir workspace</Link>
                    </div>
                )
            }
        )
        }
    </div>
    }
</div>
  )
}

export default HomeScreen;