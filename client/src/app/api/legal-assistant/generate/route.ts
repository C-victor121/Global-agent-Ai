import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Procesar el FormData
    const formData = await request.formData();
    const documentType = formData.get('documentType');
    const files = formData.getAll('files');

    if (!documentType || files.length === 0) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Preparar los archivos para enviar a N8N
    const filesData = await Promise.all(
      files.map(async (file: any) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return {
          name: file.name,
          type: file.type,
          content: buffer.toString('base64')
        };
      })
    );

    // Enviar datos a N8N
    const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error('URL del webhook de N8N no configurada');
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentType,
        files: filesData,
        userId: session.user.id,
        userEmail: session.user.email
      })
    });

    if (!n8nResponse.ok) {
      throw new Error('Error al procesar la solicitud en N8N');
    }

    const responseData = await n8nResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Solicitud procesada correctamente',
      data: responseData
    });

  } catch (error) {
    console.error('Error en el endpoint de generación de documentos:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}