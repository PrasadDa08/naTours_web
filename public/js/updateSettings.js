import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updatedSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `${process.env.BACKEND_URL}/api/v1/users/updateMyPassword`
        : `${process.env.BACKEND_URL}/api/v1/users/updateMe`;
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (result.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated Sucessfully`);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
