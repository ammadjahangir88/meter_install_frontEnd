import React, { useState } from 'react';
import './LeftColumn.css';

// Utility functions for handling item toggles
const toggleItem = (list, setList, id) => {
  setList(list.includes(id) ? list.filter(item => item !== id) : [...list, id]);
};

const LeftColumn = ({ data, onItemClick, onDiscosClick, onDivisionClick, onRegionClick, setSelectedItem, setHighlightedItem, selectedItemId,onAllClick }) => {
  const [expandedItems, setExpandedItems] = useState([]);
  const [expandedDivisions, setExpandedDivisions] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState([]);

  const handleSetSelectedItem = (id, type, name) => {
    setSelectedItem(`${type}-${id}`);
    setHighlightedItem({ name, type,id });
  };

  const renderTreeItem = item => (
    <div key={item.id} className="tree-item">
      <div className={`tree-item-header ${selectedItemId === `disco-${item.id}` ? "highlighted" : ""}`}
           onClick={() => {
             onDiscosClick(item);
             toggleItem(expandedItems, setExpandedItems, item.id);
             handleSetSelectedItem(item.id, 'disco', item.name);
           }}>
        {item.regions.length > 0 ? (expandedItems.includes(item.id) ? "▼" : "►") : ""} {item.name}
      </div>
      {expandedItems.includes(item.id) && item.regions.map(renderRegionItem)}
    </div>
  );
  const renderAllOption = () => (
    <div className={`tree-item-header ${selectedItemId === 'all' ? "highlighted" : ""}`}
         onClick={() => {
          onAllClick(data.flatMap(disco =>
             disco.regions.flatMap(region =>
               region.divisions.flatMap(division =>
                 division.subdivisions.flatMap(subdivision => subdivision.meters)
               )
             )
           ));
           setSelectedItem('all');
           setHighlightedItem({ name: 'All', type: 'all' });
         }}>
      All
    </div>
  );

  const renderRegionItem = region => (
    <div key={region.id} className="tree-sub-item">
      <div className={`tree-sub-item-header ${selectedItemId === `region-${region.id}` ? "highlighted" : ""}`}
           onClick={() => {
             onRegionClick(region);
             toggleItem(expandedRegions, setExpandedRegions, region.id);
             handleSetSelectedItem(region.id, 'region', region.name);
           }}>
        {region.divisions.length > 0 ? (expandedRegions.includes(region.id) ? "▼" : "►") : ""} {region.name}
      </div>
      {expandedRegions.includes(region.id) && region.divisions.map(renderDivisionItem)}
    </div>
  );

  const renderDivisionItem = division => (
    <div key={division.id} className="tree-sub-sub-item">
      <div className={`tree-sub-sub-item-header ${selectedItemId === `division-${division.id}` ? "highlighted" : ""}`}
           onClick={() => {
             onDivisionClick(division);
             toggleItem(expandedDivisions, setExpandedDivisions, division.id);
             handleSetSelectedItem(division.id, 'division', division.name);
           }}>
        {division.subdivisions.length > 0 ? (expandedDivisions.includes(division.id) ? "▼" : "►") : ""} {division.name}
      </div>
      {expandedDivisions.includes(division.id) && division.subdivisions.map(subdivision => (
        <div key={subdivision.id} className="tree-sub-sub-sub-item">
          <div className={`tree-sub-sub-sub-item-header ${selectedItemId === `subdivision-${subdivision.id}` ? "highlighted" : ""}`}
               onClick={() => {
                 onItemClick(subdivision);
                 handleSetSelectedItem(subdivision.id, 'subdivision', subdivision.name);
               }}>
            {subdivision.name}
          </div>
        </div>
      ))}
    </div>
  );

  if (!data.length) return <div>No data available.</div>;

  return (
    <div className="left-column">
      {renderAllOption()}
      {data.map(renderTreeItem)}
    </div>
  );
};

export default LeftColumn;
