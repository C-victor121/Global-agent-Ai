import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']
  },
  password: {
    type: String,
    required: false, // No requerido para autenticación con Google
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Permite que sea único pero opcional
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
  versionKey: false
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;