export interface NodeRepository {}

class NodeRepositoryImpl implements NodeRepository {}

export const nodeRepository = new NodeRepositoryImpl();
