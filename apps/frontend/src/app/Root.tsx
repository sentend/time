import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Root = () => {
    const location = useLocation();
    useEffect(() => {
        console.log(location);
    }, [location]);

    return (
        <div className="text-base bg-main text-primary">
            <Outlet />
        </div>
    );
};

export default Root;
