'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Interfaz para los items del carrito
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // Agrega aquí más propiedades si son necesarias, como la descripción del plan
  description?: string;
}

// Datos de ejemplo para el carrito (reemplazar con datos reales o desde el estado global)
const initialCartItems: CartItem[] = [
  {
    id: 'plan-basico-1',
    name: 'Plan Básico',
    price: 29.99,
    quantity: 1,
    image: '/placeholder-plan.jpg', // Reemplazar con la imagen real del plan
    description: 'Acceso a funciones esenciales de IA durante un mes.',
  },
  {
    id: 'plan-premium-2',
    name: 'Plan Premium',
    price: 59.99,
    quantity: 1,
    image: '/placeholder-plan.jpg', // Reemplazar con la imagen real del plan
    description: 'Todas las funciones del plan básico más soporte prioritario y análisis avanzado.',
  },
];

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Debes iniciar sesión para continuar');
      return;
    }

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: cartItems[0].id, // Por ahora manejamos un solo plan
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.preferenceId) {
        // Redirigir a la página de pago de MercadoPago
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.preferenceId}`;
      } else {
        throw new Error(data.message || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error al crear la preferencia de pago:', error);
      toast.error('Error al procesar el pago. Por favor, intenta de nuevo.');
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return; // No permitir cantidad menor a 1
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Producto eliminado del carrito');
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Aquí puedes agregar impuestos, descuentos, etc.
  const total = subtotal; // Por ahora, el total es igual al subtotal

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="mt-6 text-center text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Tu Carrito está Vacío
          </h2>
          <p className="mt-2 text-center text-lg text-gray-400">
            Parece que no has añadido ningún plan a tu carrito todavía.
          </p>
          <div>
            <Link
              href="/planes"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150 ease-in-out mt-6"
            >
              Explorar Planes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Tu Carrito de Compras
        </h1>

        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
          <ul role="list" className="divide-y divide-gray-700">
            {cartItems.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 hover:bg-gray-700/50 transition-colors duration-150">
                <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden border border-gray-600">
                  <Image
                    src={item.image}
                    alt={`Imagen de ${item.name}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-purple-400">
                    <Link href={`/planes/${item.id}`}>{item.name}</Link>
                  </h2>
                  {item.description && <p className="mt-1 text-sm text-gray-400 truncate">{item.description}</p>}
                  <p className="mt-1 text-lg font-medium text-gray-200">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <span className="w-10 text-center text-lg font-medium text-gray-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-col items-end sm:ml-auto">
                  <p className="text-xl font-semibold text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    type="button"
                    className="mt-2 font-medium text-red-500 hover:text-red-400 transition-colors text-sm flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen del Pedido */} 
        <div className="mt-10 bg-gray-800 shadow-2xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-purple-400">Resumen del Pedido</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-lg text-gray-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* Aquí puedes añadir más detalles como impuestos, envío (si aplica), etc. */}
            {/* <div className="flex justify-between text-lg text-gray-300">
              <span>Impuestos (10%)</span>
              <span>${(subtotal * 0.1).toFixed(2)}</span>
            </div> */}
            <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between text-2xl font-bold text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all duration-150 ease-in-out shadow-lg transform hover:scale-105"
            >
              Proceder al Pago
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/planes"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Continuar Comprando <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}