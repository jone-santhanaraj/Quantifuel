import React, { useState } from 'react';
import './FuelPumpManagement.css';

function FuelPumpManagement() {
  const [pumps, setPumps] = useState([]);
  const [newPump, setNewPump] = useState({ upin: '', fuelType: '' });

  const addPump = () => {
    // Add the new pump to the list (In a real app, this would involve a server call)
    setPumps([...pumps, newPump]);
    setNewPump({ upin: '', fuelType: '' });
  };

  return (
    <div>
      <h2>Fuel Pump Management</h2>
      <input
        type="text"
        placeholder="UPIN"
        value={newPump.upin}
        onChange={(e) => setNewPump({ ...newPump, upin: e.target.value })}
      />
      <input
        type="text"
        placeholder="Fuel Type"
        value={newPump.fuelType}
        onChange={(e) => setNewPump({ ...newPump, fuelType: e.target.value })}
      />
      <button onClick={addPump}>Add Pump</button>
      <ul>
        {pumps.map((pump, index) => (
          <li key={index}>
            {pump.upin} - {pump.fuelType}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FuelPumpManagement;
