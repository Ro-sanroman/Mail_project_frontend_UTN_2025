import React from "react";
import ChannelSidebar from "../../Components/ChannelSidebar/ChannelSidebar.jsx";
import ChannelDetail from "../../Components/ChannelDetail/ChannelDetail.jsx";
import "./WorkspaceScreen.css";

const WorkspaceScreen = () => {
  return (
    <div className="workspace-screen">
      <ChannelSidebar />
      <ChannelDetail />
    </div>
  );
};

export default WorkspaceScreen;
