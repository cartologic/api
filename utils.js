module.exports = {
    blobToFile: (blob) => {
        const fileInfo = blob.split(',')[0].split(';');
        const fileName = fileInfo[1].split('=')[1];
        const fileNoExtention = fileName.split('.')[0]
        const fileExtention = fileName.split('.')[1]
        timestamp = new Date().getTime();
        const randomName = (fileNoExtention + timestamp) + '.' + fileExtention;
        require('fs').writeFile(`./uploaded/${randomName}`, blob.split(',')[1], 'base64', function (err) {
            console.error(err);
        });
        return randomName;
    }
}