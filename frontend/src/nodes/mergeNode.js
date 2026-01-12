// mergeNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MergeNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [mergeType, setMergeType] = useState(data?.mergeType || 'concat');

  useEffect(() => {
    if (data?.mergeType !== mergeType) {
      updateNodeField(id, 'mergeType', mergeType);
    }
  }, [mergeType, id, updateNodeField, data?.mergeType]);

  const handleMergeChange = (e) => {
    setMergeType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="merge"
      title="Merge"
      inputHandles={[
        { id: `${id}-input1`, top: '33.33%' },
        { id: `${id}-input2`, top: '66.66%' }
      ]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Merge Type:</span>
        <select 
          value={mergeType} 
          onChange={handleMergeChange}
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px',
            backgroundColor: 'white'
          }}
        >
          <option value="concat">Concatenate</option>
          <option value="join">Join with space</option>
          <option value="zip">Zip</option>
          <option value="intersect">Intersect</option>
        </select>
      </label>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
        Combines multiple inputs
      </div>
    </BaseNode>
  );
}

