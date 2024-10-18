import { useEffect, useRef, useState } from "react";

import { useDrag, useDrop } from "react-dnd";

import { cn } from "@/shared/libs";
import { TNode, TTask } from "~types/models";
import { NodeDropDown } from "@/entities/node";
import { Nullable } from "~types/supportTypes";

import TaskRow from "./TaskRow";
import NodeTree from "./NodeTree";
import FolderRow from "./FolderRow";
import { TaskEditorValues } from "./InlineTaskEditor";
import { NodeType, NodeTypes, TNodeExtended, TTaskExtended } from "../constants";

type TreeNodeProps = {
	node: TNodeExtended;
	nodes: TNodeExtended[];
	depth: number;
	siblingNodes: TNodeExtended[];
	searchString?: string;
	nodesHavingOpenNewTaskEditor: Set<string | null>;
	onRowClick: (node: TNode) => void;
	onStartPauseClick: (node: TTask) => void;
	onDeleteNodeClick: (node: TNode) => void;
	onMarkTaskAsCompletedClick: (node: TTask) => void;
	onNewTaskClick: (nodeId: Nullable<string>) => void;
	onNewTaskCancel: (nodeId: Nullable<string>) => void;
	onCreateTaskSubmit: (values: TaskEditorValues & { parentId: Nullable<string> }) => void;
};

//? moved to dnd-kit?
//todo opimize render (hover method)
//todo clean code
//todo on hoverNode open folder and clone drag node there ? (need to be active inside node to sort order there)
//todo combine change parent and order

const NodeTreeItem = ({
	node: currentNode,
	nodes,
	depth,
	searchString,
	nodesHavingOpenNewTaskEditor,
	onRowClick,
	onStartPauseClick,
	onDeleteNodeClick,
	onMarkTaskAsCompletedClick,
	onNewTaskClick,
	onNewTaskCancel,
	onCreateTaskSubmit,
}: TreeNodeProps) => {
	const ref = useRef<HTMLLIElement>(null);
	const animationTime = useRef<ReturnType<typeof setTimeout>>();

	const [isFolderExpanded, setIsFolderExpanded] = useState(false);

	const isFolder = currentNode.type === NodeType.folder;

	const [{ didDragItemDrop, isDragging }, drag] = useDrag(
		() => ({
			type: NodeTypes[currentNode.type]!,
			item: {
				item: currentNode,
				index: nodes.findIndex((n) => n.id === currentNode.id),
			},
			collect(monitor) {
				return {
					isDragging: monitor.isDragging(),
					didDragItemDrop: monitor.didDrop(),
				};
			},
		}),
		[nodes]
	);

	const [{ isDropOver, item, isDropOverOnNode }, drop] = useDrop<
		{ item: TNode; index: number },
		unknown,
		{ isDropOver: boolean; item: TNode; isDropOverOnNode: boolean }
	>(
		() => ({
			accept: NodeTypes,
			drop({ item, index }, monitor) {
				if (monitor.didDrop()) {
					return;
				}
				//todo make as one with project tasks
				if (item.id !== currentNode.id && item.parentId !== currentNode.id) {
					// setNodes((prev) => {
					// 	const copyPrev = [...prev];
					// 	const movedItemIndex = copyPrev.findIndex((node) => node.id === item.id);
					// 	const newSiblingNodes = nodes.filter((node) => node.parentId === currentNode.id);
					// 	const prevItem = newSiblingNodes[0];
					// 	const movedItem = copyPrev[movedItemIndex]!;
					// 	movedItem!.order = prevItem?.id ? prevItem.order / 2 : 1000;
					// 	movedItem!.parentId = currentNode.id;
					// 	copyPrev.splice(movedItemIndex, 1);
					// 	copyPrev.unshift(movedItem);
					// 	updateNode({ nodeId: item.id, order: movedItem!.order, parentId: currentNode.id });
					// 	return [...copyPrev];
					// });
				} else {
					let movedItemIndex = nodes.findIndex((node) => node.id === item.id);

					if (index === movedItemIndex) {
						return;
					}

					// setNodes((prev) => {
					// 	const siblingNodes = nodes.filter((node) => node.parentId === item.parentId);

					// 	movedItemIndex = siblingNodes.findIndex((node) => node.id === item.id);
					// 	const prevItem = siblingNodes[movedItemIndex - 1];
					// 	const nextItem = siblingNodes[movedItemIndex + 1];
					// 	const draggedItem = siblingNodes[movedItemIndex]!;
					// 	if (!prevItem) {
					// 		draggedItem.order = nextItem?.id ? nextItem?.order / 2 : 1000;
					// 	} else if (!nextItem) {
					// 		draggedItem.order = prevItem.id ? prevItem.order + 100 : 1000;
					// 	} else {
					// 		draggedItem.order = (prevItem.order + nextItem.order) / 2;
					// 	}
					// 	updateNode({ nodeId: item.id, order: item.order });
					// 	return [...prev];
					// });
				}
			},
			canDrop(item, monitor) {
				const isNodeTask = NodeTypes[currentNode.type] === NodeTypes[0];
				return !isNodeTask;
			},
			hover: ({ item }, monitor) => {
				if (!ref.current) {
					return;
				}

				const itemIndex = nodes.findIndex((node) => node.id === item.id)!;
				const hoverItemIndex = nodes.findIndex((n) => n.id === currentNode.id)!;
				const hoverNode = currentNode;

				if (item.id === hoverNode.id) {
					return;
				}
				const hoverBoundingRect = ref.current?.getBoundingClientRect();
				const topBound = 10; //(hoverBoundingRect!.bottom - hoverBoundingRect!.top) * 0.15;
				const lowBound = 40; //(hoverBoundingRect!.bottom - hoverBoundingRect!.top) * 0.85;
				const clientOffset = monitor.getClientOffset();
				const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

				if (itemIndex < hoverItemIndex && hoverClientY < lowBound) {
					return;
				}

				if (itemIndex > hoverItemIndex && hoverClientY > topBound) {
					return;
				}

				if (!animationTime.current) {
					console.log("animationTime", animationTime.current);

					// setNodes((prev) => {
					// 	const copyPrev = [...prev];
					// 	const dragItemIndex = copyPrev.findIndex((node) => node.id === item.id)!;
					// 	const hoverItemIndex = copyPrev.findIndex((n) => n.id === currentNode.id)!;
					// 	copyPrev.splice(dragItemIndex, 1);
					// 	copyPrev.splice(hoverItemIndex, 0, item);
					// 	animationTime.current = setTimeout(() => {
					// 		clearTimeout(animationTime.current);
					// 		animationTime.current = undefined;
					// 		console.log("cear animationTime", animationTime.current);
					// 	}, 300);
					// 	return [...copyPrev];
					// });
				}
			},

			collect(monitor) {
				return {
					isDropOver: monitor.isOver(),
					isDropOverOnNode: monitor.isOver({ shallow: true }),
					item: monitor.getItem(),
				};
			},
		}),
		[nodes]
	);

	useEffect(() => {
		drop(ref);
		drag(ref);
	}, []);

	return (
		<li
			tabIndex={0}
			data-node-id={currentNode.id}
			data-folder={isFolder}
			ref={ref}
			style={{
				opacity: isDragging ? 0 : 1,
			}}
			className="min-w-0 flex-[1] w-full relative"
		>
			<div className="relative group">
				{isFolder && (
					<FolderRow
						folder={currentNode}
						isRunning={false}
						searchString={searchString}
						className={cn({
							"bg-slate-200": isDropOverOnNode,
						})}
						isExpanded={isFolderExpanded}
						onRowClick={() => {
							setIsFolderExpanded((prev) => !prev);
						}}
					/>
				)}

				{!isFolder && (
					<TaskRow
						task={currentNode as TTaskExtended}
						isRunning={false}
						searchString={searchString}
						className="bg-white px-3"
						onRowClick={onRowClick}
						onStartPauseClick={onStartPauseClick}
					/>
				)}

				<NodeDropDown
					folder={isFolder}
					onDelete={() => {
						onDeleteNodeClick(currentNode);
					}}
					onComplete={() => {
						const currentTask = currentNode as TTaskExtended;
						onMarkTaskAsCompletedClick(currentTask);
					}}
					className={cn(
						"absolute px-3 top-0 h-full -right-0 translate-x-full opacity-0 group-hover:opacity-100"
					)}
				/>
			</div>

			{isFolderExpanded && (
				<NodeTree
					nodes={nodes}
					depth={depth + 1}
					parentNodeId={currentNode.id}
					searchString={searchString}
					defaultNewNodeColorId={currentNode.colorId || 0} // TODO: Use cached colorId
					nodesHavingOpenNewTaskEditor={nodesHavingOpenNewTaskEditor}
					onRowClick={onRowClick}
					onStartPauseClick={onStartPauseClick}
					onDeleteNodeClick={onDeleteNodeClick}
					onMarkTaskAsCompletedClick={onMarkTaskAsCompletedClick}
					onNewTaskClick={onNewTaskClick}
					onNewTaskCancel={onNewTaskCancel}
					onCreateTaskSubmit={onCreateTaskSubmit}
				/>
			)}
		</li>
	);
};

export default NodeTreeItem;
