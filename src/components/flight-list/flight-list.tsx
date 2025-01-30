import { useEffect, useState } from "react";
import { getFlights } from "@/services/api";
import { Loader, Paper, Image, Flex, Text, Button } from "@mantine/core";
import classes from "./flight-list.module.css";

interface FlightListProps {
  formData: {
    originSkyId: string;
    destinationSkyId: string;
    departureDate: string;
    returnDate?: string;
    passengerCount: string;
  };
}

export default function FlightList({ formData }: FlightListProps) {
  const [flights, setFlights] = useState<any[]>([]);
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartureFlight, setSelectedDepartureFlight] = useState<
    any | null
  >(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any | null>(
    null
  );
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const [isSubmitButtonActive, setIsSubmitButtonActive] = useState(false);
  const [showSelectedFlights, setShowSelectedFlights] = useState(false);

  useEffect(() => {
    setFlights([]);
    setReturnFlights([]);
    setSelectedDepartureFlight(null);
    setSelectedReturnFlight(null);
    setIsReturn(false);
    setIsNextButtonActive(false);
    setIsSubmitButtonActive(false);
    setShowSelectedFlights(false);
  }, [formData]);

  useEffect(() => {
    if (!formData) return;

    const fetchFlights = async () => {
      setLoading(true);
      try {
        const params = {
          originSkyId: formData.originSkyId.split(", ")[1],
          destinationSkyId: formData.destinationSkyId.split(", ")[1],
          originEntityId: formData.originSkyId.split(", ")[0],
          destinationEntityId: formData.destinationSkyId.split(", ")[0],
          date: formData.departureDate,
          adults: formData.passengerCount,
        };

        const response = await getFlights(params);
        setFlights(response.data.itineraries || []);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [formData]);

  const handleFlightClick = (flight: any, isReturn: boolean = false) => {
    if (isReturn) {
      setSelectedReturnFlight(flight);
      setIsSubmitButtonActive(true);
    } else {
      setSelectedDepartureFlight(flight);
      setIsNextButtonActive(true);
    }
  };

  const handleNextClick = async () => {
    setIsReturn(true);
    if (!formData.returnDate) return;

    const fetchReturnFlights = async () => {
      setLoading(true);
      try {
        const params = {
          originSkyId: formData.destinationSkyId.split(", ")[1],
          destinationSkyId: formData.originSkyId.split(", ")[1],
          originEntityId: formData.destinationSkyId.split(", ")[0],
          destinationEntityId: formData.originSkyId.split(", ")[0],
          date: formData.returnDate || "",
          adults: formData.passengerCount,
        };

        if (!params.date) {
          console.error("Return date is required");
          return;
        }

        const response = await getFlights(params);
        setReturnFlights(response.data.itineraries || []);
      } catch (error) {
        console.error("Error fetching return flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnFlights();
  };

  const handleSubmitClick = () => {
    setShowSelectedFlights(true);
  };

  if (loading)
    return (
      <Flex w="100%" h="100%" justify="center" align="center">
        <Loader />
      </Flex>
    );

  return (
    <Paper p="md">
      {!showSelectedFlights && (
        <Text fw={800} fz={26} c="blue" mb={20}>
          Flight Results
        </Text>
      )}
      <Flex
        w="100%"
        h="100%"
        direction="column"
        justify="center"
        align="center"
      >
        {!isReturn ? (
          <>
            {flights.length > 0 ? (
              flights.map((flight, index) => {
                const leg = flight.legs[0];
                const carrier = leg.carriers.marketing[0];
                const isSelected = selectedDepartureFlight === flight;

                return (
                  <Flex
                    key={index}
                    className={`${classes.card} ${
                      isSelected ? classes.selectedCard : ""
                    }`}
                    justify="space-between"
                    align="center"
                    w="100%"
                    h="100%"
                    onClick={() => handleFlightClick(flight)}
                  >
                    <div>
                      <Text fw={800} fz={20}>
                        {leg.origin.displayCode} → {leg.destination.displayCode}
                      </Text>
                      <Text>
                        Departure: {new Date(leg.departure).toLocaleString()}
                      </Text>
                      <Text>
                        Arrival: {new Date(leg.arrival).toLocaleString()}
                      </Text>
                      <Text>Duration: {leg.durationInMinutes} minutes</Text>
                      <Text>Stops: {leg.stopCount}</Text>
                      <Text>Price: {flight.price.formatted}</Text>
                      <Text>
                        Airline: {carrier.name} ({carrier.alternateId})
                      </Text>
                    </div>
                    <Image
                      src={carrier.logoUrl}
                      alt={carrier.name}
                      width={80}
                      height={80}
                    />
                  </Flex>
                );
              })
            ) : (
              <Flex w="100%" h="100%" justify="center" align="center">
                <div>No flights found</div>
              </Flex>
            )}

            <Button
              w="30%"
              disabled={!isNextButtonActive}
              onClick={handleNextClick}
            >
              Next →
            </Button>
          </>
        ) : (
          <>
            {!showSelectedFlights && returnFlights.length > 0 && (
              <>
                {returnFlights.map((flight, index) => {
                  const leg = flight.legs[0];
                  const carrier = leg.carriers.marketing[0];
                  const isSelected = selectedReturnFlight === flight;

                  return (
                    <Flex
                      key={index}
                      className={`${classes.card} ${
                        isSelected ? classes.selectedCard : ""
                      }`}
                      justify="space-between"
                      align="center"
                      w="100%"
                      h="100%"
                      onClick={() => handleFlightClick(flight, true)}
                    >
                      <div>
                        <Text fw={800} fz={20}>
                          {leg.origin.displayCode} →{" "}
                          {leg.destination.displayCode}
                        </Text>
                        <Text>
                          Departure: {new Date(leg.departure).toLocaleString()}
                        </Text>
                        <Text>
                          Arrival: {new Date(leg.arrival).toLocaleString()}
                        </Text>
                        <Text>Duration: {leg.durationInMinutes} minutes</Text>
                        <Text>Stops: {leg.stopCount}</Text>
                        <Text>Price: {flight.price.formatted}</Text>
                        <Text>
                          Airline: {carrier.name} ({carrier.alternateId})
                        </Text>
                      </div>
                      <Image
                        src={carrier.logoUrl}
                        alt={carrier.name}
                        width={80}
                        height={80}
                      />
                    </Flex>
                  );
                })}
                <Button
                  w="30%"
                  disabled={!isSubmitButtonActive}
                  onClick={handleSubmitClick}
                >
                  Submit
                </Button>
              </>
            )}
          </>
        )}

        {showSelectedFlights &&
          selectedDepartureFlight &&
          selectedReturnFlight && (
            <div>
              <Text fw={800} fz={26} c="blue" mb={20}>
                Selected Flights
              </Text>
              <Text fw={600}>Departure Flight:</Text>
              <Text>
                {selectedDepartureFlight.legs[0].origin.displayCode} →{" "}
                {selectedDepartureFlight.legs[0].destination.displayCode}
              </Text>
              <Text>
                {new Date(
                  selectedDepartureFlight.legs[0].departure
                ).toLocaleString()}
              </Text>
              <Text>{selectedDepartureFlight.price.formatted}</Text>

              <Text fw={600} mt={20}>
                Return Flight:
              </Text>
              <Text>
                {selectedReturnFlight.legs[0].origin.displayCode} →{" "}
                {selectedReturnFlight.legs[0].destination.displayCode}
              </Text>
              <Text>
                {new Date(
                  selectedReturnFlight.legs[0].departure
                ).toLocaleString()}
              </Text>
              <Text>{selectedReturnFlight.price.formatted}</Text>
            </div>
          )}
      </Flex>
    </Paper>
  );
}
