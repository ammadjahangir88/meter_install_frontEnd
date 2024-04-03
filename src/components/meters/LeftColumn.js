import { useEffect, useState } from "react";
import './index.css'

const LeftColumn = ({
    data,
    onItemClick,
    onDiscosClick,
    onDivisionClick,
    onAllClick,
  }) => {
    const [expandedItems, setExpandedItems] = useState([]);
    const [expandedDivisions, setExpandedDivisions] = useState([]);
  
    useEffect(() => {
      if (data) {
        const discosIds = data.map((item) => item.id);
        setExpandedItems(discosIds);
        console.log(data)
        const divisionsIds = data.flatMap((disco) =>
          disco.divisions.map((division) => division.id)
        );
        setExpandedDivisions(divisionsIds);
      }
    }, [data]);
  
    const toggleItem = (itemId) => {
      if (expandedItems.includes(itemId)) {
        setExpandedItems(expandedItems.filter((id) => id !== itemId));
      } else {
        setExpandedItems([...expandedItems, itemId]);
      }
    };
  
    const toggleDivision = (divisionId) => {
      if (expandedDivisions.includes(divisionId)) {
        setExpandedDivisions(expandedDivisions.filter((id) => id !== divisionId));
      } else {
        setExpandedDivisions([...expandedDivisions, divisionId]);
      }
    };
  
    const renderTreeItem = (item) => {
      const isExpanded = expandedItems.includes(item.id);
      const hasChildren = item.divisions && item.divisions.length > 0;
  
      return (
        <div key={item.id} className="tree-item" style={{ marginLeft: "10px" }}>
          <div
            className="tree-item-header"
            style={{ cursor: "pointer" }}
            onClick={() => {
              onDiscosClick(item);
              toggleItem(item.id);
            }}
          >
            {hasChildren ? (isExpanded ? "▼" : "►") : ""} {item.name}
          </div>
          {isExpanded &&
            hasChildren &&
            item.divisions.map((division) => (
              <div
                key={division.id}
                className="tree-sub-item"
                style={{ marginLeft: "20px" }}
              >
                <div
                  className="tree-sub-item-header"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onDivisionClick(division);
                    toggleDivision(division.id);
                  }}
                >
                  {division.subdivisions && division.subdivisions.length > 0
                    ? expandedDivisions.includes(division.id)
                      ? "▼"
                      : "►"
                    : ""}{" "}
                  {division.name}
                </div>
                {expandedDivisions.includes(division.id) &&
                  division.subdivisions &&
                  division.subdivisions.map((subdivision) => (
                    <div
                      key={subdivision.id}
                      className="tree-sub-sub-item"
                      style={{ marginLeft: "30px" }}
                    >
                      <div
                        className="tree-sub-sub-item-header"
                        style={{ cursor: "pointer" }}
                        onClick={() => onItemClick(subdivision)}
                      >
                        {subdivision.name}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      );
    };
  
    if (!data) {
      return null;
    }
  
    return (
      <div className="left-column">
        <h3
          onClick={() => {
            const allMeters = data.flatMap((disco) =>
              disco.divisions.flatMap((division) =>
                division.subdivisions.flatMap((subdivision) => subdivision.meters)
              )
            );
  
            onAllClick(allMeters);
          }}
        >
          All
        </h3>
        {data.map((item) => renderTreeItem(item))}
      </div>
    );
  };

export default LeftColumn;
