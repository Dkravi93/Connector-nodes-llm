// inputNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  useEffect(() => {
    if (data?.inputName !== currName) {
      updateNodeField(id, 'inputName', currName);
    }
  }, [currName, id, updateNodeField, data?.inputName]);

  useEffect(() => {
    if (data?.inputType !== inputType) {
      updateNodeField(id, 'inputType', inputType);
    }
  }, [inputType, id, updateNodeField, data?.inputType]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="input"
      title="Input"
      outputHandles={[{ id: `${id}-value` }]}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Name:</span>
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange}
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        />
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Type:</span>
        <select 
          value={inputType} 
          onChange={handleTypeChange}
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor: 'white'
          }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
}
