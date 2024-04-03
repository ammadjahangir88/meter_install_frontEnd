import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import './MeterModal.css';

function MyDialog({ data, isOpen, setIsOpen }) {
  console.log("aggs", data)

  const [selectedDisco, setSelectedDisco] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');

  const handleDiscoChange = (event) => {
    setSelectedDisco(event.target.value);
    setSelectedDivision('');
    setSelectedSubdivision('');
  };

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
    setSelectedSubdivision('');
  };

  function handleSubmit(event) {
    event.preventDefault();
    // Add your submit logic here
  }

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel className="modal">
        <div className="create-meter">
          <h2>Create Meter</h2>
          <FaTimes className="close-icon" onClick={() => setIsOpen(false)} />
        </div>
        <div className="modal-content">
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
            <div className="input-group">
              <label htmlFor="disco">Disco:</label>
              <select id="disco"  className="dropdown"  name="disco" value={selectedDisco} onChange={handleDiscoChange}>
                <option value="">Select Disco</option>
                {data.map((disco) => (
                  <option key={disco.id} value={disco.name}>
                    {disco.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedDisco && (
              <div className="input-group">
                <label htmlFor="division">Division:</label>
                <select
                  id="division"
                  name="division"
                  value={selectedDivision}
                  onChange={handleDivisionChange}
                  className="dropdown"
                >
                  <option value="">Select Division</option>
                  {data
                    .find((disco) => disco.name === selectedDisco)
                    .divisions.map((division) => (
                      <option key={division.id} value={division.name}>
                        {division.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {/* Subdivision dropdown */}
            {selectedDisco && selectedDivision && (
              <div className="input-group">
                <label htmlFor="subdivision">Subdivision:</label>
                <select
                  id="subdivision"
                  name="subdivision"
                  value={selectedSubdivision}
                  onChange={(e) => setSelectedSubdivision(e.target.value)}
                  className="dropdown"
                >
                  <option value="">Select Subdivision</option>
                  {data
                    .find((disco) => disco.name === selectedDisco)
                    .divisions.find((division) => division.name === selectedDivision)
                    .subdivisions.map((subdivision) => (
                      <option key={subdivision.id} value={subdivision.name}>
                        {subdivision.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div className="footer">
              <button type="submit" className="submit-button">Submit</button>
              <button type="button" className="cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

export default MyDialog;
