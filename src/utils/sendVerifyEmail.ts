import { resend } from "@/helpers/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { url } from "inspector";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello World",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verificatioh email send successfully" };
  } catch (emailError) {
    console.log("Error sending verify email", emailError);
    return { success: false, message: "Failed to send email" };
  }
}
