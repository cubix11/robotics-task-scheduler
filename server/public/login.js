const username = document.getElementById('username');
const password = document.getElementById('password');
const errorCard = document.getElementById('error-card')

document.getElementById('form').addEventListener('submit', event => {
    errorCard.style.display = 'none';
    const user = {
        username: username.value,
        password: password.value
    };
    axios.post('/user/login', user).then(({ data: { token } }) => {
        localStorage.token = token;
        window.location.assign('/');
    }).catch(setError);
    event.preventDefault();
});

function setError({ response }) {
    if(response.status === 400) {
        errorCard.innerHTML = response.data.message.includes('username') ? 'Username is not valid' : 'Password is not valid'
    } else {
        errorCard.innerHTML = response.data.message;
    };
    errorCard.style.display = 'block';
};

function forgot() {
    if(!username.value) {
        errorCard.innerHTML = 'Fill out the username first'
        return errorCard.style.display = 'block';
    };
    axios.post('/user/forgot', { username: username.value }).then(({ data: { username } }) => localStorage.username = username).catch(setError);
};