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

window.registerUser = async () => {
  const username = $('#username').val();
  const password = $('#password').val();
  const verify = $('#verify').val();
  const birthdate = $('#birthdate').val();

  try {
    const response = await fetch('http://localhost:8080/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, verify, birthdate }),
      headers: {
        'content-type': 'application/json',
      },
    });

    if (response.status >= 400 && response.status <= 500) {
      // TODO: message to user
      return console.error(response.statusText);
    }

    goToLogin();
  } catch (e) {
    console.error(e);
  }
};
