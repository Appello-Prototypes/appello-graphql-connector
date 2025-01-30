const env: { API_BASE_URL; API_KEY; API_SECRET; API_USERNAME; API_PASSWORD } = {
    API_BASE_URL: String(process.env.API_BASE_URL ?? ""),
    API_KEY: String(process.env.API_KEY ?? ""),
    API_SECRET: String(process.env.API_SECRET ?? ""),
    API_USERNAME: String(process.env.API_USERNAME ?? ""),
    API_PASSWORD: String(process.env.API_PASSWORD ?? "")
};

export { env };
