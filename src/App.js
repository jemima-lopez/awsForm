//import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import {API, graphqlOperation } from 'aws-amplify';
import {createTask} from './graphql/mutations'
import { listTasks } from "./graphql/queries";
import { withAuthenticator, Button, Heading, Alert } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({signOut, user}) {
  const [ task, setTask] = useState({
    name: "",
    description: "",
  });
  const [tasks, setTasks] = useState([]);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(task);
    const result = await API.graphql(graphqlOperation(createTask, {input: task}));
    console.log(result);
  };

  useEffect(() => {
    async function looadTasks(){
      const result = await API.graphql(graphqlOperation(listTasks));
      setTasks(result.data.listTasks.items);
    }
    looadTasks();
  }, []);

  return (
    <>
    <Alert variation="info">Welcome</Alert>
  <Heading level={1}>Hello {user.username}</Heading>
    <form onSubmit={handleSubmit}>
      <input 
      name='name' 
      placeholder='Title'
      onChange={(e) => setTask({ ...task, name: e.target.value})}
      ></input>
      <textarea 
      name='description' 
      placeholder='Description'
      onChange={(e) => setTask({ ...task, description: e.target.value})}
      ></textarea>
      <button>Submit</button>
    </form>

    {tasks.map(task => {
      return <article className = "card card-body">
        <h3>{task.name}</h3>
        <p>{task.description}</p>
        </article>
    })}

    <Button onClick={signOut}>Sign out</Button>
    </>
    
  );
}

export default withAuthenticator(App);
