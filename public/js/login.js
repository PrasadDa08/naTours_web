import axios from 'axios';
import '@babel/polyfill';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: 'https://natours-web-e50y.onrender.com/login',
      data: {
        email,
        password,
      },
    });
    console.log(result);
    if (result.data.status === 'success') {
      showAlert('success', 'Logged in Successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (result.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! try again.');
  }
};
