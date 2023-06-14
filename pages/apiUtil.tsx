import { GetServerSidePropsContext } from "next";
import {FormEvent, useRef, useState} from "react";
import {
    Card,
    Container,
    Row,
    Col,
    Button,
    TabContainer,
    ListGroup,
    Tab,
    Modal,
    Form,
    FormControl,
    Image, ButtonGroup, Alert, Spinner, Navbar

} from "react-bootstrap";
import {IPlayerMatchRecord, IPostRecord, IUserRecord, PlayerRecord, roles} from "../types";
import {CreatePost, DeletePost, GetPosts, UpdatePost} from "../middleware/posts";
import uniqid from 'uniqid'
import {GetAPIUrl, PUT_PROPERTIES} from "../middleware/util";
import {useSession} from "next-auth/react";
import Router from "next/router";
import {useEffect} from "react";
import {GetMatchData, GetMatchsByName} from "../middleware/matchData";
import SignInButton from "../components/sign-in";
import {GetUsers} from "../middleware/users";


export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props : {
           players : await (await fetch(GetAPIUrl() + 'players', {
               method : 'GET'
           })).json() as PlayerRecord[],
            posts : await GetPosts(),
            matchData : await GetMatchData(),
            users : await GetUsers()
        }
    }
}

interface Props {
    players : PlayerRecord[]
    users : IUserRecord[]
    posts : IPostRecord[]
    matchData : any[]
}

const Page = (props : Props) =>{
    const [players, setPlayers] = useState<PlayerRecord[]>(props.players ? props.players : []);
    const [users, setUsers] = useState<IUserRecord[]>(props.users ? props.users : []);
    const [posts, setPosts] = useState<IPostRecord[]>(props.posts ? props.posts : []);
    const [loaded, setLoaded] = useState(false);
    const [findPlayer, setFindPlayer] = useState('');
    const [matchData, setMatchData] = useState<IPlayerMatchRecord[]>([]);
    const [loadingMatchData, setLoadingMatchData] = useState(false);

    const [awaiting, setAwaiting] = useState(false);

    const { data: session, status } = useSession()
    const loading = status === "loading"

    useEffect(() =>
    {
        if(!loaded)
        {

            if(session){
                debugger
                
                setLoaded(true);
            }
            
            if(status === "unauthenticated"){
                Router.push('/login?unauthenticated')
                setLoaded(false)
            }
        }
    }, [loaded]);
    //debugger;

    if(awaiting ) return <>Awaiting</>
    if(session?.user?.role != 1)
        return (
            <Container>
                <Alert className={'p-5 mb-3 mt-3'} variant={'danger'}>
                    You are not authenticated Check with admin for roles
                </Alert>
                <SignInButton/>
            </Container>
        )
    if(!loaded && (status != 'authenticated')) return <>Loading</>;
    
    const Users = () => {
        const UserLineItem = (props: {
            onSave: (u : IUserRecord) => void, u: IUserRecord }) => {
            const [user, setUser] = useState(props.u);
            return (<div key={uniqid()}>
                <Row>
                    <Col>
                        <h2>{props.u.email}</h2>
                    </Col>
                    <Col >
                        <Form.Select defaultValue={user?.role} onChange={(e) => setUser({...user, role : Number(e.currentTarget.value)})}>
                            {roles.map((role, idx)=><option key={idx} value={idx}>{role.desc}</option>)}
                        </Form.Select>
                        <Form.Control value={user?.role} type={'number'} disabled/>
                    </Col>
                    <Col>
                        <Button onClick={()=>{props.onSave(user)}}>
                            Save
                        </Button>
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
                                {/*<Button
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
                                </Button>*/}
                            </Col>
                            
                        </Row>
                    </Card.Title>
                    <Card.Body >
                        {users.map((u: IUserRecord) => (
                            <div key={uniqid()}>
                                <UserLineItem onSave={(u) =>
                                {
                                    setAwaiting(true);
                                    fetch(window.location.origin + '/api/users/' + u._id, {
                                        ...PUT_PROPERTIES,
                                        body : JSON.stringify(u)
                                    }).then((value) =>
                                    {
                                        const modifiedUserIndex = users.findIndex(newU => newU._id === u._id);
                                        let newUsers = users;
                                        newUsers[modifiedUserIndex] = u;
                                        setUsers(newUsers)
                                        Router.reload()
                                        setAwaiting(false);
                                    })
                                }} u={u}/>
                            </div>
                            
                        ))}
                    </Card.Body>
                </Container>
            </Card>
        );
    } 
    
    const Posts = () => {
        const PostLineItem = (props: { onDelete: () => void, post: IPostRecord }) => {
            const image = props.post.postImage?.data;
            return (<div key={uniqid()}>
                <Row>
                    <Col sm={"2"}>
                        <ButtonGroup>
                            <Button
                                variant={"danger"}
                                onClick={props.onDelete}
                            >
                                Delete
                            </Button>
                            <CreatePostModal record={props.post}/>
                        </ButtonGroup>
                        
                    </Col>
                    <Col>
                        <h2>{props.post.name}</h2>
                        <a href={props.post.href}>{props.post.href}</a>
                    </Col>
                    <Col>
                        <Image width={"100%"} src={image? String(image) : ''} alt={'image'}/>
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
                                <CreatePostModal/>
                                
                            </Col>
                        </Row>
                        <Row>
                            {posts.map((p:IPostRecord)=>(
                                <div key={uniqid()}>
                                    <PostLineItem
    
                                        onDelete={()=>{
                                            DeletePost(p).then(()=>{
                                                setPosts(posts.filter(post => post._id != p._id));
                                            })
                                        }}
                                        post={p}
                                    />
                                </div>
                            ))}
                                
                        </Row>
                        
                            
                        </Card.Body>
                </Card>
            </>
        );
    }
    const CreatePostModal = (props :{record? :IPostRecord}) =>
    {
        const {record} = props;
        const [createPostModal, setCreatePostModal] = useState(false);
        const [newPost, setNewPost] = useState<IPostRecord>(record ? record : {});

        const inputPostImageRef = useRef<HTMLInputElement>(null);


        const HandleModalHide = () => setCreatePostModal(false);
        const HandleModalShow = () => setCreatePostModal(true);

        const HandleModalSave = (e: FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault();

            CreatePost(newPost).then((newPost) =>
            {
                setPosts([...posts, newPost])
            })
        }

        const HandleModalUpdate = (e: FormEvent<HTMLFormElement>) =>
        {
            e.preventDefault();

            UpdatePost(newPost).then((newPost) =>
            {
                const index = posts.findIndex(post => post._id === newPost._id)
                posts[index] = newPost;
                setPosts(posts)
                Router.push(window.location.pathname);
            })
        }
        
        const HandleModalSubmit = (e : FormEvent<HTMLFormElement>) => {
            record ? HandleModalUpdate(e) : HandleModalSave(e)
            setCreatePostModal(false);
        }

        return (<>
            <Button onClick={HandleModalShow}>
                {record ? 'Edit' : 'Create Post'}
            </Button>
            <Modal show={createPostModal} onHide={HandleModalHide}>
                <Form onSubmit={HandleModalSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Text>Post Name</Form.Text>
                        <Form.Control
                            type={'text'}
                            defaultValue={record ? record.name : ''}
                            onChange={
                                (e) =>
                                    setNewPost(
                                        {
                                            ...newPost,
                                            name: e.currentTarget.value
                                        })
                            }
                        />

                        <Form.Text>Href</Form.Text>
                        <Form.Control
                            type={'text'}
                            defaultValue={record ? (record.href ? record.href : '') : ''}
                            onChange={
                                (e) =>
                                    setNewPost(
                                        {
                                            ...newPost,
                                            href: e.currentTarget.value
                                        })
                            }
                        />

                        <Form.Text>Post Image</Form.Text>
                        {record?.postImage?.data &&
                        <Image
                            className={'mb-3'}
                            width={"100%"}
                            src={
                                record?.postImage?.data ? String(record?.postImage?.data)
                                    : ''}
                            alt={'image'}/>

                        }
                        <Form.Control
                            ref={inputPostImageRef}
                            type={'file'}
                            accept={"image/png"}
                            onChange={e =>
                            {
                                const reader = new FileReader();
                                reader.onloadend = () =>
                                {
                                    setNewPost(
                                        {
                                            ...newPost,
                                            postImage: {data: String(reader.result)}
                                        })
                                    //console.log({Image : String(reader.result)})
                                };
                                if (inputPostImageRef &&
                                    inputPostImageRef.current?.files &&
                                    inputPostImageRef?.current?.files[0] != undefined) {

                                    reader.readAsDataURL(inputPostImageRef?.current?.files[0]);
                                } else {
                                    console.error('failed to read as data url')
                                }


                            }}
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={HandleModalHide}>
                            Close
                        </Button>
                        <Button variant="primary" type={'submit'}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>)
    }

    async function onSubmitFindMatchData(e : FormEvent<HTMLFormElement>) {
        console.log("------Looking for player info");
        setLoadingMatchData(true);
        e.preventDefault();
        GetMatchsByName(findPlayer).then((data)=>{
            setMatchData(data);
            console.log("------Found for player info", data);
            setLoadingMatchData(false);
        });
    }

    return(<>
        <Navbar className={'p-3'} bg="light" expand="lg" sticky={'top'}>
               <Col>
                    <Row>
                        <Col className={'col-md-auto'}>
                            <Navbar.Brand >SNIPERPUNK API</Navbar.Brand>
    
                        </Col>
                        <Col/>
                        <Col className={'col-md-auto'}>
                            <SignInButton/>
                        </Col>
                    </Row>
                </Col>

        </Navbar>
        <Container className={'p-3'}>
            <Card className={'p-3'}>
                <Card.Title>
                    Sniperpunk web API
                </Card.Title>
                <Card.Body className={'p-3'}>
                    <Tab.Container defaultActiveKey="#posts">
                        <Row className={'mb-3'} >
                            <ListGroup horizontal>
                                {/*<a id={'users-tab'}  href="#users">Users</a>
                                <a id={'posts-tab'}  href="#posts">Posts</a>*/}
                            </ListGroup>
                        </Row>
                        <Row>
                            {/*{props.matchData.map((match) => {
                                return <Card className={'p-5'}>
                                    {JSON.stringify(match)}
                                </Card>
                            })}*/}
                            
                            <Posts/>
                            <Users/>

                            <Tab.Content>
                                <Tab.Pane id={'users'} eventKey={'#users'}>
                                </Tab.Pane>
                                <Tab.Pane id={'posts'} eventKey={'#posts'}>
                                </Tab.Pane>
                            </Tab.Content>
                        </Row>
                        <Row>
                            <Card className={'m-3 p-3'}>
                                <Form onSubmit={onSubmitFindMatchData}>
                                    <Form.Control value={findPlayer} onChange={(e)=> setFindPlayer(e.currentTarget.value)} />
                                    <Button type={'submit'}>Search Match Data</Button>
                                </Form>
                                <br/>
                                

                                {!loadingMatchData ? 
                                    <>
                                        <Row>
                                            <Col>
                                                <Form.Text>Win%</Form.Text>
                                                <Form.Control defaultValue={(matchData.filter(match => match.win).length / matchData.length) * 100} disabled/>
                                            </Col>
                                            <Col>
                                                <Form.Text>Wins</Form.Text>
                                                <Form.Control defaultValue={matchData.filter(match => match.win).length} disabled/>
                                            </Col>
                                            <Col>
                                                <Form.Text>Loses</Form.Text>
                                                <Form.Control defaultValue={matchData.filter(match => !match.win).length} disabled/>
                                            </Col>
                                            <Col>
                                                <Form.Text>Total Matches</Form.Text>
                                                <Form.Control defaultValue={matchData.length} disabled/>
                                            </Col>
                                        </Row>
                                        {matchData.map((match)=>{
                                            return <div key={match._id}>
                                                <Card className={'m-3 p-3'}>
                                                    {match.name}
                                                </Card>
                                            </div>
                                        })}
                                    </>: <Spinner/>}
                            </Card>
                            
                            
                        </Row>
                    </Tab.Container>


                </Card.Body>
            </Card>
        </Container>
    </>)
}

export default Page;