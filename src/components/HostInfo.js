import React, { useState } from "react";
import {
  Radio,
  Icon,
  Card,
  Grid,
  Image,
  Dropdown,
  Divider,
} from "semantic-ui-react";
import "../stylesheets/HostInfo.css";
import client from "../services/FetchClient";
import { Log } from "../services/Log";

function HostInfo({ host, areas, onUpdateHost, onAddLog }) {
  // This state is just to show how the dropdown component works.
  // Options have to be formatted in this way (array of objects with keys of: key, text, value)
  // Value has to match the value in the object to render the right text.

  // IMPORTANT: But whether it should be stateful or not is entirely up to you. Change this component however you like.

  function handleOptionChange(e, { value }) {
    // the 'value' attribute is given via Semantic's Dropdown component.
    // Put a debugger or console.log in here and see what the "value" variable is when you pass in different options.
    // See the Semantic docs for more info: https://react.semantic-ui.com/modules/dropdown/#usage-controlled
    const newArea = areas.find((area) => area.name === value);
    // check if there's space in the area
    if (newArea.hosts.length < newArea.limit) {
      // if so, update the host
      client
        .patch(`/hosts/${host.id}`, {
          area: newArea.name,
        })
        .then((updatedHost) => {
          // use callback to set state in app
          onUpdateHost(updatedHost)
          // also log the change
          onAddLog(
            Log.notify(`${host.firstName} set in area ${newArea.formattedName}`)
          )
        })
    } else {
      onAddLog(
        Log.error(
          `Too many hosts. Cannot add ${host.firstName} to ${newArea.formattedName}`
        )
      )
    }
  }


  function handleRadioChange(e, { checked }) {
    client
      .patch(`/hosts/${host.id}`, {
        active: checked,
      })
      .then((updatedHost) => {
        // use callback to set state in app
        onUpdateHost(updatedHost);
        // also log the change
        if (checked) {
          onAddLog(Log.warn(`Activated ${host.firstName}`));
        } else {
          onAddLog(Log.notify(`Decommissioned ${host.firstName}`));
        }
      })
  }

  const { imageUrl, firstName, gender, active, area } = host;
  const options = areas.map((area) => ({
    key: area.name,
    text: area.formattedName,
    value: area.name,
  }))

  return (
    <Grid>
      <Grid.Column width={6}>
        <Image
          src={imageUrl}
          floated="left"
          size="small"
          className="hostImg"
        />
      </Grid.Column>
      <Grid.Column width={10}>
        <Card>
          <Card.Content>
            <Card.Header>
              {firstName} |{" "}
              {gender === "Male" ? <Icon name="man" /> : <Icon name="woman" />}
              {/* Think about how the above should work to conditionally render the right First Name and the right gender Icon */}
            </Card.Header>
            <Card.Meta>
              {/* Sometimes the label should take "Decommissioned". How are we going to conditionally render that? */}
              {/* Checked takes a boolean and determines what position the switch is in. Should it always be true? */}
              <Radio
                onChange={handleRadioChange}
                label={active ? "Active" : "Decommissioned"}
                checked={active}
                slider
              />
            </Card.Meta>
            <Divider />
            Current Area:
            <Dropdown
              onChange={handleOptionChange}
              value={area}
              options={options}
              selection
            />
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  );
}

export default HostInfo;
