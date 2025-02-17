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

    /**
     * Create a new company record
     */
    const newCompanyRecord = await companies.createRecord({
        name: `New Company - ${new Date().toISOString()}`,
        description: "This is a new company",
        companyTypeId: companyRecord.data.company.companyTypeId
    });
    console.info("New Company Record", newCompanyRecord);

    /**
     * Update the new company record
     */
    const updatedCompanyRecord = await companies.updateRecord(
        newCompanyRecord.data.createCompany.id,
        {
            name: `Updated Company - ${new Date().toISOString()}`
        }
    );
    console.info("Updated Company Record", updatedCompanyRecord);

    /**
     * Archive the new company record
     */
    const archivedCompanyRecord = await companies.archiveRecord(
        newCompanyRecord.data.createCompany.id
    );
    console.info("Archived Company Record", archivedCompanyRecord);

    /**
     * Restore the archived company record
     */
    const restoredCompanyRecord = await companies.restoreRecord(
        archivedCompanyRecord.data.archiveCompany.id
    );
    console.info("Restored Company Record", restoredCompanyRecord);

    /**
     * Delete the new company record
     */
    const deletedCompanyRecord = await companies.deleteRecord(
        newCompanyRecord.data.createCompany.id
    );
    console.info("Deleted Company Record", deletedCompanyRecord);

    /**
     * Get the columns for the Company table
     */
    const companyTableColumns = await companies.getTableColumns();
    console.info("Company Table Columns", companyTableColumns);

    /**
     * Get a set of records for the Company table
     */
    const companyTableRecordSet = await companies.getTableRecordSet({
        take: 3,
        where: {
            isArchived: false,
            companyType: companyRecord.data.company.companyTypeId
        },
        orderBy: {
            column: "createdAt",
            value: "desc"
        }
    });
    console.info("Company Table Record Set", companyTableRecordSet);
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
