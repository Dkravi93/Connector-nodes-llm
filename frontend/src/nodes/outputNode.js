// outputNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  useEffect(() => {
    if (data?.outputName !== currName) {
      updateNodeField(id, 'outputName', currName);
    }
  }, [currName, id, updateNodeField, data?.outputName]);

  useEffect(() => {
    if (data?.outputType !== outputType) {
      updateNodeField(id, 'outputType', outputType);
    }
  }, [outputType, id, updateNodeField, data?.outputType]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="output"
      title="Output"
      inputHandles={[{ id: `${id}-value` }]}
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
          value={outputType} 
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
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
}
