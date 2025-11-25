import React from 'react'
import { Link, useParams } from 'react-router'
import "./ChannelList.css"

const ChannelList = ({channel_list = [], onDeleteChannel, deletingChannelId}) => {
    const {workspace_id} = useParams()
  return ( 
    <div className="channel-list-container">
    {
        channel_list.length === 0
        ? <span className="no-channels-status-message">Aun no has creado ningun canal</span>
        : channel_list.map(
            (channel) => {
                const chanId = channel._id || channel.id;
                return (
                    <div key={chanId} className="channel-item">
                        <Link 
                            to={`/workspace/${workspace_id}/${chanId}`}
                            className="channel-item-link"
                        >
                            <span className="channel-icon">#</span> 
                            <span className="channel-name">{channel.name}</span>
                        </Link>
                        {onDeleteChannel && (
                            <button
                                type="button"
                                className="channel-delete-button"
                                onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    onDeleteChannel(chanId)
                                }}
                                disabled={deletingChannelId === chanId}
                            >
                                {deletingChannelId === chanId ? '...' : 'Eliminar'}
                            </button>
                        )}
                    </div>
                )
            }
        )
    }
</div>
  )
}

export default ChannelList