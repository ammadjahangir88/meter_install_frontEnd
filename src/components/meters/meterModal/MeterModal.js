import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import './MeterModal.css';
import axiosInstance from '../../utils/Axios';

function MeterModal({ isOpen, setIsOpen }) {
  const [formData, setFormData] = useState({
    NEW_METER_NUMBER: '',
    REF_NO: '',
    METER_STATUS: '',
    OLD_METER_NUMBER: '',
    OLD_METER_READING: '',
    NEW_METER_READING: '',
    CONNECTION_TYPE: '',
    BILL_MONTH: '',
    LONGITUDE: '',
    LATITUDE: '',
    METER_TYPE: '',
    KWH_MF: '',
    SAN_LOAD: '',
    CONSUMER_NAME: '',
    CONSUMER_ADDRESS: '',
    QC_CHECK: false,
    APPLICATION_NO: '',
    GREEN_METER: '',
    TELCO: '',
    SIM_NO: '',
    SIGNAL_STRENGTH: '',
    PICTURE_UPLOAD: null,
    METR_REPLACE_DATE_TIME: '',
    NO_OF_RESET_OLD_METER: '',
    NO_OF_RESET_NEW_METER: '',
    KWH_T1: '',
    KWH_T2: '',
    KWH_TOTAL: '',
    KVARH_T1: '',
    KVARH_T2: '',
    KVARH_TOTAL: '',
    MDI_T1: '',
    MDI_T2: '',
    MDI_TOTAL: '',
    CUMULATIVE_MDI_T1: '',
    CUMULATIVE_MDI_T2: '',
    CUMULATIVE_MDI_Total: '',
  });

  const handleChange = event => {
    const { name, type, checked, files, value } = event.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
  
    // Append all fields to formDataToSend, properly nested under 'meter'
    formDataToSend.append('meter[NEW_METER_NUMBER]', formData.NEW_METER_NUMBER);
    formDataToSend.append('meter[REF_NO]', formData.REF_NO);
    formDataToSend.append('meter[METER_STATUS]', formData.METER_STATUS);
    formDataToSend.append('meter[OLD_METER_NUMBER]', formData.OLD_METER_NUMBER);
    formDataToSend.append('meter[OLD_METER_READING]', formData.OLD_METER_READING);
    formDataToSend.append('meter[NEW_METER_READING]', formData.NEW_METER_READING);
    formDataToSend.append('meter[CONNECTION_TYPE]', formData.CONNECTION_TYPE);
    formDataToSend.append('meter[BILL_MONTH]', formData.BILL_MONTH);
    formDataToSend.append('meter[LONGITUDE]', formData.LONGITUDE);
    formDataToSend.append('meter[LATITUDE]', formData.LATITUDE);
    formDataToSend.append('meter[METER_TYPE]', formData.METER_TYPE);
    formDataToSend.append('meter[KWH_MF]', formData.KWH_MF);
    formDataToSend.append('meter[SAN_LOAD]', formData.SAN_LOAD);
    formDataToSend.append('meter[CONSUMER_NAME]', formData.CONSUMER_NAME);
    formDataToSend.append('meter[CONSUMER_ADDRESS]', formData.CONSUMER_ADDRESS);
    formDataToSend.append('meter[QC_CHECK]', formData.QC_CHECK);
    formDataToSend.append('meter[APPLICATION_NO]', formData.APPLICATION_NO);
    formDataToSend.append('meter[GREEN_METER]', formData.GREEN_METER);
    formDataToSend.append('meter[TELCO]', formData.TELCO);
    formDataToSend.append('meter[SIM_NO]', formData.SIM_NO);
    formDataToSend.append('meter[SIGNAL_STRENGTH]', formData.SIGNAL_STRENGTH);
    formDataToSend.append('meter[PICTURE_UPLOAD]', formData.PICTURE_UPLOAD);
    formDataToSend.append('meter[METR_REPLACE_DATE_TIME]', formData.METR_REPLACE_DATE_TIME);
    formDataToSend.append('meter[NO_OF_RESET_OLD_METER]', formData.NO_OF_RESET_OLD_METER);
    formDataToSend.append('meter[NO_OF_RESET_NEW_METER]', formData.NO_OF_RESET_NEW_METER);
    formDataToSend.append('meter[KWH_T1]', formData.KWH_T1);
    formDataToSend.append('meter[KWH_T2]', formData.KWH_T2);
    formDataToSend.append('meter[KWH_TOTAL]', formData.KWH_TOTAL);
    formDataToSend.append('meter[KVARH_T1]', formData.KVARH_T1);
    formDataToSend.append('meter[KVARH_T2]', formData.KVARH_T2);
    formDataToSend.append('meter[KVARH_TOTAL]', formData.KVARH_TOTAL);
    formDataToSend.append('meter[MDI_T1]', formData.MDI_T1);
    formDataToSend.append('meter[MDI_T2]', formData.MDI_T2);
    formDataToSend.append('meter[MDI_TOTAL]', formData.MDI_TOTAL);
    formDataToSend.append('meter[CUMULATIVE_MDI_T1]', formData.CUMULATIVE_MDI_T1);
    formDataToSend.append('meter[CUMULATIVE_MDI_T2]', formData.CUMULATIVE_MDI_T2);
    formDataToSend.append('meter[CUMULATIVE_MDI_Total]', formData.CUMULATIVE_MDI_Total);
  
    try {
      const response = await axiosInstance.post('/v1/meters', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Meter created successfully!');
      setIsOpen(false); // Close modal on success
      console.log('Server Response:', response);
    } catch ( error ) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form.');
    }
  };
  
  

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className="meter-modal">
        <div className="meter-create-header">
          <h2>Create Meter</h2>
          <FaTimes className="meter-close-icon" onClick={() => setIsOpen(false)} />
        </div>
        <form onSubmit={handleSubmit} className="meter-modal-content">
          {Object.entries(formData).map(([key, value]) => (
            <div className="input-group" key={key}>
              <label htmlFor={key}>{key.replace(/_/g, ' ')}:</label>
              {key === 'PICTURE_UPLOAD' ? (
                <input type="file" id={key} name={key} onChange={handleChange} />
              ) : key === 'QC_CHECK' ? (
                <input type="checkbox" id={key} name={key} checked={value} onChange={handleChange} />
              ) : (
                <input type="text" id={key} name={key} value={value} onChange={handleChange} />
              )}
            </div>
          ))}
          <div className="meter-modal-footer">
            <button type="submit" className="meter-submit-button">Submit</button>
            <button type="button" className="meter-cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}

export default MeterModal;
