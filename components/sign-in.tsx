﻿import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "react-bootstrap"
export default function SignInButton() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
        <Button onClick={() => signOut()}>Sign out</Button>
        </>
    )
    }
    return (
        <>
            Not signed in <br />
    <Button onClick={() => signIn("google")}>Sign in</Button>
    </>
)
}