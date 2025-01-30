import { DocumentNode, print } from "graphql";
import gql from "graphql-tag";

/**
 * Appello GraphQL client
 */
export class AppelloGraphQL {
    /**
     * The base URL for the Appello API
     */
    private api_base_url = "";

    /**
     * The API key for the Appello API
     */
    private api_key = "";

    /**
     * The API secret for the Appello API
     */
    private api_secret = "";

    /**
     * The token for the current user
     */
    private token = "";

    constructor(options: Partial<AppelloGraphQLConstructorOptions>) {
        this.api_base_url = options.api_base_url ?? "";
        this.api_key = options.api_key ?? "";
        this.api_secret = options.api_secret ?? "";
    }

    /**
     * Get the application token
     *
     * @returns The application token
     */
    private async getApplicationToken(): Promise<string> {
        const response = await fetch(new URL(`/authenticate`, this.api_base_url), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key: this.api_key, secret: this.api_secret })
        });

        if (!response.ok) {
            throw new Error(`Failed to get application token: ${response.statusText}`);
        }

        const data: AppelloGraphQLApplicationTokenResponse = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.token ?? "";
    }

    /**
     * Make a GraphQL request
     *
     * @param options - The options for the request
     * @returns The response from the GraphQL request
     */
    private async graphQLRequest<T = unknown>(options: {
        query: DocumentNode | string;
        variables: Record<string, any>;
        headers?: Partial<{ token: string }>;
    }): Promise<GraphQLResponse<T>> {
        const response = await fetch(new URL(`/graphql`, this.api_base_url), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: options.headers?.token ?? this.token
            },
            body: JSON.stringify({
                query: typeof options.query === "string" ? options.query : print(options.query),
                variables: options.variables
            })
        });

        if (response.status >= 500) {
            throw new Error(`Server Error: ${response.statusText}`);
        }

        const data: GraphQLResponse<T> = await response.json();
        return data;
    }

    /**
     * Set the user application token
     *
     * @param username - The username of the user
     * @param password - The password of the user
     *
     * @returns The updated AppelloGraphQL instance
     */
    public async authenticateUser(username: string, password: string): Promise<this> {
        // Get the application token
        const applicationToken = await this.getApplicationToken();

        // Get the user token
        const tokenRequest = await this.graphQLRequest<{ authenticateUser: string }>({
            query: gql`
                query AuthenticateUser($username: String!, $password: String!) {
                    authenticateUser(username: $username, password: $password)
                }
            `,
            variables: { username, password },
            headers: { token: applicationToken }
        });

        if (tokenRequest.errors) {
            throw new Error(tokenRequest.errors[0].message);
        }

        // Store the token for future requests
        this.token = tokenRequest.data.authenticateUser;

        return this;
    }

    /**
     * Renew the user application token
     *
     * @returns The updated AppelloGraphQL instance
     */
    public async renewToken(): Promise<this> {
        const response = await fetch(new URL(`/renew`, this.api_base_url), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: this.token
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to renew application token: ${response.statusText}`);
        }

        const data: AppelloGraphQLApplicationTokenResponse = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        this.token = data.token;

        return this;
    }

    /**
     * Make a GraphQL query
     *
     * @param query - The query to make
     * @param variables - The variables to pass to the query
     * @returns The response from the GraphQL query
     */
    public async query<T = unknown>(
        query: DocumentNode | string,
        variables: Record<string, any> = {}
    ): Promise<GraphQLResponse<T>> {
        const response = await this.graphQLRequest<T>({
            query,
            variables
        });

        return response;
    }
}
