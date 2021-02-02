import React from 'react';
import { useRouter } from 'next/router';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';
import AlternativesForm from '../src/components/AlternativesForm';
import Lottie from 'react-lottie';
import loadingAnimation from './../src/animations/loading.json';
import checkAnimation from './../src/animations/check.json';
import errorAnimation from './../src/animations/error.json';

function returnResponse(index) {
  if ((index + 1) === 1) {
    return " a resposta correta é Death Stranding";
  } else if ((index + 1) === 2) {
    return " a resposta correta é Shovel Knight";
  } else if ((index + 1) === 3) {
    return " a resposta correta é The Witcher 3";
  } else if ((index + 1) === 4) {
    return " a resposta correta é Final Fantasy VII";
  } else if ((index + 1) === 5) {
    return " a resposta correta é God of War";
  } else if ((index + 1) === 6) {
    return " a resposta correta é 2014";
  } else if ((index + 1) === 7) {
    return " a resposta correta é Cuphead";
  } else {
    return " a resposta correta é Nintendo";
  }
}


function LoadingWidget() {
  const [animationState, setAnimationState] = React.useState({
    isStopped: false, isPaused: false
  });
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <Lottie options={defaultOptions}
          height={400}
          width={400}
          isStopped={animationState.isStopped}
          isPaused={animationState.isPaused}
        />
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results }) {
  const router = useRouter();
  const validCount = results.filter((x) => x).length;
  var message = '';

  return (
    <Widget>
      <Widget.Header>
        <h1>Resultado</h1>
      </Widget.Header>

      <Widget.Content>
        <h3>{`Parabéns, ${router.query.name || 'Usuário'}`}</h3>
        <p>
          Você acertou
          {' '}
          {validCount}
          {' '}
          {validCount === 1 ? 'pergunta' : 'perguntas'}
          {' '}
        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result__${result}`} >
              {index + 1}
              {')'}
              {result === true ? ' Boa,' : ' Errou,'}
              {returnResponse(index)}
              {' '}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;
  const [animationState, setAnimationState] = React.useState({
    isStopped: false, isPaused: false
  });

  const checkOptions = {
    loop: true,
    autoplay: true,
    animationData: checkAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  const errorOptions = {
    loop: true,
    autoplay: true,
    animationData: errorAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <Widget>
      <Widget.Header>
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {' '}
        </p>

        <AlternativesForm
          onSubmit={(event) => {
            event.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 3 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (

              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  checked={isSelected}
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect &&
            <p>
              <Lottie options={checkOptions}
                height={80}
                width={80}
                isStopped={animationState.isStopped}
                isPaused={animationState.isPaused}
              />
            </p>}
          {isQuestionSubmited && !isCorrect && <p>
            <Lottie options={errorOptions}
              height={30}
              width={30}
              isStopped={animationState.isStopped}
              isPaused={animationState.isPaused}
            />
          </p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }


  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    nextQuestion < totalQuestions
      ? setCurrentQuestion(nextQuestion)
      : setScreenState(screenStates.RESULT);
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}