import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { PlayerRecord } from "../types";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props : {
           players : await (await fetch(process.env.API_URL + 'players', {
               method : 'GET'
           })).json() as PlayerRecord[]
        }
    }
}

interface Props {
    players : PlayerRecord[]
}

const Page = (props : Props) =>{
    const [players, setPlayers] = useState<PlayerRecord[]>(props.players ? props.players : []);

    const [awaiting, setAwaiting] = useState(false);

    if(awaiting) return <>Awaiting</>

    return(<>
    <Container className={'p-3'}>
        <Card className={'p-3'}>
            <Card.Title>
                Sniperpunk web API
            </Card.Title>
            <Card.Body className={'p-3'}>
                <Card className={'p-3'}>
                    <Card.Title>
                        <Row>
                            Users
                        </Row>
                        <Row>
                            <Button 
                                onClick={()=>{
                                    setAwaiting(true);
                                    fetch(window.location.origin + '/api/players', {
                                        method: 'POST',
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({})
                                    }).then((value)=>{
                                        value.json().then((value : PlayerRecord) =>{
                                            setPlayers([...players, value]);
                                            setAwaiting(false);

                                        })
                                    })
                                }}>
                                Create User
                            </Button>
                        </Row>
                    </Card.Title>
                    <Card.Body className={'p-3'}>
                        {players.map((p:PlayerRecord) => (
                            <>
                                <Row>
                                    <Col xl={'1'}>
                                        <Button 
                                            variant={'danger'}
                                            onClick={()=>{
                                                setAwaiting(true);
                                                fetch(window.location.origin + '/api/players/' + p._id, {
                                                    method: 'DELETE'
                                                }).then((value)=>{
                                                    if(value.ok){
                                                        setPlayers(players.filter(proj => proj._id !== p._id));
                                                    }
                                                    setAwaiting(false);
                                                })
                                            }}
                                        >
                                            Delete
                                        </Button>                                   
                                    </Col>
                                    <Col>
                                        <h2>{p._id}</h2>            
                                    </Col>
                                </Row>

                                <hr/>
                            </>
                        ))}
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    </Container>
    </>)
}

export default Page;