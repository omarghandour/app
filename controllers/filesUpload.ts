import multer from "multer";

import File from "../models/FileModel";
interface UploadFile {
  name: string;
  type: string;
  stream: () => ReadableStream;
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const filesUpload = async (body: any) => {
  const { image: file, task } = body;
  return new Promise((resolve, reject) => {
    try {
      const fileName = file.name;
      console.log("filetype", typeof file);

      // Handle the incoming body file
      const reader = file.stream().getReader();
      const chunks: Uint8Array[] = [];
      // Read from the web stream and gather chunks
      reader.read().then(function processText({ done, value }: any) {
        if (done) {
          const buffer = Buffer.concat(chunks);

          // Save file to MongoDB
          const newFile = new File({
            name: fileName,
            task,
            data: buffer,
            contentType: file.type,
          });
          newFile.save();
          // console.log(newFile);

          return newFile;
        }

        chunks.push(value);
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      reject(error);
    }
  });
};
const getFile = async (params: any) => {
  const fileName = params.filename;

  const file = await File.findOne({ task: fileName }).exec();
  const ss = file?.data?.toString("base64");
  return { data: ss, contentType: file?.contentType };
};
export { filesUpload, getFile };
