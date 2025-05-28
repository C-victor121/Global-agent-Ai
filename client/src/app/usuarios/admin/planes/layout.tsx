import React from 'react';

export default function AdminPlanesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Aquí se podría agregar un encabezado específico para la gestión de planes o un submenú */}
      {children}
    </section>
  );
}