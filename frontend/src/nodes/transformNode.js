// transformNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');

  useEffect(() => {
    if (data?.transformType !== transformType) {
      updateNodeField(id, 'transformType', transformType);
    }
  }, [transformType, id, updateNodeField, data?.transformType]);

  const handleTransformChange = (e) => {
    setTransformType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="transform"
      title="Transform"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Transform Type:</span>
        <select 
          value={transformType} 
          onChange={handleTransformChange}
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor: 'white'
          }}
        >
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="trim">Trim</option>
          <option value="reverse">Reverse</option>
          <option value="replace">Replace</option>
        </select>
      </label>
    </BaseNode>
  );
}

