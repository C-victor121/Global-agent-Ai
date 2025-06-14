=== Global Agent AI Contact Integration ===
Contributors: globalagentai
Tags: contact form, ai, automation, contact form 7, wpforms, gravity forms
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Integra tus formularios de contacto de WordPress con Global Agent AI para obtener respuestas automáticas y gestión inteligente de mensajes.

== Description ==

El plugin Global Agent AI Contact Integration conecta tus formularios de contacto existentes (Contact Form 7, WPForms, Gravity Forms) con la plataforma Global Agent AI. Cuando un visitante envía un mensaje a través de uno de estos formularios, la información se envía automáticamente a Global Agent AI para su procesamiento y respuesta.

Características principales:

*   **Integración Fácil:** Configura el plugin rápidamente con tu API Key de Global Agent AI.
*   **Soporte para Formularios Populares:** Compatible con Contact Form 7, WPForms y Gravity Forms.
*   **Automatización de Respuestas:** Permite que Global Agent AI gestione las respuestas iniciales a los mensajes de contacto.
*   **Registro de Mensajes:** Todos los mensajes enviados se registran en tu panel de Global Agent AI.

== Installation ==

1.  Sube la carpeta `global-agent-ai-contact-integration` al directorio `/wp-content/plugins/`.
2.  Activa el plugin a través del menú 'Plugins' en WordPress.
3.  Ve a 'Ajustes' > 'Global Agent AI' en el menú de administración de WordPress.
4.  Ingresa tu API Key de Global Agent AI (puedes obtenerla desde tu panel de Global Agent AI) y guarda los cambios.
5.  ¡Listo! El plugin comenzará a enviar los datos de los formularios de contacto compatibles a Global Agent AI.

== Frequently Asked Questions ==

= ¿Qué formularios de contacto son compatibles? =

Actualmente, el plugin es compatible con Contact Form 7, WPForms y Gravity Forms.

= ¿Dónde obtengo mi API Key? =

Puedes generar y copiar tu API Key desde la sección de Integración con WordPress en tu panel de usuario de Global Agent AI.

= ¿El plugin modifica mis formularios existentes? =

No, el plugin no modifica la estructura ni la apariencia de tus formularios. Simplemente intercepta los datos después de que se envían.

= ¿Qué sucede si mi API Key es inválida? =

Si la API Key no es válida o hay un problema de conexión, los mensajes no se enviarán a Global Agent AI y se registrará un error en los logs de PHP de tu servidor (si el logging está habilitado).

== Screenshots ==

1.  Página de configuración del plugin en el administrador de WordPress.

== Changelog ==

= 1.0.0 =
*   Lanzamiento inicial del plugin.
*   Soporte para Contact Form 7, WPForms y Gravity Forms.
*   Página de configuración para la API Key.

== Upgrade Notice ==

= 1.0.0 =
Lanzamiento inicial.