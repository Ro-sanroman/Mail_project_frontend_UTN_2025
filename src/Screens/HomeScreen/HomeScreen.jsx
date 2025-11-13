import React, { useEffect } from 'react'
import useFetch from '../../hook/useFetch.jsx'
import { getWorkspaces } from '../../services/workspaceService.js'
import { Link } from 'react-router'


const HomeScreen = () => {

  const { sendRequest, response, loading, error } = useFetch()

  useEffect(
    ()=> {
      console.log('[HomeScreen] Mounted, fetching workspaces...')
      sendRequest(
        () => getWorkspaces()
      )
    },
    []
  )

  console.log('[HomeScreen] Response:', response, 'Loading:', loading, 'Error:', error)
  
  // Extraer workspaces de diferentes estructuras posibles
  let workspaces = []
  if (response?.workspaces) {
    workspaces = response.workspaces
  } else if (response?.data?.workspaces) {
    workspaces = response.data.workspaces
  } else if (response?.body?.workspaces) {
    workspaces = response.body.workspaces
  } else if (Array.isArray(response)) {
    workspaces = response
  }
  
  console.log('[HomeScreen] Extracted workspaces:', workspaces)
  
  return (
    <div>
      <h1>Lista de espacios de trabajo</h1>
      {
        loading
        ? <span>Cargando...</span>
        : error
        ? <div style={{color: 'red'}}>Error: {error}</div>
        : <div>
          {
          workspaces && workspaces.length > 0
          ? workspaces.map(
              (workspace) => {
                return (
                  <div key={workspace.workspace_id || workspace._id}>
                    <h2>{workspace.workspace_name}</h2>
                    <Link to={'/workspace/' + (workspace.workspace_id || workspace._id)}>Abrir workspace</Link>
                  </div>
                )
              }
            )
          : <p>No hay workspaces disponibles. Crea uno para empezar.</p>
          }
        </div>
      }
    </div>
  )
}

export default HomeScreen;