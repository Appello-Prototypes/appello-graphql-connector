/**
 * Options for the AppelloGraphQL constructor
 */
interface AppelloGraphQLConstructorOptions {
    api_base_url: string;
    api_key: string;
    api_secret: string;
}

/**
 * The response from the Appello GraphQL API when requesting an application token
 */
type AppelloGraphQLApplicationTokenResponse =
    | {
          token?: never;
          error: { name: string; message: string };
      }
    | {
          token: string;
          error?: never;
      };

/**
 * The response from the Appello GraphQL API
 */
type GraphQLResponse<T> = { data: T; errors?: Array<{ message: string }> };
