import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("together_user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to read user from storage", e);
        }
    }, []);

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem("together_user", JSON.stringify(user));
            } else {
                localStorage.removeItem("together_user");
            }
        } catch (e) {
            console.error("Failed to write user to storage", e);
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfileColor = (color) => {
        // This function is kept for compatibility but no longer stores in localStorage
        // Color is now stored in the database
    };

    const getProfileColor = () => {
        // Return the color from the user object if available, otherwise default
        return user?.color || "Purple";
    };

    return (
        <UserContext.Provider
            value={{ user, isAuthenticated: !!user, login, logout, updateProfileColor, getProfileColor }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

