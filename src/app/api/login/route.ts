import { signIn } from "@/config/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const providerHint = formData.get("providerHint") as string;

    const params = {
        ...(providerHint && { kc_idp_hint: providerHint })
    };

    await signIn("default", { redirectTo: "/" }, params);
}