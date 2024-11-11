const sharpLib = require("sharp");
const fs = require("fs");
const path = require("path");

const compress = (req, res, next) => { // Redimensionnement de l'image
	if (req.file) {
		const newFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
		const newImagePath = path.join("images", newFilename);
		sharpLib(req.file.path)
            .resize({ width: 206, height: 260 })
			.webp({ quality: 80 })
			.toFile(newImagePath, (err) => {
				if (err) {
					console.error(err);
					return res.status(500).json({
						error: "Erreur de téléchargement",
					});
				}
				fs.unlink(req.file.path, (err) => { // Le fichier webp doit remplacer le fichier original téléchargé
					if (err) {
						console.error(
							"Erreur lors de la compression."
						);
					} else {
						console.log("Compression réussie !");
					}
				});
				req.file.filename = newFilename;
				next();
			});
	} else {
		next();
	}
};
module.exports = compress;