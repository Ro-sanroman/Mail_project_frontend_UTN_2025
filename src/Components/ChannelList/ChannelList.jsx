import React from 'react'
import { Link, useParams } from 'react-router'

const ChannelList = ({channel_list}) => {
    const {workspace_id} = useParams()
  return ( 
    <div style={{display: 'flex', flexDirection: 'column'}}>
        {
            channel_list.length === 0 
            ? <span>Aun no has creado ningun canal</span>
            : channel_list.map(
                (channel) => {
                    return (
                        <Link key={channel._id} to={`/workspace/${workspace_id}/${channel._id}`}>
                            {channel.name}
                        </Link>
                    )
                }
            )
        }
    </div>
  )
}

export default ChannelList