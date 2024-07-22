import User from "../models/UserModel";
type body = {
  name: string;
  username: string;
  role: ["admin", "user", "manager"];
  email: string;
  password: string;
};
const salt: any = 10;

const createUser = async (body: any, set: any, jwt: any, auth: any) => {
  // const token = jwt.sign({ id: "user._id" }, "hi", {
  //   expiresIn: "1h",
  // });
  // auth.set({
  //   value: "token",
  //   httpOnly: true,
  //   maxAge: 15 * 24 * 60 * 60,
  //   secure: true,
  //   sameSite: "none",
  //   path: "/",
  // });
  console.log(auth);
  // const { name, username, role, email, password }: any = body;

  // console.log(name, username, role, email, password);

  // const Password = Bun.hash(salt, password);
  try {
    //   console.log(Password);
    //   const userer = await User.findOne({ username });
    //   if (userer) {
    //     set.status = 400;
    //     return "Username already exists";
    //   }
    //   const user = await User.create({
    //     name,
    //     username,
    //     role,
    //     email,
    //     password: Password,
    //   });
    //   user.save();
    //   const token = jwt.sign({ id: user._id }, "hi", {
    //     expiresIn: "1h",
    //   });
    //   auth.set({
    //     value: await token,
    //     httpOnly: true,
    //     maxAge: 15 * 24 * 60 * 60,
    //     secure: true,
    //     sameSite: "none",
    //     path: "/",
    //   });
    //   set.status = 201;
    // return user;
  } catch (error: any) {
    set.status = 400;
    return error.message;
  }
};
const loginUser = async (body: body, set: any, jwt: any, auth: any) => {};
export { createUser, loginUser };
