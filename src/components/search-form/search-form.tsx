import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Select,
  Flex,
  Grid,
  Box,
  Paper,
  Title,
  Image,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { getAirports } from "@/services/api";
import { useDebouncedValue } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconCalendar } from "@tabler/icons-react";
import FlightList from "../flight-list/flight-list";
import classes from "./search-form.module.css";
import { AirportOption, FormValues } from "@/types/search-form";

export default function SearchForm() {
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [fromQuery, setFromQuery] = useState<string>("");
  const [toQuery, setToQuery] = useState<string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [fromAirports, setFromAirports] = useState<AirportOption[]>([]);
  const [toAirports, setToAirports] = useState<AirportOption[]>([]);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [passengerCount, setPassengerCount] = useState<string | null>("1");
  const [debouncedFromQuery] = useDebouncedValue(fromQuery, 500);
  const [debouncedToQuery] = useDebouncedValue(toQuery, 500);

  const form = useForm<FormValues>({
    initialValues: {
      originSkyId: "",
      destinationSkyId: "",
      departureDate: "",
      returnDate: "",
      passengerCount: "1",
    },
  });

  const fetchAirports = useCallback(
    async (query: string, setAirports: (airports: AirportOption[]) => void) => {
      if (!query) {
        setAirports([]);
        return;
      }
      try {
        const data = await getAirports({ query });
        if (data?.data) {
          const airportOptions: AirportOption[] = data.data.map(
            (airport: any) => ({
              value: `${airport.entityId}, ${airport.skyId}`,
              label: `${airport.skyId} (${airport.presentation.title})`,
            })
          );
          setAirports(airportOptions);
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchAirports(debouncedFromQuery, setFromAirports);
  }, [debouncedFromQuery, fetchAirports]);

  useEffect(() => {
    fetchAirports(debouncedToQuery, setToAirports);
  }, [debouncedToQuery, fetchAirports]);

  useEffect(() => {
    if (departureDate) {
      const newReturnDate = new Date(departureDate);
      newReturnDate.setDate(newReturnDate.getDate() + 1);
      setReturnDate(newReturnDate);
    }
  }, [departureDate]);

  const handleSearch = () => {
    if (!selectedFrom || !selectedTo || !departureDate) {
      alert("Please fill in all required fields.");
      return;
    }

    form.setValues({
      originSkyId: selectedFrom,
      destinationSkyId: selectedTo,
      departureDate: departureDate.toLocaleDateString("en-CA"),
      returnDate: returnDate?.toLocaleDateString("en-CA"),
      passengerCount: passengerCount || "1",
    });

    setIsClicked(true);
  };

  return (
    <Grid gutter="xs" grow mt={18}>
      <Grid.Col span={4}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Let's Travel!
          </Title>
          <Flex direction="column" gap={16}>
            <Select
              allowDeselect={false}
              label="From"
              placeholder="Search departure airport"
              data={fromAirports}
              searchable
              onSearchChange={setFromQuery}
              value={selectedFrom}
              onChange={setSelectedFrom}
            />
            <Select
              allowDeselect={false}
              label="To"
              placeholder="Search destination airport"
              data={toAirports}
              searchable
              onSearchChange={setToQuery}
              value={selectedTo}
              onChange={setSelectedTo}
            />
            <DatePickerInput
              allowDeselect={false}
              rightSection={<IconCalendar size={18} stroke={1.5} />}
              label="Departure date"
              placeholder="Pick date"
              value={departureDate}
              onChange={setDepartureDate}
              minDate={new Date()}
            />
            <DatePickerInput
              allowDeselect={false}
              rightSection={<IconCalendar size={18} stroke={1.5} />}
              label="Return date"
              placeholder="Pick date"
              value={returnDate}
              onChange={setReturnDate}
              minDate={departureDate || new Date()}
            />
            <Select
              allowDeselect={false}
              label="Number of passengers"
              placeholder="Adults"
              data={["1", "2", "3", "4", "5"]}
              value={passengerCount}
              onChange={setPassengerCount}
            />
            <Button onClick={handleSearch}>Search Flights</Button>
          </Flex>
        </Paper>
      </Grid.Col>
      <Grid.Col span={8} className={classes["right-content"]}>
        {isClicked ? (
          <FlightList formData={form.values} />
        ) : (
          <Flex w="100%" h="100%" justify="center" align="center">
            <Box w={600}>
              <Image src="/travel.png" />
            </Box>
          </Flex>
        )}
      </Grid.Col>
    </Grid>
  );
}
