import React from "react";
import { Flex, Text } from "@mantine/core";
import { FlightResultProps } from "./flight-result.props";

function FlightResult({
  selectedDepartureFlight,
  selectedReturnFlight,
}: FlightResultProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <Flex direction="column" w="100%" h="100%" align="center">
      <Text fw={800} fz={26} c="blue" mb={20}>
        Selected Flights
      </Text>
      <Text fw={600}>Departure Flight:</Text>
      <Text>
        {selectedDepartureFlight?.legs[0].origin.displayCode} →{" "}
        {selectedDepartureFlight?.legs[0].destination.displayCode}
      </Text>
      <Text>{formatDate(selectedDepartureFlight?.legs[0].departure)}</Text>
      <Text>{selectedDepartureFlight?.price.formatted}</Text>

      <Text fw={600} mt={20}>
        Return Flight:
      </Text>
      <Text>
        {selectedReturnFlight?.legs[0].origin.displayCode} →{" "}
        {selectedReturnFlight?.legs[0].destination.displayCode}
      </Text>
      <Text>{formatDate(selectedReturnFlight?.legs[0].departure)}</Text>
      <Text>{selectedReturnFlight?.price.formatted}</Text>
    </Flex>
  );
}

export default FlightResult;
