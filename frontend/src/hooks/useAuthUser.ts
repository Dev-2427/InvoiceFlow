import authStore from "../store/authStore"

export default function useAuthUser() {

    const user = authStore((state) => state.user)

    if (!user) {
        throw new Error("Authenticated user is not available");
    }

    return user
}