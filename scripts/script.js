const inputTitle = document.getElementById('inputTitle');
const inputPostText = document.getElementById('inputPostText');
const btnSubmit = document.getElementById('btnSubmit');

const postTemplate = document.getElementById('template');
const postContainer = document.getElementById('postContainer');

const myForm = document.querySelector('.needs-validation');

let postList = [];

myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let myInputs = myForm.getElementsByClassName('form-control');

    if (!myForm.checkValidity()) {
        myForm.classList.add('was-validated');

        for (const input of myInputs) {
            if (!input.checkValidity()) {
                const errorMessage = input.closest('.form-floating').querySelector('span');
                input.setCustomValidity('Field must not be empty!');
                errorMessage.textContent = input.validationMessage;
                input.classList.add('is-invalid');
            }
        }
        return;
    }

    let newPost = {
        id: Date.now(),
        title: inputTitle.value,
        content: inputPostText.value
    }

    myForm.classList.remove('was-validated');

    postList.push(newPost);
    renderPosts(postList);
    myForm.reset();
})

myForm.addEventListener('input', (e) => {
    const errorMessage = e.target.closest('.form-floating').querySelector('span');
    e.target.setCustomValidity('');
    e.target.classList.remove('is-invalid');
    errorMessage.textContent = e.target.validationMessage;

    if (!e.target.checkValidity()) {
        e.target.setCustomValidity('Field must not be empty!');
        errorMessage.textContent = e.target.validationMessage;
        e.target.classList.add('is-invalid');
    }
})

let renderPosts = (posts) => {
    postContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = postTemplate.cloneNode(true);
        postElement.id = post.id;
        postElement.querySelector('h5').textContent = post.title;
        postElement.querySelector('p').textContent = post.content;
        postElement.classList.remove('d-none');
        postContainer.appendChild(postElement);
    })
}

postContainer.addEventListener('click', (e) => {

    if (e.target.classList.contains('btn-primary')) {
        const cardBody = e.target.closest('.card-body');
        const cardText = cardBody.querySelector('.card-text');

        e.target.classList.add('d-none');
        cardBody.querySelector('.btn-danger').classList.add('d-none');
        cardBody.querySelector('.btn-success').classList.remove('d-none');

        cardText.innerHTML = `<textarea class="form-control edit-content" rows="3">${cardText.textContent}</textarea>`;
        cardBody.querySelector('.edit-content').focus();
        cardBody.querySelector('.edit-content').setSelectionRange(cardBody.querySelector('.edit-content').value.length, cardBody.querySelector('.edit-content').value.length);
    }

    if (e.target.classList.contains('btn-success')) {
        const cardBody = e.target.closest('.card-body');

        if (cardBody.querySelector('.edit-content').value == '') {
            removePost(e);
            return;
        }

        const postId = parseInt(e.target.closest('[id]').id);
        const postToEdit = postList.find(post => post.id === postId);
        postToEdit.content = cardBody.querySelector('.edit-content').value;
        renderPosts(postList);
    }

    if (e.target.classList.contains('btn-danger')) {
        removePost(e);
    }
})

let removePost = (e) => {
    const postId = parseInt(e.target.closest('[id]').id);
    postList = postList.filter(post => post.id !== postId);
    renderPosts(postList);
}