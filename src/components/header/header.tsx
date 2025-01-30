import {
  ActionIcon,
  Container,
  useComputedColorScheme,
  useMantineColorScheme,
  Image,
  Flex,
  Text,
} from "@mantine/core";
import classes from "./header.module.css";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Flex align="center" gap={16}>
          <Image w={48} h={48} src="/logo.png" />
          <Text fz={24} fw={800}>
            Flights
          </Text>
        </Flex>
        <ActionIcon
          onClick={() =>
            setColorScheme(computedColorScheme === "light" ? "dark" : "light")
          }
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          {computedColorScheme === "dark" ? <IconSun /> : <IconMoon />}
        </ActionIcon>
      </Container>
    </header>
  );
}
