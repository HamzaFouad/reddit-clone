import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import theme from "../theme";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";

// TODO: Find more elegent way to updateQuery as statically typed
function staticallyTypedUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (result: Result, query: Query) => Query
) {
  return cache.updateQuery(
    queryInput,
    (data) => fn(result, data as any) as any
  );
}
const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            staticallyTypedUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            staticallyTypedUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },

          register: (_result, args, cache, info) => {
            staticallyTypedUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
