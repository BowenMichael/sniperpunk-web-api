import SignInButton from "../../components/sign-in";
import {Alert, Card, Container } from "react-bootstrap";
import Router from "next/router";
import {GetServerSidePropsContext} from "next";
import { ParsedUrlQuery } from "querystring";
import {useEffect} from "react";
import {useSession} from "next-auth/react";

export async function getServerSideProps(context:  GetServerSidePropsContext)
{
    return {
        props : {
            query : context.query
        }
    }
}


const LoginPage = (props : {query : ParsedUrlQuery}) =>
{
    const {data : session, status} = useSession();
    const {unauthenticated} = props.query;
    useEffect(() =>
    {
        if(session){
            Router.push('/apiUtil');
        }
    }, [session]);
    

    return (<>
        <Container className={'d-flex justify-content-center '}>
            <Card className={'m-5 p-5 w-25 '}>
                {unauthenticated != undefined && <Alert variant={'danger'}>
                    You are not authenticated Check with admin for roles
                </Alert>}
                <Card.Title>Sign In</Card.Title>
                <Card.Body>
                    <SignInButton/>
                </Card.Body>
                
            </Card>
        </Container>
    </>)
}

export default LoginPage;