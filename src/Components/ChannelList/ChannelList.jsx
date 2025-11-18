import React from 'react'
import { Link, useParams } from 'react-router'
import "./ChannelList.css"

const ChannelList = ({channel_list}) => {
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
                    <Link 
                        key={chanId} 
                        to={`/workspace/${workspace_id}/${chanId}`}
                        className="channel-item-link"
                    >
                        <span className="channel-icon">#</span> 
                        <span className="channel-name">{channel.name}</span>
                    </Link>
                )
            }
        )
    }
</div>
  )
}

export default ChannelList