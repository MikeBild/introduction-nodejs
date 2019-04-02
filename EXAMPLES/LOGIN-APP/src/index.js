import $ from 'jqlite';
import { render as renderRegister } from './register';
import { render as renderLogin } from './Login';

$('#root').html(`${renderRegister()}${renderLogin()}`);

$('#register').hide();
$('#login').show();
