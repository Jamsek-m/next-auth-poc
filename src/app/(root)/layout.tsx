export default function AppLayout({ children }: any) {
    return (
        <div>
            <main>
                <div className="flex justify-center">
                    <div className="w-[90%] lg:w-2/3">{children}</div>
                </div>
            </main>
        </div>
    );
}