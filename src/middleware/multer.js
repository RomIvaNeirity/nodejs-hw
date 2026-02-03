import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { filesize: 2 * 1024 * 1024 },
  filefilter: (req, file, cb) => {
    if (!file.minetype || !file.minetype.startsWith('image/')) {
      return cb(new Error('Only image allowed'));
    }
    cb(null, true);
  },
});
