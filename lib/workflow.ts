import { Client as WorkflowClient } from '@upstash/workflow'
import config from './config'
import { Client as QStashClient, resend } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.UPSTASH.qstashUrl,
    token: config.env.UPSTASH.qstashToken,
})

const qstashClient = new QStashClient({ token: config.env.UPSTASH.qstashToken });

export const sendEmail = async ({ 
    email, 
    subject, 
    message 
}: { 
    email: string; 
    subject: string; 
    message: string; 
}) => {
    await qstashClient.publishJSON({
        api: {
            name: "email",
            provider: resend({ token: config.env.resendToken }),
        },
        body: {
            from: "Coinchain <contact@coinchain.tech>",
            to: email,
            subject,
            html:message,
        },
    });
}
