import React, { useEffect, useState } from 'react'
import ChannelList from '../ChannelList/ChannelList.jsx'
import useFetch from '../../hook/useFetch.jsx'
import { useParams } from 'react-router'
import { getChannelList, createChannel, deleteChannel } from '../../services/channelService.js'
import "./ChannelSidebar.css"

const ChannelSidebar = () => {
    const {
        response, 
        loading, 
        error, 
        sendRequest
    } = useFetch()
    const { sendRequest: sendCreate, loading: creating, error: createError, response: createResponse } = useFetch()
    const { sendRequest: sendDeleteChannelRequest, loading: deletingChannel, error: deleteChannelError, response: deleteChannelResponse } = useFetch()
    const {workspace_id} = useParams()
    const [channelName, setChannelName] = useState("")
    const [channels, setChannels] = useState([])
    const [channelPendingDelete, setChannelPendingDelete] = useState(null)

    //Responsable de cargar la lista de canales
    function loadChannelList (){
        sendRequest(
            async () => {
                return await getChannelList( workspace_id )
            }
        )
    }

    //Apenas se cargue el componente debemos intentar obtener la lista de canales, tambien se debe re-ejecutar si cambia el workspace_id
    useEffect(
        () => {
            loadChannelList()
        },
        [workspace_id] //Cada vez que cambie workspace_id re ejecutar el efecto
    )

    useEffect(() => {
        if (response?.data?.channels) {
            setChannels(response.data.channels)
        }
    }, [response])

    // Cuando se crea un canal con éxito, limpiar input y recargar
    useEffect(() => {
        if (createResponse) {
            setChannelName("")
            loadChannelList()
        }
    }, [createResponse])

    useEffect(() => {
        if (deleteChannelResponse?.data?.channels) {
            setChannels(deleteChannelResponse.data.channels)
            setChannelPendingDelete(null)
        }
    }, [deleteChannelResponse])

    function handleDeleteChannel(channelId) {
        if (!channelId) return
        const confirmed = window.confirm('¿Querés eliminar este canal?')
        if (!confirmed) return
        setChannelPendingDelete(channelId)
        sendDeleteChannelRequest(() => deleteChannel(workspace_id, channelId))
    }

    console.log(response, error, loading)

    return (
        <aside className="channel-sidebar">
        <h3 className="sidebar-title">Canales:</h3>
        <form
            className="channel-actions"
            onSubmit={(e) => {
                e.preventDefault();
                if (!channelName.trim() || creating) return;
                sendCreate(() => createChannel(workspace_id, channelName.trim()))
            }}
        >
            <input
                type="text"
                className="create-channel-input"
                placeholder="Nombre del nuevo canal"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
            />
            <button
                type="submit"
                className="create-channel-button"
                disabled={creating}
            >
                {creating ? 'Creando...' : '+ Crear canal'}
            </button>
            {createError && <span className="error-message">{createError}</span>}
        </form>

        {
            loading && <span className="loading-message">Cargando...</span>
        }
        {
            response && (
                <ChannelList
                    channel_list={channels}
                    onDeleteChannel={handleDeleteChannel}
                    deletingChannelId={deletingChannel ? channelPendingDelete : null}
                />
            )
        }
        {
            error && <span className="error-message">Error al obtener la lista de canales</span>
        }
        {
            deleteChannelError && (
                <span className="error-message"> {deleteChannelError} </span>
            )
        }
    </aside>
    )
}

export default ChannelSidebar