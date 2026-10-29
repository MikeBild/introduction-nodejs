import $ from 'jqlite';
export function render() {
  return `
  <div id="login">
    <h1>Login ...</h1>
    <button onclick="goToRegister()">Go to register</button>
  </div>
  `;
}

window.goToRegister = () => {
  $('#register').show();
  $('#login').hide();
};

export default render;
