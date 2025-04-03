import fs from 'fs';
import path from 'path';

const readMarkdownFileSync = (filePath: string): string => {
    try {
        return fs.readFileSync(path.resolve(filePath), 'utf8');
    } catch (err) {
        console.error('Error reading file:', err);
        return '';
    }
};

// 使用示例
const content = readMarkdownFileSync('path/to/your/file.md');
console.log(content);