const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// Configuración mejorada para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'], // Formatos permitidos
    format: async (req, file) => {
      // Mantener el formato original del archivo
      if (file.mimetype.includes('jpeg')) return 'jpg';
      if (file.mimetype.includes('png')) return 'png';
      return 'jpg'; // formato por defecto
    },
    public_id: (req, file) => {
      const fileName = file.originalname.replace(/\.[^/.]+$/, ""); // Elimina la extensión
      return `${Date.now()}-${fileName}`;
    },
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' } // Limita el tamaño máximo
    ]
  }
});

// Validación de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Formato no soportado. Use JPG o PNG'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});

module.exports = upload;