<?php

namespace MongoDB\Tutorials\QueryableEncryption;

// start-patient-billing
class PatientBilling
{
    public $cardType;
    public $cardNumber;

    public function __construct($cardType = null, $cardNumber = null)
    {
        $this->cardType = $cardType;
        $this->cardNumber = $cardNumber;
    }

    public function toArray()
    {
        return [
            'type' => $this->cardType,
            'number' => $this->cardNumber,
        ];
    }
}
// end-patient-billing
