import { gql } from "graphql-tag";
import { AppelloGraphQL } from "./AppelloGraphQL";
import { env } from "./env";
import { Companies } from "./Companies";

/**
 * Main function
 */
async function main() {
    console.info("Create AppelloGraphQL instance");
    /**
     * Create an AppelloGraphQL instance with the API base URL,
     * API key, and API secret. Then authenticate the user with
     * the API username and password.
     */
    const appelloGraphQL = await new AppelloGraphQL({
        api_base_url: env.API_BASE_URL,
        api_key: env.API_KEY,
        api_secret: env.API_SECRET
    }).authenticateUser(env.API_USERNAME, env.API_PASSWORD);

    /**
     * Make a GraphQL query
     */
    console.info("Make a GraphQL query");
    const response = await appelloGraphQL.query<{ me: { id: string; fullName: string } }>(gql`
        {
            me {
                id
                emailAddress
                fullName
            }
        }
    `);
    console.info("GraphQL Response", response);

    /**
     * Get a list of companies
     */
    const companies = new Companies(appelloGraphQL);
    const companiesList = await companies.getList();
    console.info("Companies List", companiesList);

    /**
     * Get a single company record
     */
    const companyId = companiesList.data.companies.data[0].id;
    const companyRecord = await companies.getRecord(companyId);
    console.info("Company Record", companyRecord);
}

/**
 * Run the main function
 */
main()
    .catch(console.error)
    .finally(() => {
        console.info("Done");
        process.exit(0);
    });
