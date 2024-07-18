import { dbCoonect } from "@/helpers/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmail } from "@/utils/sendVerifyEmail";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }
    const existingUserVerifiedEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserVerifiedEmail) {
      if (existingUserVerifiedEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Username is already exist with this email",
          },
          { status: 500 }
        );
      } else {
        const hashesPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedEmail.password = hashesPassword;
        existingUserVerifiedEmail.verifyCode = verifyCode;
        existingUserVerifiedEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiedEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptedMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verification mail
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      { success: true, message: "Register successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
