<?php

namespace MongoDB\Tutorials\QueryableEncryption;

// start-patient-record
class PatientRecord
{
    public $ssn;
    public $billing;
    public $billAmount;

    public function __construct($ssn = null, $billing = null, $billAmount = null)
    {
        $this->ssn = $ssn;
        $this->billing = $billing;
        $this->billAmount = $billAmount;
    }

    public function toArray()
    {
        return [
            'ssn' => $this->ssn,
            'billing' => $this->billing ? $this->billing->toArray() : null,
            'billAmount' => $this->billAmount,
        ];
    }
}
// end-patient-record
