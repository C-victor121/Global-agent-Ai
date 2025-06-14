<?php
/**
 * Plugin Name: Global Agent AI Contact Integration
 * Description: Integra formularios de contacto con Global Agent AI para respuestas automáticas
 * Version: 1.0.0
 * Author: Global Agent AI
 */

// Prevenir acceso directo
if (!defined('ABSPATH')) {
    exit;
}

class GlobalAgentAIIntegration {
    private $api_key;
    private $api_endpoint = 'http://localhost:3001/api/contact-message'; // Asegúrate de que este sea el puerto correcto de tu backend en desarrollo
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('wp_ajax_save_api_key', array($this, 'save_api_key'));
        
        // Hook para Contact Form 7
        add_action('wpcf7_mail_sent', array($this, 'handle_cf7_submission'));
        
        // Hook para WPForms
        add_action('wpforms_process_complete', array($this, 'handle_wpforms_submission'), 10, 4);
        
        // Hook para Gravity Forms
        add_action('gform_after_submission', array($this, 'handle_gravity_forms_submission'), 10, 2);
    }
    
    public function init() {
        $this->api_key = get_option('global_agent_ai_api_key', '');
    }
    
    public function admin_menu() {
        add_menu_page(
            'Global Agent AI',
            'Global Agent AI',
            'manage_options',
            'global-agent-ai',
            array($this, 'admin_page'),
            'dashicons-cloud',
            20
        );
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Global Agent AI - Configuración</h1>
            <form method="post" action="admin-ajax.php">
                <?php wp_nonce_field('save_api_key', 'api_key_nonce'); ?>
                <input type="hidden" name="action" value="save_api_key">
                <table class="form-table">
                    <tr>
                        <th scope="row">API Key</th>
                        <td>
                            <input type="text" name="api_key" value="<?php echo esc_attr($this->api_key); ?>" class="regular-text" placeholder="Ingresa tu API Key de Global Agent AI" />
                            <p class="description">Obtén tu API Key desde tu panel de Global Agent AI</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button('Guardar API Key'); ?>
            </form>
            
            <h2>Estado de la Integración</h2>
            <p><strong>API Key:</strong> <?php echo $this->api_key ? 'Configurada ✅' : 'No configurada ❌'; ?></p>
            <p><strong>Endpoint:</strong> <?php echo esc_html($this->api_endpoint); ?></p>
        </div>
        <?php
    }
    
    public function save_api_key() {
        if (!wp_verify_nonce($_POST['api_key_nonce'], 'save_api_key')) {
            wp_die('Error de seguridad');
        }
        
        if (!current_user_can('manage_options')) {
            wp_die('Sin permisos');
        }
        
        $api_key = sanitize_text_field($_POST['api_key']);
        update_option('global_agent_ai_api_key', $api_key);
        
        wp_redirect(admin_url('options-general.php?page=global-agent-ai&updated=1'));
        exit;
    }
    
    // Contact Form 7
    public function handle_cf7_submission($contact_form) {
        $submission = WPCF7_Submission::get_instance();
        if ($submission) {
            $posted_data = $submission->get_posted_data();
            $this->send_to_api([
                'visitor_name' => $posted_data['your-name'] ?? '',
                'visitor_email' => $posted_data['your-email'] ?? '',
                'subject' => $posted_data['your-subject'] ?? 'Contacto desde ' . get_bloginfo('name'),
                'message' => $posted_data['your-message'] ?? ''
            ]);
        }
    }
    
    // WPForms
    public function handle_wpforms_submission($fields, $entry, $form_data, $entry_id) {
        $name = '';
        $email = '';
        $message = '';
        
        foreach ($fields as $field) {
            if ($field['type'] === 'name') $name = $field['value'];
            if ($field['type'] === 'email') $email = $field['value'];
            if ($field['type'] === 'textarea') $message = $field['value'];
        }
        
        $this->send_to_api([
            'visitor_name' => $name,
            'visitor_email' => $email,
            'message' => $message,
            'subject' => 'Contacto desde ' . get_bloginfo('name') . ' (WPForms ID: ' . $form_data['id'] . ')'
        ]);
    }
    
    // Gravity Forms
    public function handle_gravity_forms_submission($entry, $form) {
        $name = '';
        $email = '';
        $message = '';
        
        // Asumiendo IDs de campo comunes. Ajustar según sea necesario.
        // Puedes encontrar los IDs inspeccionando los campos en el editor de Gravity Forms.
        $name_field_id = '1'; // Ejemplo, ajusta esto
        $email_field_id = '2'; // Ejemplo, ajusta esto
        $message_field_id = '3'; // Ejemplo, ajusta esto

        if (isset($entry[$name_field_id])) {
            $name = rgar($entry, $name_field_id);
        }
        if (isset($entry[$email_field_id])) {
            $email = rgar($entry, $email_field_id);
        }
        if (isset($entry[$message_field_id])) {
            $message = rgar($entry, $message_field_id);
        }
        
        $this->send_to_api([
            'visitor_name' => $name,
            'visitor_email' => $email,
            'message' => $message,
            'subject' => 'Contacto desde ' . get_bloginfo('name') . ' (Gravity Forms ID: ' . $form['id'] . ')'
        ]);
    }

    private function send_to_api($data) {
        if (empty($this->api_key)) {
            error_log('Global Agent AI: API Key no configurada.');
            return;
        }

        $body = array_merge($data, [
            'wordpress_url' => get_site_url(),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);

        $response = wp_remote_post($this->api_endpoint, [
            'method'    => 'POST',
            'headers'   => [
                'Content-Type' => 'application/json',
                'X-API-KEY'    => $this->api_key
            ],
            'body'      => json_encode($body),
            'timeout'   => 15, // Aumentar si es necesario
            'sslverify' => true // Cambiar a false solo para desarrollo local si hay problemas de SSL
        ]);

        if (is_wp_error($response)) {
            error_log('Global Agent AI Error: ' . $response->get_error_message());
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);
            if ($response_code >= 400) {
                error_log('Global Agent AI API Error (' . $response_code . '): ' . $response_body);
            } else {
                // Opcional: Log de éxito o manejo de respuesta
                error_log('Global Agent AI: Mensaje enviado correctamente. Respuesta: ' . $response_body);
            }
        }
    }
}

new GlobalAgentAIIntegration();