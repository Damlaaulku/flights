import { useEffect, useState } from "react";
import { getFlights } from "@/services/api";
import { Loader, Paper, Image, Flex, Text, Button } from "@mantine/core";
import classes from "./flight-list.module.css";
import { Carrier, Flight } from "@/types/flight-list";
import { FlightCardProps, FlightListProps } from "./flight-list.props";
import FlightResult from "../flight-result/flight-result";

const FlightCard = ({ flight, isSelected, onSelect }: FlightCardProps) => {
  const leg = flight.legs[0];
  const carrier: Carrier = leg.carriers.marketing[0];

  return (
    <Flex
      className={`${classes.card} ${isSelected ? classes.selectedCard : ""}`}
      justify="space-between"
      align="center"
      w="100%"
      h="100%"
      onClick={onSelect}
    >
      <div>
        <Text fw={800} fz={20}>
          {leg.origin.displayCode} → {leg.destination.displayCode}
        </Text>
        <Text>Departure: {new Date(leg.departure).toLocaleString()}</Text>
        <Text>Arrival: {new Date(leg.arrival).toLocaleString()}</Text>
        <Text>Duration: {leg.durationInMinutes} minutes</Text>
        <Text>Stops: {leg.stopCount}</Text>
        <Text>Price: {flight.price.formatted}</Text>
        <Text>
          Airline: {carrier.name} ({carrier.alternateId})
        </Text>
      </div>
      <Image src={carrier.logoUrl} alt={carrier.name} width={80} height={80} />
    </Flex>
  );
};

export default function FlightList({ formData }: FlightListProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartureFlight, setSelectedDepartureFlight] =
    useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] =
    useState<Flight | null>(null);
  const [isReturn, setIsReturn] = useState(false);
  const [showSelectedFlights, setShowSelectedFlights] = useState(false);

  useEffect(() => {
    setFlights([]);
    setReturnFlights([]);
    setSelectedDepartureFlight(null);
    setSelectedReturnFlight(null);
    setIsReturn(false);
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

  const handleFlightClick = (flight: Flight, isReturn: boolean = false) => {
    if (isReturn) {
      setSelectedReturnFlight(flight);
    } else {
      setSelectedDepartureFlight(flight);
    }
  };

  const handleNextClick = async () => {
    setIsReturn(true);
    if (!formData.returnDate) return;

    setLoading(true);
    try {
      const params = {
        originSkyId: formData.destinationSkyId.split(", ")[1],
        destinationSkyId: formData.originSkyId.split(", ")[1],
        originEntityId: formData.destinationSkyId.split(", ")[0],
        destinationEntityId: formData.originSkyId.split(", ")[0],
        date: formData.returnDate,
        adults: formData.passengerCount,
      };
      const response = await getFlights(params);
      setReturnFlights(response.data.itineraries || []);
    } catch (error) {
      console.error("Error fetching return flights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSelectedFlights ? (
        <FlightResult
          selectedDepartureFlight={selectedDepartureFlight}
          selectedReturnFlight={selectedDepartureFlight}
        />
      ) : (
        <Paper p="md">
          <Text fw={800} fz={26} c="blue" mb={20}>
            Flight Results
          </Text>
          {loading ? (
            <Flex w="100%" h="100%" justify="center" align="center">
              <Loader />
            </Flex>
          ) : (
            <>
              {!isReturn
                ? flights.map((flight, index) => (
                    <FlightCard
                      key={index}
                      flight={flight}
                      isSelected={selectedDepartureFlight === flight}
                      onSelect={() => handleFlightClick(flight)}
                    />
                  ))
                : returnFlights.map((flight, index) => (
                    <FlightCard
                      key={index}
                      flight={flight}
                      isSelected={selectedReturnFlight === flight}
                      onSelect={() => handleFlightClick(flight, true)}
                    />
                  ))}

              {!isReturn ? (
                <Button
                  w="30%"
                  disabled={!selectedDepartureFlight}
                  onClick={handleNextClick}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  w="30%"
                  disabled={!selectedReturnFlight}
                  onClick={() => setShowSelectedFlights(true)}
                >
                  Submit
                </Button>
              )}
            </>
          )}
        </Paper>
      )}
    </>
  );
}
