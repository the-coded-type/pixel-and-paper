import fs from 'fs';

export const readTextFile = (fileName) => {
  try {
    return fs.readFileSync(fileName, 'utf-8');
  }
  catch (err) {
    console.error(err);
    return null;
  }
}