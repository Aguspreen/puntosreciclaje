const Joi = require('joi');

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).required(),
  correo: Joi.string().email().required(),
  contraseña: Joi.string().min(6).required(),
});

const puntoSchema = Joi.object({
  nombre: Joi.string().required(),
  direccion: Joi.string().allow('').optional(),
  latitud: Joi.number().required(),
  longitud: Joi.number().required(),
  tipo_residuo: Joi.string().required(),
  estado: Joi.string().valid('activo','inactivo').default('activo'),
});

module.exports = { registerSchema, puntoSchema };
