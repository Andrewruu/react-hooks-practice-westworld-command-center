import React, {useState,useEffect} from "react";
import { Segment } from "semantic-ui-react";
import "../stylesheets/App.css";
import WestworldMap from "./WestworldMap";
import { formatAreaName } from "../services/formatname";
import Headquarters from "./Headquarters";

function App() {
  const [hosts, setHosts] = useState([])
  const [areas, setAreas] = useState([])
  const [selectedHostId, setSelectedHostId] = useState(null)

  useEffect(()=>{
    fetch('http://localhost:3001/hosts')
    .then(res=>res.json())
    .then(setHosts)

    fetch('http://localhost:3001/areas')
    .then(res=>res.json())
    .then(setAreas)
  },[])

  const formattedAreas = areas.map((area) => ({
    ...area,
    formattedName: formatAreaName(area.name),
    hosts: hosts.filter((host) => host.area === area.name),
  }))

  function handleSelectHost(host) {
    setSelectedHostId(host.id)
  }
  function handleUpdateHost(updatedHost) {
    const udpatedHosts = hosts.map((host) =>
      host.id === updatedHost.id ? updatedHost : host
    );
    setHosts(udpatedHosts);
  }

  function handleClickActivate(activate) {
    const updatedHosts = hosts.map((host) => ({
      ...host,
      active: activate,
    }));
    setHosts(updatedHosts);
  }
  const formattedHosts = hosts.map((host) => ({
    ...host,
    selected: host.id === selectedHostId,
  }))

  const selectedHost = hosts.find((host) => host.id === selectedHostId)
  const inactiveHosts = formattedHosts.filter((host) => !host.active)
  const allHostsActive = hosts.length === hosts.filter((host) => host.active).length

  
  return (
    <Segment id="app">
      <WestworldMap areas={formattedAreas} onHostClick={handleSelectHost}/>
      <Headquarters
        areas={formattedAreas}
        hosts={inactiveHosts}
        selectedHost={selectedHost}
        allHostsActive={allHostsActive}
        onHostClick={handleSelectHost}
        onUpdateHost={handleUpdateHost}
        onClickActivate={handleClickActivate}
      />
    </Segment>
  )
}

export default App;
