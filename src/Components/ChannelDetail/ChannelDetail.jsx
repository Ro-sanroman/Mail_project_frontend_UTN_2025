import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useFetch from '../../hook/useFetch.jsx'
import { getMessagesByChannelId } from '../../services/messagesService.js'

const ChannelDetail = () => {
    const {channel_id, workspace_id} = useParams
    if(!channel_id){
        return (
            <div>
                <span>Canal no seleccionado</span>
            </div>
        )
    }

    const {response, error, loading, sendRequest} = useFetch()

    async function loadMessagesList (channel_id){
        getMessagesByChannelId(workspace_id, channel_id)
    }

    useEffect(
        async () => {
            return await getMessagesByChannelId(workspace_id, channel_id)
        },
        [
            channel_id
        ]
    )
    console.log(response, error, loading)
    return (
        <div>
            
        </div>
    )
}

export default ChannelDetail