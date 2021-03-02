const username = document.getElementById('username');
const password = document.getElementById('password');
const errorCard = document.getElementById('error-card');

document.getElementById('form').addEventListener('submit', event => {
    event.preventDefault();
    errorCard.style.display = 'none';
    axios.post('/user/reset', { username: username.value, email: localStorage.username, password: password.value }).then(response => {
        localStorage.removeItem('username');
        errorCard.innerHTML = 'Password has been updated!';
        errorCard.style.display = 'block';
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