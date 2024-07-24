import Task from "../models/TaskModel";
import User from "../models/UserModel";

// tasks

const createTask = async (body: any, set: any, params: any) => {
  const { title, description, attachment, deadlineDate, assignedTo } = body;
  console.log(deadlineDate);

  const { id } = params;
  try {
    const task = new Task({
      title,
      description: description,
      attachment,
      deadlineDate,
      assignedTo,
      creator: id,
    });
    await task.save();
    set.status = 201;
    return task;
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { message: "Failed to create task" };
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

//
//comments
//
const addComment = async (body: any, set: any, params: any) => {
  const { CName, content } = body;
  const { taskID, userID } = params;
  try {
    const task = await Task.findByIdAndUpdate(taskID, {
      $push: { comments: { CName, content, userID } },
    });
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
export { createTask, updateTask, deleteTask, addComment, deleteComment };
