import { useRef } from "react";

import { cn } from "@/shared/utils";
import { TNode, TTask } from "~types/models";
import { Nullable } from "~types/supportTypes";

import NewTaskRow from "./NewTaskRow";
import NodeTreeItem from "./NodeTreeItem";
import { TNodeExtended } from "../constants";
import { TaskEditorValues } from "./InlineTaskEditor";
import InlineFolderEditor, { FolderEditorValues } from "./InlineFolderEditor";

type NodeTreeProps = {
	nodes: TNodeExtended[];
	parentNodeId?: string | null;
	depth?: number;
	searchString?: string;
	defaultNewNodeColorId: number;
	isFolderEditorOpen?: boolean;
	isFolderUpdating?: boolean;
	nodesHavingOpenNewTaskEditor: Set<string | null>;
	onRowClick: (node: TNode) => void;
	onStartPauseClick: (node: TTask) => void;
	onDeleteNodeClick: (node: TNode) => void;
	onMarkTaskAsCompletedClick: (node: TTask) => void;
	onNewTaskClick: (nodeId: Nullable<string>) => void;
	onNewTaskCancel: (nodeId: Nullable<string>) => void;
	onCreateTaskSubmit: (values: TaskEditorValues & { parentId: Nullable<string> }) => void;
	onCreateFolderSubmit?: (values: FolderEditorValues & { parentId: Nullable<string> }) => void;
	onFolderEditorClose?: () => void;
};

const NodeTree = ({
	nodes,
	depth = 0,
	parentNodeId = null,
	searchString,
	defaultNewNodeColorId,
	isFolderEditorOpen,
	isFolderUpdating = false,
	nodesHavingOpenNewTaskEditor,
	onRowClick,
	onStartPauseClick,
	onDeleteNodeClick,
	onMarkTaskAsCompletedClick,
	onNewTaskClick,
	onNewTaskCancel,
	onCreateTaskSubmit,
	onCreateFolderSubmit,
	onFolderEditorClose,
}: NodeTreeProps) => {
	const rootRef = useRef<HTMLUListElement>(null);

	const effectiveNodes = nodes.filter((node) => node.parentId === parentNodeId);

	const handleCreateTaskSubmit = (values: TaskEditorValues) => {
		onCreateTaskSubmit({ ...values, parentId: parentNodeId });
	};

	const handleCreateFolderSubmit = (values: FolderEditorValues) => {
		if (!onCreateFolderSubmit) {
			return;
		}
		onCreateFolderSubmit({ ...values, parentId: parentNodeId });
	};

	const isNewTaskEditorOpen = nodesHavingOpenNewTaskEditor.has(parentNodeId);

	return (
		<ul
			ref={rootRef}
			className={cn("flex flex-col gap-2", {
				"pl-5": depth !== 0,
			})}
		>
			{effectiveNodes.map((node) => {
				return (
					<NodeTreeItem
						key={node.id}
						depth={depth}
						node={node}
						siblingNodes={effectiveNodes}
						nodes={nodes}
						searchString={searchString}
						nodesHavingOpenNewTaskEditor={nodesHavingOpenNewTaskEditor}
						onRowClick={onRowClick}
						onStartPauseClick={onStartPauseClick}
						onDeleteNodeClick={onDeleteNodeClick}
						onMarkTaskAsCompletedClick={onMarkTaskAsCompletedClick}
						onNewTaskClick={onNewTaskClick}
						onNewTaskCancel={onNewTaskCancel}
						onCreateTaskSubmit={onCreateTaskSubmit}
					/>
				);
			})}

			{!isFolderEditorOpen && (
				<NewTaskRow
					defaultColorId={defaultNewNodeColorId}
					onNewTaskClick={() => onNewTaskClick(parentNodeId)}
					onCancel={() => onNewTaskCancel(parentNodeId)}
					onSubmit={handleCreateTaskSubmit}
					isEditing={isNewTaskEditorOpen}
				/>
			)}

			{isFolderEditorOpen && onCreateFolderSubmit && onFolderEditorClose && (
				<InlineFolderEditor
					defaultColorId={defaultNewNodeColorId}
					isUpdating={isFolderUpdating}
					onSubmit={handleCreateFolderSubmit}
					onClose={onFolderEditorClose}
				/>
			)}
		</ul>
	);
};

export default NodeTree;
