import { dbCoonect } from "@/helpers/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbCoonect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    //is user aaccepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting the meesages" },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.message.push(newMessage as Message);
    await user.save();
    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error while sending messages" },
      { status: 500 }
    );
  }
}
