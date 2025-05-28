// src/app/usuarios/gestion/page.tsx
'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { UserService } from '@/services/api';
import { User, UserFormData } from '@/types'; // Importar UserFormData
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Componente Modal reutilizable
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  title: string;
  children: React.ReactNode;
  submitButtonText?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, children, submitButtonText = 'Guardar' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <form onSubmit={onSubmit}>
          {children}
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm font-medium"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function GestionUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Usar UserFormData para el estado del formulario
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await UserService.getUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.');
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const openModalForCreate = () => {
    setEditingUser(null);
    // Asegurarse de que todos los campos de UserFormData estén aquí
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (user: User) => {
    setEditingUser(user);
    // Al editar, no pre-rellenar la contraseña. Se deja en blanco para no cambiarla o se introduce una nueva.
    setFormData({ _id: user._id, name: user.name, email: user.email, role: user.role, password: '' }); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setError(null); // Limpiar errores al cerrar el modal
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Editando usuario
        const dataToUpdate: UserFormData = { ...formData };
        // Solo enviar la contraseña si se ha introducido una nueva y no está vacía
        if (!formData.password || formData.password.trim() === '') {
          delete dataToUpdate.password;
        }
        const updatedUser = await UserService.updateUser(editingUser._id!, dataToUpdate);
        if (updatedUser) {
          setUsers(users.map(u => u._id === editingUser._id ? updatedUser : u));
          closeModal();
        }
      } else {
        // Creando usuario
        if (!formData.password || formData.password.trim() === '') {
          setError('La contraseña es obligatoria para crear un usuario.');
          return;
        }
        const newUser = await UserService.createUser(formData as User); // Asegurar que el tipo es User para createUser
        if (newUser) {
          setUsers([...users, newUser]);
          closeModal();
        }
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error al procesar la solicitud. Inténtalo de nuevo.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const success = await UserService.deleteUser(userId);
        if (success) {
          setUsers(users.filter(user => user._id !== userId));
          setError(null);
        } else {
          setError('No se pudo eliminar el usuario.');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Error al eliminar el usuario. Inténtalo de nuevo más tarde.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando usuarios...</div>;
  }

  // No mostrar error general de carga si el modal tiene su propio error
  if (error && !isModalOpen) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <button 
          onClick={openModalForCreate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Crear Usuario
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmit={handleSubmit} 
        title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        submitButtonText={editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
      >
        {error && isModalOpen && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={formData.name || ''} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              required 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email || ''} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña {editingUser ? '(Dejar en blanco para no cambiar)' : ''}
            </label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              value={formData.password || ''} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
              required={!editingUser} // Requerido solo al crear
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Rol</label>
            <select 
              name="role" 
              id="role" 
              value={formData.role || 'user'} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>
      </Modal>

      {users.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-400">No se encontraron usuarios.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-700">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user._id}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-600 text-green-100' : 'bg-yellow-500 text-yellow-100'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => openModalForEdit(user)}
                      className="text-indigo-400 hover:text-indigo-600 mr-3"
                      aria-label="Editar usuario"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user._id!)}
                      className="text-red-400 hover:text-red-600"
                      aria-label="Eliminar usuario"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}