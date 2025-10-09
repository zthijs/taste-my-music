import { AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME, AZURE_OPENAI_ENDPOINT } from '$env/static/private';
import { AzureOpenAI } from "openai";

export const client = new AzureOpenAI({
    deployment: AZURE_OPENAI_DEPLOYMENT_NAME,
    apiVersion: "2025-04-01-preview",
    apiKey: AZURE_OPENAI_API_KEY,
    endpoint: AZURE_OPENAI_ENDPOINT
});