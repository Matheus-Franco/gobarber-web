import React, { useRef, useCallback, useContext } from 'react';
import { Form } from '@unform/web'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import { Link } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';

import { Container, Content, Background, AnimationContainer } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';


import logoImg from '../../assets/logo.svg';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required("E-mail obrigatório.").email("Digite um E-mail válido."),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      // Recuperação de Senha

      // history.push('/dashboard')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors)

        return;
      }
      addToast({
        type: "error",
        title: "Erro na recuperação de senha",
        description: "Ocorreu um erro ao tentar recuperar a senha, tente outra vez."
      })
    }
  },
    [addToast]
  )



  return (
    <Container >

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type='submit'>Recuperar</Button>

          </Form>

          <Link to="/">
            <FiLogIn /> Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />

    </Container >
  )

}

export default ForgotPassword;
