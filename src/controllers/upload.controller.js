const cloudinary =
    require('../config/cloudinary');

const uploadImage = async (
    req,
    res
) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: 'No hay imagen'
            });
        }

        const result =
            await cloudinary.uploader.upload(
                req.file.path,
                {
                    folder: 'restaurant'
                }
            );

        res.json({
            imageUrl: result.secure_url
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                'Error al subir imagen'
        });
    }
};

module.exports = {
    uploadImage
};