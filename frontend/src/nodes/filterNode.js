// filterNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  useEffect(() => {
    if (data?.filterValue !== filterValue) {
      updateNodeField(id, 'filterValue', filterValue);
    }
  }, [filterValue, id, updateNodeField, data?.filterValue]);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="filter"
      title="Filter"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Filter Value:</span>
        <input 
          type="text" 
          value={filterValue} 
          onChange={handleFilterChange}
          placeholder="Enter filter criteria"
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        />
      </label>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
        Filters input based on criteria
      </div>
    </BaseNode>
  );
}

