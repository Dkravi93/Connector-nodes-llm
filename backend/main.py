from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Dict, List, Set


app = FastAPI()

# Add CORS middleware to allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Check if the pipeline forms a Directed Acyclic Graph (DAG).
    Uses topological sort algorithm.
    """
    # Build adjacency list and calculate in-degrees
    node_ids = {node['id'] for node in nodes}
    graph: Dict[str, List[str]] = {node_id: [] for node_id in node_ids}
    in_degree: Dict[str, int] = {node_id: 0 for node_id in node_ids}
    
    # Build graph from edges
    for edge in edges:
        source = edge['source']
        target = edge['target']
        
        if source in node_ids and target in node_ids:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Find all nodes with no incoming edges
    queue = [node_id for node_id in node_ids if in_degree[node_id] == 0]
    processed_count = 0
    
    # Process nodes
    while queue:
        node = queue.pop(0)
        processed_count += 1
        
        # Reduce in-degree for all neighbors
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG
    # If there are cycles, some nodes will have in_degree > 0
    return processed_count == len(node_ids)

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        pipeline_data = json.loads(pipeline)
        nodes = pipeline_data.get('nodes', [])
        edges = pipeline_data.get('edges', [])
        
        num_nodes = len(nodes)
        num_edges = len(edges)
        is_dag_result = is_dag(nodes, edges)
        
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': is_dag_result
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail='Invalid JSON format')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
