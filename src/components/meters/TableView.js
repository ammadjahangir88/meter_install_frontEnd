import React, { useState } from 'react';
import './index.css';

const TableView = ({ data, item }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderContent = () => {
    let content = [];

    if (item.type === 'disco') {
      const disco = data.find(d => d.name === item.name);
      content = disco?.regions || [];
    } else if (item.type === 'region') {
      data.forEach(disco => {
        const region = disco.regions.find(r => r.name === item.name);
        if (region) content = region.divisions;
      });
    } else if (item.type === 'division') {
      data.forEach(disco => {
        disco.regions.forEach(region => {
          const division = region.divisions.find(d => d.name === item.name);
          if (division) content = division.subdivisions;
        });
      });
    }

    return content.map((c) => (
      <tr key={c.id}>
        <td>{c.id}</td>
        <td>{c.name}</td>
        <td className="checkbox-cell">
          <input
            type="checkbox"
            checked={selectedItems.includes(c.id)}
            onChange={() => handleCheckboxChange(c.id)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="table-view-container">
      <div className="table-view-buttons">
        <button className="table-view-button" onClick={() => console.log('Add new item')}>Add</button>
        <button className="table-view-button" onClick={() => console.log('Delete selected items', selectedItems)}>Delete</button>
      </div>
      <table className="table-view">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {renderContent()}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
