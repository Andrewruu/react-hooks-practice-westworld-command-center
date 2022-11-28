import React from "react";
import { Segment } from "semantic-ui-react";
import Area from "./Area";

function WestworldMap({areas,onHostClick}) {
  const displayAreas = areas.map((area)=>(<Area key={area.id} area={area} onHostClick={onHostClick}/>))

  return <Segment id="map">{displayAreas}</Segment>;
}

export default WestworldMap;
