import Task from "../models/TaskModel";
import User from "../models/UserModel";

// tasks

const createTask = async (body: any, set: any, params: any, jwt: any) => {
  const { title, description, deadlineDate, assignedTo } = body;
  // console.log(deadlineDate);

  const { id } = params;
  const deauth = await jwt.verify(assignedTo);
  const assignedToName = await User.findById(id);
  const creatorName = await User.findById(deauth.id);
  try {
    const task = new Task({
      title,
      description: description,
      deadlineDate,
      assignedTo: id,
      creator: deauth.id,
      creatorName: creatorName?.username,
      assignedToName: assignedToName?.username,
    });
    await task.save();
    set.status = 201;
    return "task";
  } catch (error: any) {
    set.status = 500;
    console.error(error.message);
    return { message: "Failed to create task" };
  }
};
const getAllTasks = async (set: any) => {
  try {
    const tasks = await Task.find();
    set.status = 200;
    return tasks;
  } catch (error: any) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to get all tasks", error: error.message };
  }
};
const updateTask = async (body: any, set: any, params: any) => {
  const { title, description, attachment, deadlineDate, assignedTo } = body;
  const { id } = params;
  try {
    const comments = await Task.findOne({});
    const task = await Task.findByIdAndUpdate(id, {
      title,
      description,
      attachment,
      deadlineDate,
      assignedTo,
    });
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 200;
    return { task };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to update task" };
  }
};

const deleteTask = async (set: any, params: any) => {
  const { userID, taskID } = params;
  try {
    const user = await User.findById(userID);
    if (!user || user.role === "user") {
      set.status = 400;
      return { message: "User not found or it's not admin" };
    }
    console.log(taskID);

    const task = await Task.findById(taskID);
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    await task.deleteOne();
    set.status = 200;
    return { message: "Task deleted successfully" };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to delete task" };
  }
};
const usersTask = async (params: any, set: any, jwt: any) => {
  const { id, role } = params;
  try {
    const user = await jwt.verify(id);
    // const tasks = await Task.find({ assignedTo: user.id });
    if (role === "admin") {
      const tasks = await Task.find({ assignedTo: user.id })
        .sort({ updatedAt: "desc" })
        .exec();
      const tasksT = await Task.find({ creator: user.id })
        .sort({ updatedAt: "desc" })
        .exec();
      set.status = 200;
      return { tasks: tasks, tasksT: tasksT };
    }

    if (role === "user") {
      const tasks = await Task.find({ assignedTo: user.id, status: "pending" })
        .sort({ updatedAt: "desc" })
        .exec();
      set.status = 200;
      return { tasks: tasks, tasksT: undefined };
    }
    if (role === "manager") {
      const tasks = await Task.find().sort({ updatedAt: "desc" }).exec();
      set.status = 200;
      return { tasks: tasks, tasksT: undefined };
    }
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to get tasks for user" };
  }
};
const taskById = async (params: any, set: any, jwt: any) => {
  const { id } = params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 200;
    return { task };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to get task by ID" };
  }
};
const setTaskStatus = async (params: any, set: any, jwt: any) => {
  const taskID = params.id;
  console.log(taskID);
  try {
    const task = await Task.findByIdAndUpdate(taskID, { status: "completed" });
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 200;
    return { task };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to update task status" };
  }
};
const taskReject = async (params: any, set: any, jwt: any) => {
  const taskID = params.id;
  console.log(taskID);
  try {
    const task = await Task.findByIdAndUpdate(taskID, { status: "pending" });
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 200;
    return { task };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to reject task" };
  }
};
const Approved = async (params: any, set: any, jwt: any) => {
  const taskID = params.id;

  try {
    const task = await Task.findByIdAndDelete(taskID);
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 200;
    return { message: "Task deleted successfully" };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to reject task" };
  }
};
//
//comments
//
const addComment = async (body: any, set: any, params: any, jwt: any) => {
  const { content } = body;
  const { taskID, userID } = params;
  const verify = await jwt.verify(userID);
  const UID = await verify.id;
  console.log(UID);

  try {
    const user = await User.findOne({ _id: UID });
    const uName = user?.username;
    const task = await Task.findById(taskID);

    if (task) {
      task.comments.push({ content, UID, uName });
      await task.save();
    }
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 201;
    return { task };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to add comment" };
  }
};
const getComments = async (set: any, params: any) => {
  const { taskID } = params;
  try {
    const task = await Task.findById(taskID);
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    set.status = 200;
    return { comments: task.comments };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to get comments" };
  }
};
const deleteComment = async (params: any, set: any) => {
  const { CID } = params;
  try {
    const comment: any = await Task.updateOne(
      { "comments._id": CID },
      { $pull: { comments: { _id: CID } } }
    );
    if (comment.nModified === 0) {
      set.status = 404;
      return { message: "Comment not found" };
    }
    set.status = 200;
    return { message: "Comment deleted successfully" };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to delete comment" };
  }
};
const readTask = async (set: any, params: any) => {
  const { id } = params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      set.status = 404;
      return { message: "Task not found" };
    }
    task.read = true;
    task.save();
    set.status = 200;
    return { task };
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to read tasks" };
  }
};
export {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  usersTask,
  setTaskStatus,
  Approved,
  taskReject,
  taskById,
  addComment,
  getComments,
  deleteComment,
  readTask,
};
