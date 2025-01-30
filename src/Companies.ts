import gql from "graphql-tag";
import { AppelloGraphQL } from "./AppelloGraphQL";

export class Companies {
    private appelloGraphQL: AppelloGraphQL;

    constructor(appelloGraphQL: AppelloGraphQL) {
        this.appelloGraphQL = appelloGraphQL;
    }

    public async getList(options: { take?: number; skip?: number } = {}) {
        return this.appelloGraphQL.query<{ companies: { data: { id: string; name: string }[] } }>(
            gql`
                query GetCompanies($take: Int, $skip: Int) {
                    companies(options: { take: $take, skip: $skip }) {
                        data {
                            ... on Company {
                                id
                                name
                            }
                        }
                    }
                }
            `,
            {
                take: options.take ?? 10,
                skip: options.skip ?? 0
            }
        );
    }

    public async getRecord(id: string) {
        return this.appelloGraphQL.query<{
            company: { id: string; name: string; description: string };
        }>(
            gql`
                query GetCompany($id: ID!) {
                    company(id: $id) {
                        id
                        name
                        description
                    }
                }
            `,
            { id }
        );
    }
}
