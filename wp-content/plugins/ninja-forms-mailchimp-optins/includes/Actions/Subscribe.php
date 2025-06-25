<?php
if ( ! defined( 'ABSPATH' ) || ! class_exists( 'NF_Abstracts_ActionNewsletter' ) ) {
	exit;
}

/**
 * Class NF_MailChimpOptins_Actions_Subscribe
 */
final class NF_MailChimpOptins_Actions_Subscribe extends NF_Abstracts_ActionNewsletter
{
	protected $_name     = 'mailchimp-optins';
	protected $_tags     = array( 'mailchimp', 'newsletter' );
	protected $_timing   = 'normal';
	protected $_priority = '50';

	/**
	 * Constructor
	 */
	public function __construct()
	{
		parent::__construct();

		$this->_nicename = __( 'MailChimp Optin', 'ninja-forms-mailchimp-optins' );
		$this->_settings = array_merge(
			$this->_settings,
			NF_MailChimpOptins::config( 'ActionSubscribeSettings' )
		);
	}

	/**
	 * Fetches latest MailChimp lists.
	 *
	 * @since 3.0.0
	 * @return array MailChimp list array.
	 */
	protected function get_lists()
	{
		// Prep results array
		$results = array();

		// Get API Key
		$api_key = Ninja_Forms()->get_setting( 'mailchimp_api_key' );
		if ( ! empty( $api_key ) ) {
			// Get latest list
			$mailchimp = new \DrewM\MailChimp\MailChimp( $api_key );
			$lists     = $mailchimp->get('lists');

			if ( $mailchimp->success() && is_array( $lists )
				&& isset( $lists['lists'] ) && count( $lists['lists'] ) > 0 ) {

				foreach( $lists['lists'] as $list ) {

					// Let's try to get merge fields
					$fields       = array();
					$merge_fields = $mailchimp->get( 'lists/' . $list['id'] . '/merge-fields' );

					if ( $mailchimp->success() && is_array( $merge_fields )
						&& isset( $merge_fields['merge_fields'] )
						&& count( $merge_fields['merge_fields'] ) > 0 ) {

						foreach( $merge_fields['merge_fields'] as $field ) {
							$fields[] = array(
								'value' => $field['tag'],
								'label' => $field['name']
							);
						}
					}

					// Let's try to get interest groups
					$categories = array();
					$interest_categories = $mailchimp->get( 'lists/' . $list['id'] . '/interest-categories' );

					if ( $mailchimp->success() && is_array( $interest_categories )
						&& isset( $interest_categories['categories'] )
						&& count( $interest_categories['categories'] ) > 0 ) {

						foreach ( $interest_categories['categories'] as $category ) {
							// We will only support 'checkboxes' because default Ninja Forms
							// implementation doesn't seem to support dropdown/radio settings.
							if ( $category['type'] == 'checkboxes' ) {
								// Get interest list now
								$interests_list = array();
								$interests = $mailchimp->get( 'lists/' . $category['list_id'] . '/interest-categories/' . $category['id'] . '/interests' );
								if ( $mailchimp->success() && is_array( $interests )
									&& isset( $interests['interests'] )
									&& count( $interests['interests'] ) > 0 ) {

									foreach ( $interests['interests'] as $interest ) {
										$categories[] = array(
											'label' => sprintf( '%s (%s)', $interest['name'], $category['title'] ),
											'value' => $category['list_id'] . '_group_' . $interest['id']
										);
									}
								}
							}
						}
					}

					$results[] = array(
						'value'  => $list['id'],
						'label'  => $list['name'],
						'fields' => $fields,
						'groups' => $categories,
					);
				}

				// Let's store this data since we will need it later
				// to find merge tags in $data array.
				Ninja_Forms()->update_setting( 'mailchimp_api_data', $results );
			}
		}

		return $results;
	}

	/**
	 * Extra action save functionality should be implemented here (not required).
	 *
	 * @since 3.0.0
	 * @param array $action_settings Action settings key-value pairings.
	 */
	public function save( $action_settings ) {
	}

	/**
	 * Subscribe user to the selected list.
	 *
	 * @since 3.0.0
	 * @param array $action_settings Action settings
	 * @param int $form_id Form ID
	 * @param array $data Form data
	 * @return array Submission data
	 */
	public function process( $action_settings, $form_id, $data )
	{
		$api_key       = Ninja_Forms()->get_setting( 'mailchimp_api_key' );
		$api_data      = Ninja_Forms()->get_setting( 'mailchimp_api_data' );

		$list_id       = isset( $action_settings['newsletter_list'] ) ? $action_settings['newsletter_list'] : null;
		$action        = isset( $action_settings['mailchimp_action'] ) ? $action_settings['mailchimp_action'] : 'subscribe';
		$email         = isset( $action_settings['mailchimp_to'] ) && filter_var( $action_settings['mailchimp_to'], FILTER_VALIDATE_EMAIL ) ? $action_settings['mailchimp_to'] : null;
		$double_optin  = isset( $action_settings['mailchimp_double_optin'] ) && $action_settings['mailchimp_double_optin'] == true ? true : false;
		$send_language = isset( $action_settings['mailchimp_send_language'] ) && $action_settings['mailchimp_send_language'] == true ? true : false;
		$send_ip       = isset( $action_settings['mailchimp_send_ip'] ) && $action_settings['mailchimp_send_ip'] == true ? true : false;

		// Error: API Key is not set!
		if ( empty( $api_key ) ) {
			$data['errors']['form']['mailchimp-optins'] = __( 'MailChimp API Key is not set!', 'ninja-forms-mailchimp-optins' );
			return $data;
		}

		// Error: Mailchimp mailing list is not selected!
		if ( empty( $list_id ) ) {
			$data['errors']['form']['mailchimp-optins'] = __( 'MailChimp mailing list is not selected!', 'ninja-forms-mailchimp-optins' );
			return $data;
		}

		// Merge tags & Interest groups
		$merge_fields    = array();
		$interest_groups = array();

		if ( count( $api_data ) > 0 ) {
			foreach( $api_data as $list ) {
				if ( $list['value'] == $list_id ) {

					// Merge fields
					if ( isset( $list['fields'] ) && count( $list['fields'] ) > 0 ) {
						foreach( $list['fields'] as $field ) {
							if ( isset( $action_settings[$field['value']] ) ) {
								$merge_fields[$field['value']] = $action_settings[$field['value']];
							}
						}
					}

					// Interest groups
					if ( isset( $list['groups'] ) && count( $list['groups'] ) > 0 ) {
						foreach( $list['groups'] as $group ) {
							if ( isset( $group['value'] ) ) {
								$tmp = explode( '_group_', $group['value'] );
								if ( count( $tmp ) == 2 ) {
									if ( array_key_exists( $group['value'], $action_settings ) ) {
										$interest_groups[$tmp[1]] = true;
									} else {
										$interest_groups[$tmp[1]] = false;
									}
								}
							}
						}
					}

				}
			}
		}

		if ( ( $action == '' || $action == 'subscribe' ) && ! empty ( $email ) ) {
			$this->subscribe(
				$api_key,
				$list_id,
				$email,
				$merge_fields,
				$interest_groups,
				$double_optin,
				$send_language,
				$send_ip
			);
		} elseif ( $action == 'unsubscribe' && ! empty ( $email ) ) {
			$this->unsubscribe(
				$api_key,
				$list_id,
				$email
			);
		}

		return $data;
	}

	/**
	 * Subscribers user to mailing list using MailChimp API
	 *
	 * @since 3.0.0
	 * @param string $api_key MailChimp API key.
	 * @param string $list_id MailChimp list ID.
	 * @param string $email Email address.
	 * @param array $fields Merge fields array (key - value pairs).
	 * @param array $interest_groups Interest groups.
	 * @param bool $double_optin When true, enables double optin.
	 * @param bool $send_language Sends language information to MailChimp, when set to true.
	 * @param bool $send_ip Sends (signup) IP address to MailChimp when set to true.
	 * @return bool Subscribe status
	 */
	private function subscribe( $api_key, $list_id, $email, $fields, $interest_groups, $double_optin = false, $send_language = false, $send_ip = false )
	{
		$data = array(
			'email_address' => $email,
			'status'        => ( $double_optin == true ) ? 'pending' : 'subscribed',
			'merge_fields'  => $fields,
		);

		// Interest groups
		if ( is_array( $interest_groups ) && count( $interest_groups ) > 0 ) {
			$data['interests'] = $interest_groups;
		}

		// Language
		$lang = isset( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ) && strlen( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ) > 1
			? substr( $_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2 ) : false;

		if ( $send_language && $lang ) {
			$data['language'] = $lang;
		}

		// IP Address
		if ( $send_ip ) {
			$data['ip_signup'] = $this->get_client_ip_address();
		}

		$mailchimp = new \DrewM\MailChimp\MailChimp( $api_key );
		$result    = $mailchimp->post( 'lists/' . $list_id . '/members', $data );
		if ( $mailchimp->success() ) {
			return true;
		}

		return false;
	}

	/**
	 * Unsubscribe the user from the mailing list.
	 *
	 * @since 3.2.0
	 * @param string $api_key MailChimp API key.
	 * @param string $list_id MailChimp list ID.
	 * @param string $email Email address.
	 * @return bool Status
	 */
	public function unsubscribe( $api_key, $list_id, $email )
	{
		// Convert email to hash
		$email_hash = md5( strtolower( $email ) );

		// API Request
		$mailchimp = new \DrewM\MailChimp\MailChimp( $api_key );
		$result    = $mailchimp->patch( 'lists/' . $list_id . '/members/' . $email_hash, array( 'status' => 'unsubscribed' ) );
		if ( $mailchimp->success() ) {
			return true;
		}

		return false;
	}

	/**
	 * Retrieves client IP address (attempting several options).
	 *
	 * @since 3.0.0
	 * @return string IP address.
	 */
	private function get_client_ip_address()
	{
		$ip = '0.0.0.0'; // Unknown IP

		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		}

		return $ip;
	}
}
