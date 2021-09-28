import React,{useState, FormEvent} from "react";
import {Title, Form, Repositories, Error} from './styles'
import logoImg from '../../assets/logo.svg';
import {FiChevronRight} from 'react-icons/fi';

import api from "../../services/api";

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;

    };
}

const Dashboard: React.FC = () => {

    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>([]);

    async function handleAddRepository (
        event:FormEvent<HTMLFormElement>,
        ): Promise<void> {

            event.preventDefault();


            if (!newRepo) {
                setInputError('Type the author/name of repository');
            }

            try {
                const response = await api.get<Repository>(`repos/${newRepo}`);

                const repository = response.data;

                setRepositories([...repositories, repository]);
                setNewRepo('');
                setInputError('');

            } catch (err) {
                setInputError('Failed to fetch repository')
            }

        //add a new repository
        //consume the API from github
        //save new repository in state

    }


    return (
    <>
        <img src ={logoImg} alt="Github Explorer" />
        <Title>Explore github Repositories</Title>

        <Form hasError={!! inputError} onSubmit = {handleAddRepository}>
            <input
            value= {newRepo}
            onChange  ={(e) => setNewRepo(e.target.value)}
            placeholder="Type the repository name here: "
            />
            <button type="submit">Find</button>
        </Form>

        { inputError && <Error> {inputError} </Error> }

        <Repositories>
            {repositories.map( repository => (
                <a key={repository.full_name} href="#">
                    <img
                    src={repository.owner.avatar_url}
                    alt={repository.owner.login}
                    />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20}/>
                </a>
            ))}
        </Repositories>
    </>
    );

}

export default Dashboard;
