const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorCard = document.getElementById('error-card');
const email = document.getElementById('email');

document.getElementById('form').addEventListener('submit', event => {
    event.preventDefault();
    if(password.value !== confirmPassword.value) {
        errorCard.innerHTML = 'Passwords are not the same';
        return errorCard.style.display = 'block';
    };
    const user = {
        username: username.value,
        email: email.value,
        password: password.value
    };
    axios.post('/user/signup', user).then(({ data: { token } }) => {
        localStorage.token = token;
        window.location.assign('/');
    }).catch(setError);
});

function setError({ response }) {
    if(response.status === 400) {
        errorCard.innerHTML = response.data.message.includes('username') ? 'Username is not valid' : 'Password is not valid'
    } else {
        errorCard.innerHTML = response.data.message;
    };
    errorCard.style.display = 'block';
};