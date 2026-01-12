// conditionNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ConditionNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  useEffect(() => {
    if (data?.condition !== condition) {
      updateNodeField(id, 'condition', condition);
    }
  }, [condition, id, updateNodeField, data?.condition]);

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="condition"
      title="Condition"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[
        { id: `${id}-true`, style: { backgroundColor: '#10b981' } },
        { id: `${id}-false`, style: { backgroundColor: '#ef4444' } }
      ]}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Condition:</span>
        <input 
          type="text" 
          value={condition} 
          onChange={handleConditionChange}
          placeholder="value > 0"
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        />
      </label>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
        Routes input based on condition
      </div>
    </BaseNode>
  );
}

