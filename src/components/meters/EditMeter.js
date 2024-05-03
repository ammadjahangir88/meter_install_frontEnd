import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import './EditMeter.css';
import axiosInstance from '../utils/Axios';


function EditMeter({ isOpen, setIsOpen, meterId ,  updateData}) {
  const [errors, setErrors] = useState({});
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
    image: null,
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

  useEffect(() => {
    async function fetchMeterData() {
      try {
        const response = await axiosInstance.get(`/v1/meters/${meterId}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching meter data:', error);
      }
    }
    fetchMeterData();
  }, [meterId]);

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
    if (!validateFormData()) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(`meter[${key}]`, value);
    });

    try {
      const response = await axiosInstance.put(`/v1/meters/${meterId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      updateData()
      alert('Meter updated successfully!');
      setIsOpen(false);
      console.log('Server Response:', response);
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Failed to submit the form.';

      if (error.response && error.response.status === 422) {
        errorMessage += '\n' + error.response.data.errors.join('\n');
      } else if (error.response) {
        errorMessage += ` Error: ${error.response.statusText} (${error.response.status})`;
      }

      alert(errorMessage);
    }
  };

  const validateFormData = () => {
    let newErrors = {};
    if (!formData.NEW_METER_NUMBER.trim()) newErrors.NEW_METER_NUMBER = 'New meter number is required.';
    if (!formData.REF_NO.trim()) newErrors.REF_NO = 'Reference number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className="edit-meter-modal">
        <div className="edit-meter-header">
          <h2>Edit Meter</h2>
          <FaTimes className="edit-meter-close-icon" onClick={() => setIsOpen(false)} />
        </div>
        <form onSubmit={handleSubmit} className="edit-meter-modal-content">
          {Object.entries(formData).map(([key, value]) => (
            <div className="input-group" key={key}>
              <label htmlFor={key}>{key.replace(/_/g, ' ')}:</label>
              {key === 'image' ? (
                <input type="file" id={key} name={key} onChange={handleChange} />
              ) : key === 'QC_CHECK' ? (
                <input type="checkbox" id={key} name={key} checked={value} onChange={handleChange} />
              ) : key === 'METER_TYPE' ? (
                <select id={key} name={key} value={value} onChange={handleChange}>
                  <option value="">Select Meter Type</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              ) : key === 'GREEN_METER' ? (
                <select id={key} name={key} value={value} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              ) : key === 'CONNECTION_TYPE' ? (
                <select id={key} name={key} value={value} onChange={handleChange}>
                  <option value="">Select Connection Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Street">Street</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Colony">Colony</option>
                  <option value="Street light">Street light</option>
                </select>
              ) : key === 'TELCO' ? (
                <select id={key} name={key} value={value} onChange={handleChange}>
                  <option value="">Select Telco</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Warid">Warid</option>
                  <option value="Ufone">Ufone</option>
                  <option value="Telenor">Telenor</option>
                  <option value="Zong">Zong</option>
                </select>
              ) : (
                <input type="text" id={key} name={key} value={value} onChange={handleChange} />
              )}
              {errors[key] && (
                <>
                  <br />
                  <div className="error">{errors[key]}</div>
                </>
              )}
            </div>
          ))}
          {errors.form && <div className="error">{errors.form}</div>}
          <div className="edit-meter-modal-footer">
            <button type="submit" className="edit-meter-submit-button">Submit</button>
            <button type="button" className="edit-meter-cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}

export default EditMeter;
