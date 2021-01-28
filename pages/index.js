import { useRouter} from 'next/router';
import styled from 'styled-components';
import Head from 'next/head';
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';


export default function Home() {
  const  router = useRouter();
  const [name, setName] = React.useState('');

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>The Game Awards Quiz</title>
      </Head>
      <QuizContainer>
        <Widget>
          <Widget.Header>
            <h1>The Game Awards</h1>
          </Widget.Header>
          <Widget.Content>
            <form onSubmit={function(event) {
             event.preventDefault();
             router.push(`/quiz?name=${name}`);

            }}>
              <Input 
              name="nomeDoUsuario"
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite seu Nome" 
              value={name}
              />
              <Button type="submit" disabled={name.length === 0}>
                Jogar 
              </Button>
            </form>
          </Widget.Content>
        </Widget>
        <Widget>
          <Widget.Content>
            <h1>Outros Quizes</h1>

            <p>dale</p>
          </Widget.Content>
        </Widget>
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/Leozardd/thegameawards-quiz" />
    </QuizBackground>
  );
}
