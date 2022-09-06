import React from 'react';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from "../css/RegistrationForm.module.scss";


/**
 * Sign-in Page
 */
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      email: '',
      password: '',
      code: '',
      userObject: null
    };
  }

  async onSubmitForm(e) {
    e.preventDefault();
    try {
      const userObject = await Auth.signIn(
        this.state.email.replace(/[@.]/g, '|'),
        this.state.password
      );
      console.log('userObject', userObject);
      if (userObject.challengeName) {
        // Auth challenges are pending prior to token issuance
        this.setState({ userObject, stage: 1 });
      } else {
        // No remaining auth challenges need to be satisfied
        const session = await Auth.currentSession();
        // console.log('Cognito User Access Token:', session.getAccessToken().getJwtToken());
        console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
        // console.log('Cognito User Refresh Token', session.getRefreshToken().getToken());
        this.setState({ stage: 0, email: '', password: '', code: '' });
        this.props.history.replace('/app');
      }
    } catch (err) {
      alert(err.message);
      console.error('Auth.signIn(): ', err);
    }
  }

  async onSubmitVerification(e) {
    e.preventDefault();
    try {
      const data = await Auth.confirmSignIn(
        this.state.userObject,
        this.state.code
      );
      console.log('Cognito User Data:', data);
      const session = await Auth.currentSession();
      // console.log('Cognito User Access Token:', session.getAccessToken().getJwtToken());
      console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
      // console.log('Cognito User Refresh Token', session.getRefreshToken().getToken());
      this.setState({ stage: 0, email: '', password: '', code: '' });
      this.props.history.replace('/app');
    } catch (err) {
      alert(err.message);
      console.error('Auth.confirmSignIn(): ', err);
    }
  }

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onCodeChanged(e) {
    this.setState({ code: e.target.value });
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  renderSignIn() {

    return (
      <div className={styles.alignCenter}>
        <header>
          <h1>CRUD de pacientes</h1>
        </header>
        <section >
          <h3>Fazer login</h3>
          <form className={styles.formStyle} id="registrationForm" onSubmit={(e) => this.onSubmitForm(e)}>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email
              </label>
              <input className={styles.formControl} type="email" placeholder="Seu email" value={this.state.email} onChange={(e) => this.onEmailChanged(e)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">
                Senha
              </label>
              <input className={styles.formControl} type="password" placeholder="Sua senha" value={this.state.password} onChange={(e) => this.onPasswordChanged(e)} required />
            </div>
            <div>
              <Button variant="contained" type="submit">Entrar</Button>
            </div>

          </form>
        </section>
      </div>
    );
  }

  renderConfirm() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidCode = this.state.code.length === 6;

    return (
      <div className={styles.alignCenter}>
        <header>
          <h1>Verificar email</h1>
        </header>
        <section>
          <h1>Entre com o MFA Code</h1>
          <form className={styles.formStyle} id="verifyForm" onSubmit={(e) => this.onSubmitVerification(e)}>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email
              </label>
              <input className={styles.formControl} type="email" placeholder="Email" value={this.state.email} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Código
              </label>
              <input className={styles.formControl} type="text" placeholder="Código de verificação" value={this.state.code} onChange={(e) => this.onCodeChanged(e)} />
            </div>
            <div>
              <Button variant="contained" type="submit">Verificar</Button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  render() {
    switch (this.state.stage) {
      case 0:
      default:
        return this.renderSignIn();
      case 1:
        return this.renderConfirm();
    }
  }
}

export default withRouter(SignIn);

