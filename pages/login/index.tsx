import SignInButton from "../../components/sign-in";
import {Card, Container } from "react-bootstrap";

const LoginPage = () =>
{
    return (<>
        <Container className={'d-flex justify-content-center '}>
            <Card className={'m-5 p-5 w-25 '}>
                <Card.Title>Sign In</Card.Title>
                <Card.Body>
                    <SignInButton/>
                </Card.Body>
            </Card>
        </Container>
    </>)
}

export default LoginPage;