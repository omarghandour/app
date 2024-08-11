import multer from "multer";

import File from "../models/FileModel";
interface UploadFile {
  name: string;
  type: string;
  stream: () => ReadableStream;
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const filesUpload = async (body: any, params: any, set: any) => {
  const { file } = body;
  const task = params.id;
  return new Promise((resolve, reject) => {
    try {
      // Log the file type
      console.log("filetype", typeof file);

      // Handle the incoming body file
      const reader = file.stream().getReader();
      const chunks: Uint8Array[] = [];

      // Read from the web stream and gather chunks
      reader
        .read()
        .then(function processText({ done, value }: any) {
          if (done) {
            const buffer = Buffer.concat(chunks);

            // Save file to MongoDB
            const newFile = new File({
              name: file.name,
              task,
              data: buffer,
              contentType: file.type,
            });

            newFile
              .save()
              .then((savedFile) => {
                // console.log(savedFile);
                set.status = 201;
                resolve(savedFile); // Resolve with the saved file
              })
              .catch((error) => {
                console.error("Error saving file to MongoDB:", error);
                reject(error); // Reject if saving to MongoDB fails
              });
          } else {
            chunks.push(value);
            reader.read().then(processText);
          }
        })
        .catch((error: any) => {
          console.error("Error reading file stream:", error);
          reject(error); // Reject if reading from the stream fails
        });
    } catch (error) {
      console.error("Error uploading file:", error);
      reject(error); // Reject if any other error occurs
    }
  });
};
const getFile = async (params: any) => {
  const fileName = params.filename;

  const file = await File.findOne({ task: fileName }).exec();
  const ss = file?.data?.toString("base64");
  return { data: ss, contentType: file?.contentType };
};
const deleteFile = async (params: any, set: any) => {
  const fileName = params.id;

  const deletedFile = await File.findOneAndDelete({ task: fileName }).exec();
  if (deletedFile) {
    set.status = 204;
  } else {
    set.status = 404;
  }
  return deletedFile; // Return the deleted file (if any) or a 404 status if not found.
};
export { filesUpload, getFile, deleteFile };
