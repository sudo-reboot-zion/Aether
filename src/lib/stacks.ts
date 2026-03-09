import { AppConfig, UserSession } from "@stacks/connect";

export const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const getInitialUserData = () => {
    if (typeof window !== 'undefined' && userSession.isUserSignedIn()) {
        try {
            return userSession.loadUserData();
        } catch (e) {
            console.error("Failed to load user data from session:", e);
            return null;
        }
    }
    return null;
};
