import $ from 'jqlite';
export function render() {
  return `
  <div id="register">
    <h1>Register ...</h1>
    <fieldset>
      <input type="text" id="username" placeholder="username" />
      <input type="password" id="password" placeholder="password" />
      <input type="password" id="verify" placeholder="verify password" />
      <input type="date" id="birthdate" placeholder="date of birth" />
      <button onclick="registerUser()">Register</button>
    </fieldset>
    <button onclick="goToLogin()">Go to login</button>
  </div>
  `;
}

window.goToLogin = () => {
  $('#register').hide();
  $('#login').show();
};

window.registerUser = () => {
  const username = $('#username').val();
  const password = $('#password').val();
  const verify = $('#verify').val();
  const birthdate = $('#birthdate').val();

  console.log({ username, password, verify, birthdate });
};
