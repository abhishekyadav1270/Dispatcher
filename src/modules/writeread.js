
import fs from 'fs'


  // Create a directory
const createDir = (dirPath) => {
    fs.mkdirSync(process.cwd() + dirPath, {recursive: true },(error)=> {
        if (error) {
            console.error('error occurred:', error);
        } else {
            console.log('Directory is created');
        }
    });
}
    // Create a file

const createFile = (filepath, fileContent) => {
    fs.writeFile(filepath, fileContent, (error) => {
        if (error){
            console.error('error occurred:', error);
        } else {
            console.log('File is created');
        }
    });
}

 //Write to a file
let data = [];


const path = '/my-new-dir/my-extra-dir';
const content = 'content of file';

createDir(path);
createFile(path,content);
