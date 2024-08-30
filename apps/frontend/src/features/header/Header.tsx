import { useAppStore } from "@/shared/store";

const Header = () => {
	const { logout } = useAppStore();

	return (
		<div>
			<button onClick={logout}>Logout</button>
		</div>
	);
};

export default Header;
