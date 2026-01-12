// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="llm"
      title="LLM"
      inputHandles={[
        { id: `${id}-system`, top: '33.33%' },
        { id: `${id}-prompt`, top: '66.66%' }
      ]}
      outputHandles={[{ id: `${id}-response` }]}
    >
      <div style={{ fontSize: '13px', color: '#475569' }}>
        This is a LLM node that processes inputs and generates responses.
      </div>
    </BaseNode>
  );
}
