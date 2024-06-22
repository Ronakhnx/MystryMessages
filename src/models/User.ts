import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const Messageschema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: Boolean;
  isAcceptedMessage: Boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: [true, "VerifyCode is required"] },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "VerifyCode expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptedMessage: {
    type: Boolean,
    default: true,
  },
  message: [Messageschema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
export default UserModel;
