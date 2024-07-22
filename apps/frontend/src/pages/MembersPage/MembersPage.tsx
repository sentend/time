import { Input } from "@/shared/ui";
import React, { ChangeEvent, useEffect, useState, useTransition } from "react";

const MembersPage = () => {
	const [value, setValue] = useState("");
	const [isPending, startTransition] = useTransition();
	const [todos, setTodos] = useState([]);
	const [filteredTodos, setFilteredTodos] = useState([]);

	// const filterData = () => {
	// 	setFilteredTodos(() => {
	// 		while (performance.now() - startTime < 1) {
	// 			// Do nothing for 1 ms per item to emulate extremely slow code
	// 		}
	// 		return value ? todos.filter((item) => item.body.match(value)) : todos;
	// 	});
	// };

	useEffect(() => {
		fetch("https://jsonplaceholder.typicode.com/comments")
			.then((res) => res.json())
			.then((res) => {
				setTodos([...res]);
				setFilteredTodos([...res]);
			});
	}, []);

	return (
		<>
			<Input
				onChange={(e: ChangeEvent<HTMLInputElement>) => {
					setValue(e.target.value);
					// filterData();
				}}
			/>

			{
				<>
					{filteredTodos.map((item) => (
						<Post value={item.body} />
					))}
				</>
			}
		</>
	);
};

export default MembersPage;

const Post = (props) => {
	const startTime = performance.now();

	while (performance.now() - startTime < 2) {
		// Do nothing for 1 ms per item to emulate extremely slow code
	}

	return props.value;
};
