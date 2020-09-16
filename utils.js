module.exports = {
    blobToFile: (blob) => {
        const fileInfo = blob.split(',')[0].split(';');
        require('fs').writeFile(`./uploaded/${fileInfo[1].split('=')[1]}`, blob.split(',')[1], 'base64', function (err) {
            console.error(err);
        });
        return fileInfo[1].split('=')[1];
    }
}