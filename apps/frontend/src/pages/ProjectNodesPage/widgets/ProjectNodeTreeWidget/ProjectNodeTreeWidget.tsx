import Toolbar from "./ui/Toolbar";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";
import { useState } from "react";
import { NodeType, NodeTypes, TNodeExtended } from "./constants";
import { TNode, TTask } from "~types/models";
import { useDrop } from "react-dnd";
import { cn } from "@/shared/utils";
import { useSearchParams } from "react-router-dom";
import { Nullable } from "~types/supportTypes";
import NodeTree from "./ui/NodeTree";
import { FolderEditorValues } from "./ui/InlineFolderEditor";
import { CreateFolderServiceInput, CreateTaskServiceInput } from "~types/services";
import { TaskEditorValues } from "./ui/InlineTaskEditor";

type ProjectNodeTreeWidgetProps = {
	projectId: string;
	projectColorId: number;
};

const hydrateEffectiveColorIdsNodes = (nodes: TNode[], projectColorId: number): TNodeExtended[] => {
	const getColorIdForNode = (node: TNode): number => {
		if (node.colorId !== undefined) {
			return node.colorId;
		}
		if (node.parentId === null) {
			return projectColorId;
		}
		const parent = nodes.find((n) => n.id === node.parentId);
		if (!parent) {
			return projectColorId;
		}
		return getColorIdForNode(parent);
	};

	return nodes.map((node) => ({
		...node,
		effectiveColorId: getColorIdForNode(node),
	}));
};

const ProjectNodeTreeWidget = ({ projectId, projectColorId }: ProjectNodeTreeWidgetProps) => {
	const [nodes, setNodes] = useState<TNodeExtended[]>([]);
	const [isFolderCreating, setIsFolderCreating] = useState(false);

	const [queryParams] = useSearchParams();
	const queryClient = useQueryClient();

	const q = queryParams.get("q");
	const isCompleted = queryParams.get("completed");

	const [nodesHavingOpenNewTaskEditor, setNodesHavingOpenNewTaskEditor] = useState<
		Set<string | null>
	>(new Set());

	const { isFetching } = useQuery({
		queryKey: ["project", "nodes", projectId, projectColorId, q, isCompleted],
		queryFn: async () => {
			const params = { q: q ?? "", isCompleted };
			const data = await apiClient.getProjectNodes(projectId, params);
			setNodes(hydrateEffectiveColorIdsNodes(data, projectColorId));
			return data;
		},
		refetchOnWindowFocus: false,
	});

	const { mutate: moveNode, isPending: isMovingNode } = useMutation({
		mutationKey: ["node", "update"],
		mutationFn: async (vars: { nodeId: string; parentId?: string | null; order?: number }) => {
			const { nodeId, order, parentId } = vars;
			const data = await apiClient.moveNode(nodeId, { parentId, order });

			//todo add error handling

			return data;
		},
	});

	const { mutate: deleteNode } = useMutation({
		mutationFn: async (nodeId: string) => {
			const res = await apiClient.deleteNode(nodeId);
			return res;
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["project", "nodes", projectId] });
		},
	});

	const { mutate: markTaskAsCompleted } = useMutation({
		mutationFn: async (taskId: string) => {
			const res = await apiClient.markTaskAsCompleted(taskId);
			return res;
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["project", "nodes", projectId] });
		},
	});

	const { mutate: createTask } = useMutation({
		mutationKey: ["create", "task"],
		mutationFn: async (values: CreateTaskServiceInput) => {
			return apiClient.createTask(values);
		},
		async onSuccess(_, variables) {
			setNodesHavingOpenNewTaskEditor((prev) => {
				const copy = new Set(prev);
				copy.delete(variables.parentId);
				return copy;
			});
			return queryClient.invalidateQueries({
				queryKey: ["project", "nodes", variables.projectId],
			});
		},
	});

	const { mutate: createFolder, isPending: isCreatingFolder } = useMutation({
		mutationKey: ["create", "folder"],
		mutationFn: async (values: CreateFolderServiceInput) => {
			return apiClient.createFolder({ ...values, projectId, parentId: null });
		},
		async onSuccess() {
			setIsFolderCreating(false);
			return queryClient.invalidateQueries({
				queryKey: ["project", "nodes", projectId],
			});
		},
	});

	const handleNodeDelete = (node: TNode) => {
		deleteNode(node.id);
	};

	const handleRowClick = (node: TNode) => {};

	const handleStartPauseClick = (node: TTask) => {};

	const handleMarkNodeCompletedClick = (task: TTask) => {
		if (task.type !== NodeType.task) {
			return;
		}
		if (isCompleted) {
			markTaskAsCompleted(task.id);
		}
	};

	const handleNewTaskClick = (nodeId: Nullable<string>) => {
		setNodesHavingOpenNewTaskEditor((prev) => {
			const copy = new Set(prev);
			copy.add(nodeId);
			return copy;
		});
	};

	const handleNewTaskCancel = (nodeId: Nullable<string>) => {
		setNodesHavingOpenNewTaskEditor((prev) => {
			const copy = new Set(prev);
			copy.delete(nodeId);
			return copy;
		});
	};

	const handleCreateTaskSubmit = (values: TaskEditorValues & { parentId: Nullable<string> }) => {
		createTask({ ...values, projectId });
	};

	const handleCreateFolderSubmit = (
		values: FolderEditorValues & { parentId: Nullable<string> }
	) => {
		createFolder({ ...values, projectId, parentId: null });
	};

	const handleToolbarNewFolderButtonClick = () => {
		setIsFolderCreating(true);
	};

	const [{ isOver }, drop] = useDrop<{ item: TNode; index: number }, unknown, { isOver: boolean }>(
		() => ({
			accept: NodeTypes,
			drop({ item, index }, monitor) {
				if (monitor.didDrop()) {
					return;
				}
				if (item.parentId !== null) {
					setNodes((prev) => {
						const copyPrev = [...prev];
						const movedItemIndex = copyPrev.findIndex((node) => node.id === item.id);
						const movedItem = copyPrev[movedItemIndex]!;
						const newSiblingNodes = copyPrev.filter((node) => node.parentId === null);
						const prevItem = newSiblingNodes[0];
						movedItem!.parentId = null;
						movedItem!.order = prevItem?.id ? prevItem.order / 2 : 1000;
						copyPrev.splice(movedItemIndex, 1);
						copyPrev.unshift(movedItem);
						moveNode({ nodeId: item.id, order: movedItem.order, parentId: null });
						return [...copyPrev];
					});
				} else {
					let movedItemIndex = nodes.findIndex((node) => node.id === item.id);
					if (index === movedItemIndex) {
						return;
					}

					setNodes((prev) => {
						const siblingNodes = nodes.filter((node) => !node.parentId);
						movedItemIndex = siblingNodes.findIndex((node) => node.id === item.id);
						const prevItem = siblingNodes[movedItemIndex - 1];
						const nextItem = siblingNodes[movedItemIndex + 1];
						const draggedItem = siblingNodes[movedItemIndex]!;
						if (!prevItem) {
							draggedItem.order = nextItem?.id ? nextItem?.order / 2 : 1000;
						} else if (!nextItem) {
							draggedItem.order = prevItem.id ? prevItem.order + 100 : 1000;
						} else {
							draggedItem.order = (prevItem.order + nextItem.order) / 2;
						}
						moveNode({ nodeId: item.id, order: item.order });
						return [...prev];
					});
				}
			},
			collect(monitor) {
				return {
					isOver: monitor.isOver({ shallow: true }),
				};
			},
		}),
		[nodes]
	);

	return (
		<div className="space-y-5 px-[60px] pb-[60px] w-full">
			<Toolbar onNewFolderButtonClick={handleToolbarNewFolderButtonClick} />
			<div
				ref={drop}
				className={cn({
					"pointer-events-none opacity-60": isMovingNode,
					"bg-slate-200": isOver,
				})}
			>
				<NodeTree
					nodes={nodes}
					defaultNewNodeColorId={projectColorId}
					isFolderEditorOpen={isFolderCreating}
					isFolderUpdating={isCreatingFolder}
					onRowClick={handleRowClick}
					onStartPauseClick={handleStartPauseClick}
					onDeleteNodeClick={handleNodeDelete}
					onMarkTaskAsCompletedClick={handleMarkNodeCompletedClick}
					nodesHavingOpenNewTaskEditor={nodesHavingOpenNewTaskEditor}
					onNewTaskClick={handleNewTaskClick}
					onNewTaskCancel={handleNewTaskCancel}
					onCreateTaskSubmit={handleCreateTaskSubmit}
					onCreateFolderSubmit={handleCreateFolderSubmit}
					onFolderEditorClose={() => setIsFolderCreating(false)}
				/>
			</div>
		</div>
	);
};

export default ProjectNodeTreeWidget;
