import User from "../models/UserModel";
type body = {
  name: string;
  username: string;
  role: ["admin", "user", "manager"];
  email: string;
  password: string;
};

const createUser = async (body: any, set: any, jwt: any, auth: any) => {
  // const salt: any = process.env.SALT;

  const { name, username, role, email, password }: any = body;

  // const algo: any = process.env.ALGORITHM;
  const hash = await Bun.password.hash(password);

  try {
    const userer = await User.findOne({ username });
    if (userer) {
      set.status = 400;
      console.log(userer);

      return "Username or email already exists";
    }
    const user = await User.create({
      name,
      username,
      role,
      email,
      password: hash,
    });
    user.save();
    const token = jwt.sign({ id: user._id });

    // auth.set({
    //   value: await token,
    //   httpOnly: true,
    //   maxAge: 15 * 24 * 60 * 60,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/dashboard",
    // });
    set.status = 201;
    return { user: user, token: auth };
  } catch (error: any) {
    set.status = 400;
    return error.message;
  }
}; // no roles register
const loginUser = async (
  body: body,
  set: any,
  jwt: any,
  auth: any,
  userr: any
) => {
  const { username, password }: any = body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      set.status = 401;
      return "Invalid username or password";
    }
    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      set.status = 401;
      return "Invalid username or password";
    }
    const token = jwt.sign({ id: user._id });
    if (user.role !== "user") {
      auth.set({
        value: await token,
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60,
        secure: true,
        sameSite: "none",
        partitioned: true,
        CrossSite: true,
        // Partitioned: true,
        path: "/",
      });
    } else {
      userr.set({
        value: await token,
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60,
        secure: true,
        sameSite: "none",
        CrossSite: true,
        partitioned: true,
        // Partitioned: true,
        path: "/",
      });
    }

    set.status = 200;
    return { user };
  } catch (error: any) {
    set.status = 400;
    console.log(error.message);

    return error.message;
  }
}; // no roles login
const signUP = async (body: body, set: any, jwt: any, auth: any) => {
  const { name, username, role, email, password }: any = body;

  const hash = await Bun.password.hash(password);

  try {
    const userer = await User.findOne({ username });
    if (userer) {
      set.status = 400;
      console.log(userer);

      return "Username or email already exists";
    }
    const user = await User.create({
      name,
      username,
      role: "user",
      email,
      password: hash,
    });
    user.save();
    const token = jwt.sign({ id: user._id });
    auth.set({
      value: await token,
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    set.status = 201;
  } catch (err: any) {
    set.status = 400;
    console.log(err.message);
    return err.message;
  }
}; // normal user signup
export { createUser, loginUser, signUP };
