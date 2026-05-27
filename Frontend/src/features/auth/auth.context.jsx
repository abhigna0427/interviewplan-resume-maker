import { createContext, useEffect, useState } from "react";
import {
    login,
    register,
    getMe,
    logout
} from "./api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const handleRegister = async (data) => {

        try {

            const response = await register(data);

            setUser(response.user);

            return response;

        } catch (error) {

            throw error;
        }
    };

    const handleLogin = async (data) => {

        try {

            const response = await login(data);

            setUser(response.user);

            return response;

        } catch (error) {

            throw error;
        }
    };

    const handleLogout = async () => {

        try {

            await logout();

            setUser(null);

        } catch (error) {

            console.log(error);
        }
    };

    const getAndSetUser = async () => {

        try {

            const data = await getMe();

            if (data?.user) {
                setUser(data.user);
            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        getAndSetUser();

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                handleLogin,
                handleRegister,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};