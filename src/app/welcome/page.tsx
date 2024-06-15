import { hidePageForUser } from "@/utils/auth";
import { LoginButton } from "@/components/login-button/login-button.component";

export default async function WelcomePage() {
    await hidePageForUser();

    return (
        <div>
            <h1>Welcome</h1>

            <div className="w-1/3">
                <div className="flex flex-col gap-2">
                    <LoginButton label="Sign in with default provider"/>
                    <LoginButton provider="apple" label="Sign in with Apple"/>
                    <LoginButton provider="google" label="Sign in with Google"/>
                </div>
            </div>
        </div>
    );
}