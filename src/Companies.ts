import gql from "graphql-tag";
import { AppelloGraphQL } from "./AppelloGraphQL";

export class Companies {
    private appelloGraphQL: AppelloGraphQL;

    constructor(appelloGraphQL: AppelloGraphQL) {
        this.appelloGraphQL = appelloGraphQL;
    }

    /**
     *
     * @param options
     * @returns
     */
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

    /**
     * Get a single company record
     * @param id
     * @returns
     */
    public async getRecord(id: string) {
        return this.appelloGraphQL.query<{
            company: {
                id: string;
                name: string;
                description: string;
                companyType: string;
                companyTypeId: string;
                isArchived: boolean;
            };
        }>(
            gql`
                query GetCompany($id: ID!) {
                    company(id: $id) {
                        id
                        name
                        description
                        companyType
                        companyTypeId
                        isArchived
                    }
                }
            `,
            { id }
        );
    }

    /**
     * Create a new company record
     * @param data
     * @returns
     */
    public async createRecord(data: { name: string; description: string; companyTypeId: string }) {
        return this.appelloGraphQL.query<{
            createCompany: {
                id: string;
                name: string;
                description: string;
                companyType: string;
                companyTypeId: string;
                isArchived: boolean;
            };
        }>(
            gql`
                mutation CreateCompany($data: CreateCompany!) {
                    createCompany(data: $data) {
                        id
                        name
                        description
                        companyType
                        companyTypeId
                        isArchived
                    }
                }
            `,
            { data }
        );
    }

    /**
     * Update a company record
     * @param id
     * @param data
     * @returns
     */
    public async updateRecord(
        id: string,
        data: Partial<{
            name: string;
            description: string;
            companyTypeId: string;
        }>
    ) {
        return this.appelloGraphQL.query<{
            updateCompany: {
                id: string;
                name: string;
                description: string;
                companyType: string;
                companyTypeId: string;
                isArchived: boolean;
            };
        }>(
            gql`
                mutation UpdateCompany($id: String!, $data: EditCompany!) {
                    editCompany(id: $id, data: $data) {
                        id
                        name
                        description
                        companyType
                        companyTypeId
                        isArchived
                    }
                }
            `,
            { id, data }
        );
    }

    /**
     * Delete a company record
     * @param id
     * @returns
     */
    public async deleteRecord(id: string) {
        return this.appelloGraphQL.query(
            gql`
                mutation DeleteCompany($id: String!) {
                    deleteCompany(id: $id)
                }
            `,
            { id }
        );
    }

    /**
     * Archive a company record
     * @param id
     * @returns
     */
    public async archiveRecord(id: string) {
        return this.appelloGraphQL.query<{
            archiveCompany: {
                id: string;
                name: string;
                isArchived: boolean;
            };
        }>(
            gql`
                mutation ArchiveCompany($id: ID!) {
                    archiveCompany(id: $id) {
                        id
                        name
                        isArchived
                    }
                }
            `,
            { id }
        );
    }

    /**
     * Restore a company record
     * @param id
     * @returns
     */
    public async restoreRecord(id: string) {
        return this.appelloGraphQL.query<{
            restoreCompany: {
                id: string;
                name: string;
                isArchived: boolean;
            };
        }>(
            gql`
                mutation RestoreCompany($id: ID!) {
                    restoreCompany(id: $id) {
                        id
                        name
                        isArchived
                    }
                }
            `,
            { id }
        );
    }

    /**
     * Get the columns for the Company table
     * @returns
     */
    public async getTableColumns() {
        return this.appelloGraphQL.query<{
            tableData: {
                columns: Array<{
                    id: string;
                    label: string;
                    type: string;
                    isUnique: boolean;
                    listValues: Array<{
                        value: string;
                        label: string;
                    }>;
                    isForeignKey: boolean;
                    referenceModel: string;
                    referenceColumn: string;
                }>;
            };
        }>(
            gql`
                query GetCompanyTableDataColumns($modelName: TableDataName!) {
                    tableData(modelName: $modelName) {
                        columns
                    }
                }
            `,
            {
                modelName: "Company"
            }
        );
    }

    /**
     * Get a set of records for the Company table
     * @param options
     * @returns
     */
    public async getTableRecordSet(
        options: Partial<{
            take: number;
            skip: number;
            searchTerm: string;
            orderBy: { column: string; value: "asc" | "desc" };
            where: Record<string, any>;
        }> = {}
    ) {
        return this.appelloGraphQL.query<{
            tableData: {
                recordCount: number;
                recordSet: Array<{
                    id: string;
                    name: string;
                    accountPayableContact: string | null;
                    accountReceivableContact: string | null;
                    description: string | null;
                    address: {
                        id: string;
                        name: string;
                        address1: string;
                        address2: string;
                        city: string;
                        state: string;
                        zipCode: string;
                        lat: string;
                        lon: string;
                    };
                    phoneHQ: string | null;
                    faxHQ: string | null;
                    websiteUrl: string | null;
                    linkedInUrl: string | null;
                    primaryContact: string | null;
                    createdAt: string;
                    updatedAt: string;
                    isDeleted: boolean;
                    companyType: {
                        id: string;
                        label: string;
                        slug: string;
                        color: string;
                        workflowState: string;
                    };
                    industry: {
                        id: string;
                        label: string;
                        slug: string;
                        color: string;
                        workflowState: string;
                    };
                    isArchived: boolean;
                    phoneHQExtension: string | null;
                }>;
            };
        }>(
            gql`
                query GetCompanyTableDataRecordSet(
                    $modelName: TableDataName!
                    $tableDataOptions: TableDataRecordSetOptions
                ) {
                    tableData(modelName: $modelName, options: $tableDataOptions) {
                        recordCount
                        recordSet
                    }
                }
            `,
            {
                modelName: "Company",
                tableDataOptions: {
                    searchTerm: options.searchTerm ?? "",
                    orderBy: options.orderBy ?? {
                        column: "name",
                        value: "asc"
                    },
                    skip: options.skip ?? 0,
                    take: options.take ?? 10,
                    where: options.where ?? {}
                }
            }
        );
    }
}
