import axios from 'axios';
import '@babel/polyfill';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  console.log(process.env.BACKEND_URL);
  try {
    const result = await axios({
      method: 'POST',
      url: `https://natours-web-e50y.onrender.com/api/v1/users/login`,
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
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: 'GET',
      url: `https://natours-web-e50y.onrender.com/api/v1/users/logout`,
    });

    if (result.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! try again.');
  }
};
