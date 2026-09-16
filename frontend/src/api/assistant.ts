import { apiClient } from "@/api/client";
import type { AssistantChatRequest, AssistantChatResponse } from "@/types/assistant";

export function chatAssistant(
  payload: AssistantChatRequest,
): Promise<AssistantChatResponse> {
  return apiClient.assistantChat(payload);
}
