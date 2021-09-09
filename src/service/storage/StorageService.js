const fs = require('fs');

class StorageService {
    constructor(folder) {
        this._folder = folder;
        this.checkDir(folder);
    }

    checkDir(folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        return folder;
    }

    writeFile(file, meta, additional_path = '') {
        const filename = +new Date() + meta.filename;
        const path =
            this.checkDir(this._folder + additional_path) + `/${filename}`;

        const fileStream = fs.createWriteStream(path);

        return new Promise((resolve, reject) => {
            console.log('masuk');
            fileStream.on('error', (error) => reject(error));
            file.pipe(fileStream);
            file.on('end', () => resolve(filename));
        });
    }
}

module.exports = StorageService;
