
interface LoginButtonProps {
    provider?: string | null;
    label?: string;
}

export function LoginButton({ provider = null, label = "Sign in" }: Readonly<LoginButtonProps>) {
    return (
        <div className="p-2 border border-gray-200 hover:bg-gray-200 hover:text-black hover:cursor-pointer">
            <form action="/api/login" method="POST">
                {provider && (
                    <input type="hidden" name="providerHint" value={provider}/>
                )}
                <button className="w-full" type="submit">{label}</button>
            </form>
        </div>
    );
}