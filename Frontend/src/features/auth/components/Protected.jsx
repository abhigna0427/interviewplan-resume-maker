import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../auth.context";

const Protected = ({ children }) => {

    const { user, loading } =
        useContext(AuthContext);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default Protected;