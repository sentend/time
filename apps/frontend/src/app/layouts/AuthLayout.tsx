import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="p-4">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
