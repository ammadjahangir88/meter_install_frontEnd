import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa'; // Assuming you have imported FontAwesome icons
import './MeterModal.css';
import { useState } from 'react';
function MyDialog({ data,isOpen, setIsOpen }) {
  console.log("aggs",data)
  
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
              <label htmlFor="id">ID:</label>
              <input type="text" id="id" name="id" />
            </div>
            <div className="input-group">
              <label htmlFor="meterNo">Meter No:</label>
              <input type="text" id="meterNo" name="meterNo" />
            </div>
            <div className="input-group">
              <label htmlFor="referenceNo">Reference No:</label>
              <input type="text" id="referenceNo" name="referenceNo" />
            </div>
            <div className="input-group">
              <label htmlFor="status">Status:</label>
              <input type="text" id="status" name="status" />
            </div>
            <div className="input-group">
              <label htmlFor="oldMeterNo">Old Meter No:</label>
              <input type="text" id="oldMeterNo" name="oldMeterNo" />
            </div>
            <div className="input-group">
              <label htmlFor="oldMeterReading">Old Meter Reading:</label>
              <input type="text" id="oldMeterReading" name="oldMeterReading" />
            </div>
            <div className="input-group">
              <label htmlFor="newMeterReading">New Meter Reading:</label>
              <input type="text" id="newMeterReading" name="newMeterReading" />
            </div>
            <div className="input-group">
              <label htmlFor="connectionType">Connection Type:</label>
              <input type="text" id="connectionType" name="connectionType" />
            </div>
            <div className="input-group">
              <label htmlFor="billMonth">Bill Month:</label>
              <input type="text" id="billMonth" name="billMonth" />
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
              <label htmlFor="meterType">Meter Type:</label>
              <input type="text" id="meterType" name="meterType" />
            </div>
            <div className="input-group">
              <label htmlFor="kwhMF">Kwh MF:</label>
              <input type="text" id="kwhMF" name="kwhMF" />
            </div>
            <div className="input-group">
              <label htmlFor="sanctionLoad">Sanction Load:</label>
              <input type="text" id="sanctionLoad" name="sanctionLoad" />
            </div>
            <div className="input-group">
              <label htmlFor="fullName">Full Name:</label>
              <input type="text" id="fullName" name="fullName" />
            </div>
            <div className="input-group">
              <label htmlFor="address">Address:</label>
              <input type="text" id="address" name="address" />
            </div>
            <div className="input-group">
              <label htmlFor="qcCheck">QC Check:</label>
              <input type="text" id="qcCheck" name="qcCheck" />
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

  function handleSubmit(event) {
    event.preventDefault();
    // Add your submit logic here
  }
}

export default MyDialog;