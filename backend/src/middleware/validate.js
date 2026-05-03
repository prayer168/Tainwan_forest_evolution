import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function buildValidator(schema) {
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      return res.status(422).json({
        message: '請求資料格式錯誤',
        errors: validate.errors
      });
    }
    next();
  };
}
