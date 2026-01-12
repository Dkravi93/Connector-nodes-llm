// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ 
                marginTop: '10px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px',
                justifyContent: 'flex-start'
            }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='condition' label='Condition' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='merge' label='Merge' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='delay' label='Delay' />
            </div>
        </div>
    );
};
