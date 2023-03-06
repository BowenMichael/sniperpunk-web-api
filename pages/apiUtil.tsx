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
    Image, ButtonGroup
} from "react-bootstrap";
import {IPostRecord, PlayerRecord} from "../types";
import {CreatePost, DeletePost, GetPosts, UpdatePost} from "../middleware/posts";
import uniqid from 'uniqid'

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
            onDelete: () => void, p: PlayerRecord }) => {
            return (<div key={uniqid()}>
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
                            <div key={uniqid()}>
                                <UserLineItem onDelete={() =>
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
                    <Col xl={"1"}>
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
    
    return(<>
        
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
                            <Posts/>

                            {/*<Tab.Content>
                                <Tab.Pane id={'users'} eventKey={'#users'}>
                                    <Users/>
                                </Tab.Pane>
                                <Tab.Pane id={'posts'} eventKey={'#posts'}>
                                </Tab.Pane>
                            </Tab.Content>
                        */}</Row>
                    </Tab.Container>


                </Card.Body>
            </Card>
        </Container>
    </>)
}

export default Page;