import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import {Card, Container, Row, Col, Button, TabContainer, ListGroup, Tab} from "react-bootstrap";
import {IPostRecord, PlayerRecord} from "../types";
import {CreatePost, DeletePost, GetPosts} from "../middleware/posts";

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props : {
           players : await (await fetch(process.env.API_URL + 'players', {
               method : 'GET'
           })).json() as PlayerRecord[],
            posts : await GetPosts()
        }
    }
}

interface Props {
    players : PlayerRecord[]
    posts : IPostRecord[]
}

const Page = (props : Props) =>{
    const [players, setPlayers] = useState<PlayerRecord[]>(props.players ? props.players : []);
    const [posts, setPosts] = useState<IPostRecord[]>(props.posts ? props.posts : []);

    const [awaiting, setAwaiting] = useState(false);

    if(awaiting) return <>Awaiting</>

    const Users = () => {
        const UserLineItem = (props: {
            key: any;
            onDelete: () => void, p: PlayerRecord }) => {
            return (<div key={props.key}>
                <Row>
                    <Col xl={"1"}>
                        <Button
                            variant={"danger"}
                            onClick={props.onDelete}
                        >
                            Delete
                        </Button>
                    </Col>
                    <Col>
                        <h2>{props.p._id}</h2>
                    </Col>
                </Row>

                <hr/>
            </div>);
        }
        
        return(
            <Card className={'p-3'}>
                <Container className={'p-3'}>
                    <Card.Title>
                        <Row className={'mb-3'}>
                            Users
                        </Row>
                        <Row>
                            <Col>
                                <Button
                                    onClick={() =>
                                    {
                                        setAwaiting(true);
                                        fetch(window.location.origin + '/api/players', {
                                            method: 'POST',
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({})
                                        }).then((value) =>
                                        {
                                            value.json().then((value: PlayerRecord) =>
                                            {
                                                setPlayers([...players, value]);
                                                setAwaiting(false);

                                            })
                                        })
                                    }}>
                                    Create User
                                </Button>
                            </Col>
                            
                        </Row>
                    </Card.Title>
                    <Card.Body >
                        {players.map((p: PlayerRecord) => (
                            <UserLineItem key={p._id} onDelete={() =>
                            {
                                setAwaiting(true);
                                fetch(window.location.origin + '/api/players/' + p._id, {
                                    method: 'DELETE'
                                }).then((value) =>
                                {
                                    if (value.ok) {
                                        setPlayers(players.filter(proj => proj._id !== p._id));
                                    }
                                    setAwaiting(false);
                                })
                            }} p={p}/>
                        ))}
                    </Card.Body>
                </Container>
            </Card>
        );
    } 
    
    const Posts = () => {
        const PostLineItem = (props: { onDelete: () => void, post: IPostRecord }) => {
            return (<div>
                <Row>
                    <Col xl={"1"}>
                        <Button
                            variant={"danger"}
                            onClick={props.onDelete}
                        >
                            Delete
                        </Button>
                    </Col>
                    <Col>
                        <h2>{props.post.name}</h2>
                    </Col>
                    <Col>
                        
                    </Col>
                </Row>

                <hr/>
            </div>);
        }
        
        return (
            <>
                <Card className={'p-3'}>
                    <Card.Title>Posts</Card.Title>
                        <Card.Body className={'p-3'}>
                        <Row className={'mb-3'}>
                            <Col>
                                <Button onClick={()=>{
                                    CreatePost({}).then((newPost)=>{
                                        setPosts([...posts, newPost])
                                    })
                                }}>
                                    Create Post
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            {posts.map((p:IPostRecord)=>(
                                <PostLineItem
                                    onDelete={()=>{
                                        DeletePost(p).then(()=>{
                                            setPosts(posts.filter(post => post._id != p._id));
                                        })
                                    }}
                                    post={p}/>
                            ))}
                        </Row>
                        
                            
                        </Card.Body>
                </Card>
            </>
        );
    }
    return(<>
        <Container className={'p-3'}>
            <Card className={'p-3'}>
                <Card.Title>
                    Sniperpunk web API
                </Card.Title>
                <Card.Body className={'p-3'}>
                    <Tab.Container defaultActiveKey="#link1">
                        <Row className={'mb-3'} >
                            <ListGroup horizontal>
                                <ListGroup.Item action href="#users">Users</ListGroup.Item>
                                <ListGroup.Item action href="#posts">Posts</ListGroup.Item>
                            </ListGroup>
                        </Row>
                        <Row>
                            <Tab.Content>
                                <Tab.Pane eventKey={'#users'}>
                                    <Users/>
                                </Tab.Pane>
                                <Tab.Pane eventKey={'#posts'}>
                                    <Posts/>
                                </Tab.Pane>
                            </Tab.Content>
                        </Row>
                    </Tab.Container>


                </Card.Body>
            </Card>
        </Container>
    </>)
}

export default Page;