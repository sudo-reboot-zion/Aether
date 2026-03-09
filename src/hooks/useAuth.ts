import {
    showConnect,
} from "@stacks/connect";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import {
    setUserData as ReduxSetUserData,
    setPersona as ReduxSetPersona,
    logout as ReduxLogout,
    UserPersona
} from "@/redux/slices/userSlice";
import { userSession } from "@/lib/stacks";

export function useAuth() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { userData, persona, isLoading } = useSelector((state: RootState) => state.user);

    const appDetails = {
        name: "Aether",
        icon: "/favicon.png"
    };

    const connectWallet = () => {
        showConnect({
            appDetails,
            onFinish: () => {
                const data = userSession.loadUserData();
                dispatch(ReduxSetUserData(data));
                router.push('/collection');
            },
            userSession
        });
    };

    const disconnectWallet = () => {
        userSession.signUserOut();
        dispatch(ReduxLogout());
        router.push('/');
    };

    const setPersona = (newPersona: UserPersona) => {
        dispatch(ReduxSetPersona(newPersona));
    };

    return {
        userData,
        persona,
        isLoading,
        appDetails,
        connectWallet,
        disconnectWallet,
        setPersona,
        isSignedIn: !!userData,
        stxAddress: userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet || null
    };
}