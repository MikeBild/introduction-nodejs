import { listFilesInFolder } from './lib/listFiles';

async function main() {
  try {
    const fileList = await listFilesInFolder();
    console.log(fileList);
  } catch (error) {
    console.error(error);
  }
}

main();
