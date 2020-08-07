import React, { useRef, useCallback } from 'react';
import { Form } from '@unform/web';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { Container, Content, Background, AnimationContainer } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';


import logoImg from '../../assets/logo.svg';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required("E-mail obrigatório.").email("Digite um E-mail válido."),
        password: Yup.string().required("Senha obrigatória.")
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await signIn({
        email: data.email,
        password: data.password
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }
      addToast({
        type: "error",
        title: "Erro na autenticação",
        description: "Ococrreu um erro ao fazer login, verifique suas credenciais."
      });
    }
  },
    [signIn, addToast, history]
  );

  return (
    <Container >

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Logon</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

            <Button type='submit'>Entrar</Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>

          </Form>

          <Link to="/signup">
            <FiLogIn /> Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />

    </Container >
  )

}

export default SignIn;
