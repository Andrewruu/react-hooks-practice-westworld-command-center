import React from "react";
import "../stylesheets/Area.css";
import HostList from "./HostList";

function Area({area, onHostClick}) {

  console.log(area.formattedName)

  const actHosts = area.hosts.filter((host)=>host.active)

  return (
    <div
      className="area"
      id={
        area.name
      }
    >
      <h3 className="labels">
      {area.formattedName} | Limit: {area.limit}
      </h3>
      <HostList hosts={actHosts} onHostClick={onHostClick}/>
    </div>
  );
}

Area.propTypes = {
  hosts: function (props) {
    if (props.hosts.length > props.limit) {
      throw Error(
        `HEY!! You got too many hosts in ${props.name}. The limit for that area is ${props.limit}. You gotta fix that!`
      );
    }
  },
};

export default Area;
