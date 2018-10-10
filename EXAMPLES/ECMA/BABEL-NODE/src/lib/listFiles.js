import { readdir } from 'fs';

export async function listFilesInFolder() {
  return await new Promise((resolve, reject) => {
    readdir('./', (error, data) => {
      if (error) return reject(error);
      resolve(data);
    });
  });
}
