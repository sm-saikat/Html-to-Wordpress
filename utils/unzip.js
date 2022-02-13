const StreamZip = require('node-stream-zip')
const fs = require('fs').promises


module.exports = async (req, res, next)=>{
    var zip = new StreamZip.async({
        file: `uploads/${req.file.originalname}`,
        storeEntries: true,
    })

    //const folderName = `${req.file.originalname}-${Date.now()}`
    const folderName = req.file.originalname
    const directory = `html-theme-uploads/${folderName}`
    await fs.mkdir(directory, { recursive: true })

    const count = await zip.extract(
      null,
      directory
    );
    console.log(`Extracted ${count} entries`);
    await zip.close();

    res.locals.folderName = folderName
    next()
}