<?php if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Outputs metabox on React submissions page
 *
 */
class WH_NF_PaypalStandard_Admin_Metabox {

	public function handle( $extraValue, $nfSub )
	{
		$return = null;

		$sub_id = $nfSub->get_id();

		$paypal_payment_status = get_post_meta( $sub_id, 'paypal_standard_payment_status', true );

		// backward compatibility
		$payment_status = get_post_meta( $sub_id, 'payment_standard_status', true );

		$transaction_id = get_post_meta( $sub_id, 'paypal_standard_transaction_id', true );
		$payment_amount = get_post_meta( $sub_id, 'paypal_standard_payment_amount', true );
		if ( ! $payment_status && ! $paypal_payment_status ) {
			$paypal_payment_status = 'Not Paid';
		} elseif ( $payment_status ) {
			$paypal_payment_status = $payment_status;
		}

		$labelValueCollection[] =  [
			'label' => __( 'Payment Status', 'ninja-forms-constant-contact' ),
			'value' =>  $paypal_payment_status,
			'styling' => ''
		];

		if ( $transaction_id ) {

			$labelValueCollection[] =  [
				'label' => __( 'Transaction ID', 'ninja-forms-constant-contact' ),
				'value' =>  $transaction_id,
				'styling' => ''
			];

		}
		if ( $payment_amount ) {
			$labelValueCollection[] =  [
				'label' => __( 'Amount', 'ninja-forms-constant-contact' ),
				'value' =>  $payment_amount,
				'styling' => ''
			];

		}



		if ( ! empty( $labelValueCollection ) ) {

			$array = [
				'title' => __( 'Paypal Standard', 'ninja-forms-constant-contact' ),
				'labelValueCollection' => $labelValueCollection

			];

			$return = $array ;
		}
		//var_dump($array); die;
		return $return;
	}

}
