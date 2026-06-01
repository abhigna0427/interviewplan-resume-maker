import axios from "axios";

const API = axios.create({
    baseURL: "https://interviewplan-resume-maker.onrender.com/api",
    withCredentials: true,
});

export const register = async (data) => {
    try {

        const response = await API.post(
            "/auth/register",
            data
        );

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;
    }
};

export const login = async (data) => {

    try {

        const response = await API.post(
            "/auth/login",
            data
        );

        return response.data;

    } catch (error) {
        throw error;
    }
};

export const getMe = async () => {

    try {

        const response = await API.get(
            "/auth/get-me"
        );

        return response.data;

    } catch (error) {

        if (error.response?.status !== 401) {
            console.error("get-me error:", error);
        }

        return null;
    }
};

export const logout = async () => {

    try {

        const response = await API.post(
            "/auth/logout"
        );

        return response.data;

    } catch (error) {

        console.log(error);

        throw error;
    }
};