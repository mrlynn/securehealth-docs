<?php

namespace MongoDB\Tutorials\QueryableEncryption;

// start-patient
class Patient
{
    public $id;
    public $patientName;
    public $patientRecord;

    public function __construct($patientName = null, $patientRecord = null)
    {
        $this->patientName = $patientName;
        $this->patientRecord = $patientRecord;
    }

    public function toArray()
    {
        return [
            'patientName' => $this->patientName,
            'patientRecord' => $this->patientRecord ? $this->patientRecord->toArray() : null,
        ];
    }
}
// end-patient
