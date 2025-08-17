// La configuración de NextAuth ha sido centralizada en la raíz en auth.ts para evitar duplicidades.
// Este archivo solo reexporta desde la configuración unificada.
export { auth as default, authOptions } from '../../../../../auth';
