import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/Axios";
import ConfirmationModal from "../utils/ConfirmationModal";
import "./index.css";
import AddItemModal from "./AddItemModal";

const TableView = ({ data, item, updateData }) => {
  const [allItems, setAllItems] = useState([]); // This will hold the IDs of selected discos
  const [selectedDiscoItems, setSelectedDiscoItems] = useState([]);
  const [selectedRegionItems, setSelectedRegionItems] = useState([]);
  const [selectedDivisionItems, setSelectedDivisionItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Clear selections when item changes
    setAllItems([]);
    setSelectedDiscoItems([]);
    setSelectedRegionItems([]);
    setSelectedDivisionItems([]);
  }, [item]);
  const handleAddNewClick = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddItemSubmit = async (event) => {
    event.preventDefault();
    const { name } = event.target.elements;
    try {
      await axiosInstance.post(`/v1/discos/add_${item.type}`, {
        name: name.value,
      });
      updateData(); // refresh the list
      handleModalClose();
      console.log("Addition successful");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  const handleCheckboxChange = (id, type) => {
    let setter = null;
    switch (type) {
      case "all":
        setter = setAllItems;
        break;
      case "disco":
        setter = setSelectedDiscoItems;
        break;
      case "region":
        setter = setSelectedRegionItems;
        break;
      case "division":
        setter = setSelectedDivisionItems;
        break;
      default:
        return;
    }
    setter((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    const { type } = item;
    let confirmationMsg = "";
    switch (type) {
      case "all":
        confirmationMsg = `Are you sure you want to delete the selected Discos and all their associated entities?`;
        break;
      case "disco":
        confirmationMsg = `Are you sure you want to delete the selected regions and all their associated entities from ${item.name}?`;
        break;
      case "region":
        confirmationMsg = `Are you sure you want to delete the selected divisions and all their associated subdivisions from ${item.name}?`;
        break;
      case "division":
        confirmationMsg = `Are you sure you want to delete the selected subdivisions from ${item.name}?`;
        break;
      default:
        return;
    }
    setConfirmationMessage(confirmationMsg);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    const { type } = item;
    let url = "";
    let idsToDelete = [];

    switch (type) {
      case "all":
        url = "/v1/discos/delete_discos";
        idsToDelete = allItems;
        break;
      case "disco":
        url = "/v1/discos/delete_regions";
        idsToDelete = selectedDiscoItems;
        break;
      case "region":
        url = "/v1/discos/delete_divisions";
        idsToDelete = selectedRegionItems;
        break;
      case "division":
        url = "/v1/discos/delete_subdivisions";
        idsToDelete = selectedDivisionItems;
        break;
      default:
        setShowConfirmation(false);
        return;
    }

    try {
      await axiosInstance.delete(url, { data: { ids: idsToDelete } });
      updateData();
      console.log("Deletion successful");
    } catch (error) {
      console.error("Error deleting items:", error);
    }
    setShowConfirmation(false);
  };

  const cancelDelete = () => setShowConfirmation(false);

  const renderContent = () => {
    let content = [];
    switch (item.type) {
      case "all":
        content = data.map((disco) => ({ id: disco.id, name: disco.name }));
        break;
      case "disco":
        const disco = data.find((d) => d.name === item.name);
        content = disco?.regions || [];
        break;
      case "region":
        data.forEach((disco) => {
          const region = disco.regions.find((r) => r.name === item.name);
          if (region) content = region.divisions;
        });
        break;
      case "division":
        data.forEach((disco) => {
          disco.regions.forEach((region) => {
            const division = region.divisions.find((d) => d.name === item.name);
            if (division) content = division.subdivisions;
          });
        });
        break;
      default:
        content = [];
    }
    return content.map((c) => (
      <tr key={c.id}>
        <td>{c.id}</td>
        <td>{c.name}</td>
        <td className="checkbox-cell">
          <input
            type="checkbox"
            checked={
              item.type === "all"
                ? allItems.includes(c.id)
                : item.type === "disco"
                ? selectedDiscoItems.includes(c.id)
                : item.type === "region"
                ? selectedRegionItems.includes(c.id)
                : selectedDivisionItems.includes(c.id)
            }
            onChange={() => handleCheckboxChange(c.id, item.type)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className="table-view-container">
      {showConfirmation && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <div className="table-view-buttons">
        <AddItemModal
          isOpen={showAddModal}
          onClose={handleModalClose}
          onSubmit={handleAddItemSubmit}
          itemType={
            item.type === "all"
              ? "Disco"
              : item.type === "disco"
              ? "Region"
              : "Division"
          }
        />
        <button
          className="table-view-button"
          onClick={handleAddNewClick}
          >
          Add
        </button>
        <button className="table-view-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <table className="table-view">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderContent()}</tbody>
      </table>
    </div>
  );
};

export default TableView;
