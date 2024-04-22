  import { Dialog } from '@headlessui/react';
  import { FaTimes } from 'react-icons/fa';
  import { useState } from 'react';
  import './MeterModal.css'; // Ensure this CSS is specific to this component

  function MyDialog({ isOpen, setIsOpen }) {

    function handleSubmit(event) {
      event.preventDefault();
      // Implement your submit logic here
    }

    return (
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Panel className="meter-modal">
          <div className="meter-create-header">
            <h2>Create Meter</h2>
            <FaTimes className="meter-close-icon" onClick={() => setIsOpen(false)} />
          </div>
          <div className="meter-modal-content">
            <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label htmlFor="applicationNo">Application No:</label>
                <input type="text" id="applicationNo" name="applicationNo" />
              </div>
              <div className="input-group">
                <label htmlFor="referenceNo">Reference No:</label>
                <input type="text" id="referenceNo" name="referenceNo" />
              </div>
              <div className="input-group">
                <label htmlFor="meterStatus">Meter Status:</label>
                <input type="text" id="meterStatus" name="meterStatus" />
              </div>
              <div className="input-group">
                <label htmlFor="greenMeter">Green Meter:</label>
                <input type="text" id="greenMeter" name="greenMeter" />
              </div>
              <div className="input-group">
                <label htmlFor="newMeterNumber">New Meter Number:</label>
                <input type="text" id="newMeterNumber" name="newMeterNumber" />
              </div>
              <div className="input-group">
                <label htmlFor="oldMeterNumber">Old Meter Number:</label>
                <input type="text" id="oldMeterNumber" name="oldMeterNumber" />
              </div>
              <div className="input-group">
                <label htmlFor="newMeterReading">New Meter Reading:</label>
                <input type="text" id="newMeterReading" name="newMeterReading" />
              </div>
              <div className="input-group">
                <label htmlFor="oldMeterReading">Old Meter Reading:</label>
                <input type="text" id="oldMeterReading" name="oldMeterReading" />
              </div>
              <div className="input-group">
                <label htmlFor="connectionType">Connection Type:</label>
                <input type="text" id="connectionType" name="connectionType" />
              </div>
              <div className="input-group">
                <label htmlFor="sanLoad">San Load:</label>
                <input type="text" id="sanLoad" name="sanLoad" />
              </div>
              <div className="input-group">
                <label htmlFor="billMonth">Bill Month:</label>
                <input type="text" id="billMonth" name="billMonth" />
              </div>
              <div className="input-group">
                <label htmlFor="meterType">Meter Type:</label>
                <input type="text" id="meterType" name="meterType" />
              </div>
              <div className="input-group">
                <label htmlFor="kwhMf">Kwh MF:</label>
                <input type="text" id="kwhMf" name="kwhMf" />
              </div>
              <div className="input-group">
                <label htmlFor="telco">Telco:</label>
                <input type="text" id="telco" name="telco" />
              </div>
              <div className="input-group">
                <label htmlFor="simNo">SIM No:</label>
                <input type="text" id="simNo" name="simNo" />
              </div>
              <div className="input-group">
                <label htmlFor="signalStrength">Signal Strength:</label>
                <input type="text" id="signalStrength" name="signalStrength" />
              </div>
              <div className="input-group">
                <label htmlFor="consumerName">Consumer Name:</label>
                <input type="text" id="consumerName" name="consumerName" />
              </div>
              <div className="input-group">
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" name="address" />
              </div>
              <div className="input-group">
                <label htmlFor="pictureUpload">Picture Upload:</label>
                <input type="text" id="pictureUpload" name="pictureUpload" />
              </div>
              <div className="input-group">
                <label htmlFor="longitude">Longitude:</label>
                <input type="text" id="longitude" name="longitude" />
              </div>
              <div className="input-group">
                <label htmlFor="latitude">Latitude:</label>
                <input type="text" id="latitude" name="latitude" />
              </div>
              
            </form>
          </div>
          <div className="meter-modal-footer">
            <button type="submit" className="meter-submit-button">Submit</button>
            <button type="button" className="meter-cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    );
  }

  export default MyDialog;
