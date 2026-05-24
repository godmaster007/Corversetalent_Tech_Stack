import { google } from "googleapis";
import { getGoogleAuthClient } from "./auth";
import stream from "stream";

/**
 * Upload a file to Google Drive.
 */
export async function uploadFileToDrive({
  fileName,
  mimeType,
  fileBuffer,
  folderId, // Optional parent folder
}: {
  fileName: string;
  mimeType: string;
  fileBuffer: Buffer;
  folderId?: string;
}) {
  const auth = await getGoogleAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  const requestBody: any = {
    name: fileName,
  };

  if (folderId) {
    requestBody.parents = [folderId];
  }

  const media = {
    mimeType,
    body: bufferStream,
  };

  const res = await drive.files.create({
    requestBody,
    media,
    fields: "id, webViewLink, webContentLink",
  });

  return res.data;
}

/**
 * Create a folder in Google Drive (useful for organizing candidates).
 */
export async function createDriveFolder(folderName: string, parentFolderId?: string) {
  const auth = await getGoogleAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const requestBody: any = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentFolderId) {
    requestBody.parents = [parentFolderId];
  }

  const res = await drive.files.create({
    requestBody,
    fields: "id",
  });

  return res.data;
}
