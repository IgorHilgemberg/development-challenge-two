import React from 'react';
import { Auth } from 'aws-amplify';
import { withRouter } from 'react-router-dom';
import styles from "../css/RegistrationForm.module.scss";
import Button from '@mui/material/Button';
// import '../css/app.css';

/**
 * Registration Page
 */
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      email: '',
      phone: '',
      password: '',
      confirm: '',
      code: ''
    };
  }

  async onSubmitForm(e) {
    e.preventDefault();
    try {
      const params = {
        username: this.state.email.replace(/[@.]/g, '|'),
        password: this.state.password,
        attributes: {
          email: this.state.email,
          phone_number: this.state.phone
        },
        validationData: []
      };
      const data = await Auth.signUp(params);
      console.log(data);
      this.setState({ stage: 1 });
    } catch (err) {
      if (err === "No userPool") {
        // User pool not defined in Amplify config file
        console.error("User Pool not defined");
        alert("User Pool not defined. Amplify config must be updated with user pool config");
      } else if (err.message === "User already exists") {
        // Setting state to allow user to proceed to enter verification code
        this.setState({ stage: 1 });
      } else {
        if (err.message.indexOf("phone number format") >= 0) { err.message = "Invalid phone number format. Must include country code. Example: +14252345678" }
        alert(err.message);
        console.error("Exception from Auth.signUp: ", err);
        this.setState({ stage: 0, email: '', password: '', confirm: '' });
      }
    }
  }

  async onSubmitVerification(e) {
    e.preventDefault();
    try {
      const data = await Auth.confirmSignUp(
        this.state.email.replace(/[@.]/g, '|'),
        this.state.code
      );
      console.log(data);
      // Go to the sign in page
      this.props.history.replace('/signin');
    } catch (err) {
      alert(err.message);
      console.error("Exception from Auth.confirmSignUp: ", err);
    }
  }

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPhoneChanged(e) {
    this.setState({ phone: e.target.value });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onConfirmationChanged(e) {
    this.setState({ confirm: e.target.value });
  }

  onCodeChanged(e) {
    this.setState({ code: e.target.value });
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  renderSignUp() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidPassword = this.state.password.length > 1;
    const isValidConfirmation = isValidPassword && this.state.password === this.state.confirm;

    return (
      <div className={styles.alignCenter} >

        <section >
          <h1>Realizar cadastro</h1>
          <form className={styles.formStyle} id="registrationForm" onSubmit={(e) => this.onSubmitForm(e)} required>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email
              </label>
              <input className={styles.formControl} type="email" placeholder="Seu email" value={this.state.email} onChange={(e) => this.onEmailChanged(e)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefone">
                Telefone
              </label>
              <input className={styles.formControl} type="phone" placeholder="Seu telefone" value={this.state.phone} onChange={(e) => this.onPhoneChanged(e)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">
                Senha
              </label>
              <input className={styles.formControl} type="password" placeholder="Sua senha" value={this.state.password} onChange={(e) => this.onPasswordChanged(e)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">

              </label>
              <input className={styles.formControl} type="password" placeholder="Confirmar senha" value={this.state.confirm} onChange={(e) => this.onConfirmationChanged(e)} required />
            </div>
            <div>
              <Button variant="contained" type="submit">Registrar</Button>
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

        <section>
          <h1>Verificar email</h1>
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
        return this.renderSignUp();
      case 1:
        return this.renderConfirm();
    }
  }
}

export default withRouter(SignUp);
