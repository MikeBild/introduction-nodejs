import $ from 'jqlite';
export function render() {
  return `
  <div id="register">
    <h1>Register ...</h1>
    <button onclick="goToLogin()">Go to login</button>
  </div>
  `;
}

window.goToLogin = () => {
  $('#register').hide();
  $('#login').show();
};
