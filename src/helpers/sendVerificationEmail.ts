import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Send the verification email using the Resend service
    await resend.emails.send({
      from: "YourName <yourname@feedback360.xyz>", // Ensure this is a valid and authorized sender address
      to: [email],
      subject: "Mystery Message || Verification code",
      react: VerificationEmail({ username, otp: verifyCode }), // Rendering the React component for the email body
    });

    // Return success response
    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (err:any) {
    // Enhanced error logging for easier debugging
    console.error("Error sending verification email:", err.message, err.stack);

    // Return failure response with detailed error message
    return {
      success: false,
      message: `Failed to send verification email: ${err.message}`,
    };
  }
}
