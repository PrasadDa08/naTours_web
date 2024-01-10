import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51OUQyqSBrsofVlVBA3OHLAq9RUspnR6E8eEykaQWeGfy39vN7uHcRJ1Ktt1WHSWoeFWbdENxRqG8scbtHi6AIQIL00ylhrwX0m',
);

export const bookTour = async (tourID) => {
  try {
    // 1) Get Session from API
    const session = await axios(
      `${process.env.BACKEND_URL}/api/v1/bookings/checkout-session/${tourID}`,
    );
    console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
