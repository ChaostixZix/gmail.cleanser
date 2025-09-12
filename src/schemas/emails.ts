import { z } from "zod"

export const requestSchema = z.object({
  responseURL: z.string()
})

export const requestHeadersSchema = z.object({
  "alt-svc": z.string(),
  "cache-control": z.string(),
  "content-encoding": z.string(),
  "content-type": z.string(),
  date: z.string(),
  server: z.string(),
  "transfer-encoding": z.string(),
  vary: z.string(),
  "x-content-type-options": z.string(),
  "x-frame-options": z.string(),
  "x-xss-protection": z.string()
})

export const bodySchema = z.object({
  size: z.number(),
  data: z.string().optional()
})

export const headerSchema = z.object({
  name: z.string(),
  value: z.string()
})

export const retryConfigSchema = z.object({
  currentRetryAttempt: z.number(),
  retry: z.number(),
  httpMethodsToRetry: z.array(z.string()),
  noResponseRetries: z.number(),
  retryDelayMultiplier: z.number(),
  timeOfFirstRequest: z.number(),
  totalTimeout: z.number(),
  maxRetryDelay: z.number(),
  statusCodesToRetry: z.array(z.array(z.number()))
})

export const paramsSchema = z.object({
  oauth_token: z.string()
})

export const headersSchema = z.object({
  "x-goog-api-client": z.string(),
  "Accept-Encoding": z.string(),
  "User-Agent": z.string()
})

export const userAgentDirectiveSchema = z.object({
  product: z.string(),
  version: z.string(),
  comment: z.string()
})

export const messageSchema = z.object({
  id: z.string(),
  threadId: z.string()
})

export const partSchema = z.object({
  partId: z.string(),
  mimeType: z.string(),
  filename: z.string(),
  headers: z.array(headerSchema),
  body: bodySchema
})

export const configSchema = z.object({
  url: z.string(),
  method: z.string(),
  apiVersion: z.string(),
  userAgentDirectives: z.array(userAgentDirectiveSchema),
  headers: headersSchema,
  params: paramsSchema,
  retry: z.boolean(),
  responseType: z.string(),
  retryConfig: retryConfigSchema.optional()
})

export const metaSchema = z.object({
  messages: z.array(messageSchema),
  nextPageToken: z.string(),
  resultSizeEstimate: z.number()
})

export const payloadSchema = z.object({
  partId: z.string(),
  mimeType: z.string(),
  filename: z.string(),
  headers: z.array(headerSchema),
  body: bodySchema,
  parts: z.array(partSchema)
})

export const dataSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  labelIds: z.array(z.string()),
  snippet: z.string(),
  payload: payloadSchema,
  sizeEstimate: z.number(),
  historyId: z.string(),
  internalDate: z.string()
})

export const datumSchema = z.object({
  config: configSchema,
  data: dataSchema,
  headers: requestHeadersSchema,
  status: z.number(),
  statusText: z.string(),
  request: requestSchema
})

export const emailResponseSchema = z.object({
  meta: metaSchema,
  data: z.array(datumSchema)
})

export type EmailResponse = z.infer<typeof emailResponseSchema>
export type EmailMessageData = z.infer<typeof datumSchema>
