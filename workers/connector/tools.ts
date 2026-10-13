import { enquiryTools } from "./enquiry-tools";
import { prospectTools } from "./prospect-tools";
import type { ConnectorTool } from "./toolkit";

export * from "./toolkit";

/**
 * Everything Claude can do through the connector.
 * Left out on purpose: deleting, bulk import, and anything that sends a message.
 */
export const connectorTools: ConnectorTool[] = [...prospectTools, ...enquiryTools];
