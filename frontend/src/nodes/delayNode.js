// delayNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [delayMs, setDelayMs] = useState(data?.delayMs || 1000);

  useEffect(() => {
    if (data?.delayMs !== delayMs) {
      updateNodeField(id, 'delayMs', delayMs);
    }
  }, [delayMs, id, updateNodeField, data?.delayMs]);

  const handleDelayChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setDelayMs(value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      type="delay"
      title="Delay"
      inputHandles={[{ id: `${id}-input` }]}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Delay (ms):</span>
        <input 
          type="number" 
          value={delayMs} 
          onChange={handleDelayChange}
          min="0"
          step="100"
          style={{
            padding: '6px 8px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            fontSize: '13px'
          }}
        />
      </label>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
        Delays execution by specified time
      </div>
    </BaseNode>
  );
}

