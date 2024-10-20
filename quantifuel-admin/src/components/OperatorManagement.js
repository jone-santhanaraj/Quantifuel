import React, { useState } from 'react';
import './OperatorManagement.css';

function OperatorManagement() {
  const [operators, setOperators] = useState([]);
  const [newOperator, setNewOperator] = useState({ name: '', contactInfo: '' });

  const addOperator = () => {
    // Add the new operator to the list (In a real app, this would involve a server call)
    setOperators([...operators, newOperator]);
    setNewOperator({ name: '', contactInfo: '' });
  };

  return (
    <div>
      <h2>Operator Management</h2>
      <input
        type="text"
        placeholder="Name"
        value={newOperator.name}
        onChange={(e) =>
          setNewOperator({ ...newOperator, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Contact Info"
        value={newOperator.contactInfo}
        onChange={(e) =>
          setNewOperator({ ...newOperator, contactInfo: e.target.value })
        }
      />
      <button onClick={addOperator}>Add Operator</button>
      <ul>
        {operators.map((operator, index) => (
          <li key={index}>
            {operator.name} - {operator.contactInfo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OperatorManagement;
