import { Calendar, Check, Link } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { CenterColumn, CenterRow, Container, Flex, Text } from "./Core";
import { Button } from "./Core/Button/Button";
import type { Booking } from "./types";
import { format } from "date-fns";
import { formatToTimeZone } from "./utils";

const Icon = styled(Check)`
  color: #4caf50;
  font-size: 48px;
  background-color: #333;
  border-radius: 50%;
  padding: 12px;
  width: 60px;
  height: 60px;
`;

const Title = styled.h2`
  margin-top: 12px;
  font-size: 22px;
  font-weight: 600;
  color: #e0e0e0;
`;

const Details = styled(Flex)``;

const DetailItem = styled(Text)`
  margin: 8px 0;
  display: flex;
  //   align-items: center;
  gap: 6px;
  color: #bdbdbd;
  span {
    font-weight: 600;
    color: #ffffff;
  }
`;

const LinkButton = styled.a`
  color: #1e88e5;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
    color: #64b5f6;
  }
`;

type Props = {
  booking: Booking | null;
};
export const MeetingScheduled = ({ booking }: Props) => {
  return (
    <Container
      flexDirection="column"
      bg="background"
      borderRadius={8}
      padding={24}
      gap={16}
      width={["100%", "100%", "70%", "60%", "50%", "40%"]}
      maxWidth={500}
    >
      <CenterRow width="100%" justifyContent="center">
        <Icon size="50px" />
      </CenterRow>
      <Title>Meeting Scheduled</Title>
      <Text textAlign="center" fontSize={16}>
        A calendar invitation with the details has been sent to all
        participants.
      </Text>
      <CenterColumn
        width="100%"
        p={10}
        pl={[10, 10, 10, "10%"]}
        borderRadius={8}
        gap={32}
      >
        <Flex
          gap={"8px"}
          width="100%"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Text variant="body1">What:</Text>
          <Text width="70%" fontWeight="normal" variant="light" color="#85B6CE">
            {booking?.title}
          </Text>
        </Flex>
        <Flex
          gap={"8px"}
          width="100%"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Text variant="body1">When:</Text>
          <Text width="70%" fontWeight="normal" variant="light" color="#85B6CE">
            {booking?.startTime && formatToTimeZone(booking?.startTime)}
          </Text>
        </Flex>
        <Flex
          gap={"8px"}
          width="100%"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Text variant="body1">Who:</Text>
          <CenterColumn width="70%">
            {booking?.attendees?.map((attendee, index) => (
              <CenterColumn key={index}>
                <Text truncate width="100%" fontWeight="normal" variant="light">
                  {attendee?.name} ({attendee.host ? "Host" : "Guest"})
                </Text>
                <Text truncate variant="light" color="#85B6CE">
                  {attendee?.email}
                </Text>
              </CenterColumn>
            ))}
          </CenterColumn>
        </Flex>

        <Flex
          gap={"8px"}
          width="100%"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Text variant="body1">Where:</Text>
          <Text width="70%" fontWeight="normal" variant="light" color="#85B6CE">
            <a target="_blank" href={booking?.location}>
              <Button
                bg="none"
                p={1}
                border="none"
                display="flex"
                alignItems="center"
                gap={8}
                _hover={{
                  backgroundColor: "#333",
                }}
              >
                Link <Link size={18} />
              </Button>
            </a>
          </Text>
        </Flex>
        {/* Responses */}
      </CenterColumn>

      <CenterColumn
        borderTop={"1px solid"}
        borderColor="border"
        p={"16px"}
        gap={8}
      >
        <Text textAlign="center">Need change?</Text>
        <CenterRow gap={8} flexWrap="wrap">
          <Button>Reschedule</Button>
          <Button>Cancel</Button>
          <Button>
            {/* <CenterRow gap={6}>
              <Calendar /> <Text>Add to Calendar</Text>
            </CenterRow> */}
          </Button>
        </CenterRow>
      </CenterColumn>
    </Container>
  );
};
