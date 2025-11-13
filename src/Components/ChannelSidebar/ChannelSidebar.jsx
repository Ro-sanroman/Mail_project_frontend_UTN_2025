import React, { useEffect } from 'react'
import ChannelList from '../ChannelList/ChannelList.jsx'
import useFetch from '../../hook/useFetch.jsx'
import { useParams } from 'react-router'
import { getChannelList } from '../../services/channelService.js'

const ChannelSidebar = () => {
    const {
        response, 
        loading, 
        error, 
        sendRequest
    } = useFetch()
    const {workspace_id} = useParams()

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

    console.log(response, error, loading)

    return (
        <aside>
            <h3>Canales:</h3>
            {
                loading && <span>Cargando...</span>
            }
            {
                response && <ChannelList channel_list={response.data.channels}/>
            }
            {
                error && <span style={{color: 'red'}}>Error al obtener la lista de canales</span>
            }
        </aside>
    )
}

export default ChannelSidebar