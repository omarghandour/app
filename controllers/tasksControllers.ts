import Task from "../models/TaskModel";

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
export { createTask, updateTask };
