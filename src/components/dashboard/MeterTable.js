import React from 'react';

function MeterTable({ meters }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Meter Number</th>
          <th>Full Name</th>
          <th>Address</th>
          {/* Add other relevant columns */}
        </tr>
      </thead>
      <tbody>
        {meters.map(meter => (
          <tr key={meter.id}>
            <td>{meter.new_meter_number}</td>
            <td>{meter.full_name}</td>
            <td>{meter.address}</td>
            {/* Render other meter details */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MeterTable;
