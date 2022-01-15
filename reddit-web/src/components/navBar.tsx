import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  if (fetching) {
    // data is loading -- body is null
  } else if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="#FFFFFF" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="#FFFFFF">Register</Link>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex>
        <Box color="#FFFFFF" mr={2}>
          {data.me.username}
        </Box>
        <Button variant="link">Logout</Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
