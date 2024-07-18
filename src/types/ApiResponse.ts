import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccetingMessages?: boolean;
  messages?: Array<Message>;
}
