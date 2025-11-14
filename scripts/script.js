// Getting the form inputs and button...
const inputTitle = document.getElementById('inputTitle');
const inputPostText = document.getElementById('inputPostText');
const btnSubmit = document.getElementById('btnSubmit');

// Getting the post template and the post container...
const postTemplate = document.getElementById('template');
const postContainer = document.getElementById('postContainer');

// Getting the container that has the post input fields for later validation
const myForm = document.querySelector('.needs-validation');

// Setting up a list of posts
let postList = [];

// If there are saved posts in local storage, then populate our post list with them, else the post list remains empty
postList = JSON.parse(localStorage.getItem('posts')) || [];

// When the user clicks 'post'...
myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get all the inputs inside the form for validation
    let myInputs = myForm.getElementsByClassName('form-control');

    // If any of the inputs are invalid, attach a Bootstrap class to render the invalid styles on each input field
    if (!myForm.checkValidity()) {
        myForm.classList.add('was-validated');

        // Loop through each input that was invalid to set custom a custom error message
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

    // If the input fields are all valid, then we create a new post object
    let newPost = {
        id: Date.now(),
        title: inputTitle.value,
        content: inputPostText.value
    }

    // Cleanup validation from the form container
    myForm.classList.remove('was-validated');

    // Add a new post to the list
    postList.push(newPost);
    // Render the posts to the page
    renderPosts(postList);
    // Cleanup input fields
    myForm.reset();
})

// Real-time validation for input fields, just checking if the inputs are empty
myForm.addEventListener('input', (e) => {
    // Reseting styles to normal to recheck validation
    const errorMessage = e.target.closest('.form-floating').querySelector('span');
    e.target.setCustomValidity('');
    e.target.classList.remove('is-invalid');
    errorMessage.textContent = e.target.validationMessage;

    // If the input is empty, as that's to only validation I'll check, then set an error message.
    // Form button will now do nothing.
    if (!e.target.checkValidity()) {
        e.target.setCustomValidity('Field must not be empty!');
        errorMessage.textContent = e.target.validationMessage;
        e.target.classList.add('is-invalid');
    }
})

// Logic to render posts to the page
let renderPosts = (posts) => {
    // Whipe the container CLEAN
    postContainer.innerHTML = '';

    // For each post in the list, create a post element (basically a new card)
    // and populate it with the post's data
    // then append to the post container
    posts.forEach(post => {
        const postElement = postTemplate.cloneNode(true);
        // Attach the post object's id to the card's id for easier tracking later
        postElement.id = post.id;
        postElement.querySelector('h5').textContent = post.title;
        postElement.querySelector('p').textContent = post.content;
        postElement.classList.remove('d-none');
        postContainer.appendChild(postElement);
    })
    // Save the posts to local storage
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Event delegation for the dynamically created posts. Each click will check for different button types and do different things
postContainer.addEventListener('click', (e) => {

    // This is the edit button
    if (e.target.classList.contains('btn-primary')) {
        // Get the target card body (where the title and content live)
        // and get the content from the card body for editing
        const cardBody = e.target.closest('.card-body');
        const cardText = cardBody.querySelector('.card-text');

        // Hide both the edit button and remove button
        // Then show a hidden save changes button
        e.target.classList.add('d-none');
        cardBody.querySelector('.btn-danger').classList.add('d-none');
        cardBody.querySelector('.btn-success').classList.remove('d-none');

        // The post content will be converted into a textarea input for editing
        // Then focus on the text area and set the typing bar to the end of the content for easier editing
        cardText.innerHTML = `<textarea class="form-control edit-content" rows="3">${cardText.textContent}</textarea>`;
        cardBody.querySelector('.edit-content').focus();
        cardBody.querySelector('.edit-content').setSelectionRange(cardBody.querySelector('.edit-content').value.length, cardBody.querySelector('.edit-content').value.length);
    }

    // This is the hidden save changes button that appears after clicking on the edit button
    if (e.target.classList.contains('btn-success')) {
        const cardBody = e.target.closest('.card-body');

        // Instead of validation if the text area is empty, we'll just assume you want to remove the post
        // So we call the removePost function and end the function prematurely via return;
        if (cardBody.querySelector('.edit-content').value == '') {
            removePost(e);
            return;
        }

        // If the text area isn't empty, then pick up the specific card's id and match it to the object's id
        // Then change the matching object's content to be whatever is in the text area
        // Then render the posts again to reflect the changes
        const postId = parseInt(e.target.closest('[id]').id);
        const postToEdit = postList.find(post => post.id === postId);
        postToEdit.content = cardBody.querySelector('.edit-content').value;
        renderPosts(postList);
    }

    // This is the remove post button
    if (e.target.classList.contains('btn-danger')) {
        // Simply call our handy removePost function
        removePost(e);
    }
})

// Function to remove a post from the list and re-render the posts
let removePost = (e) => {
    // Get the card's id
    const postId = parseInt(e.target.closest('[id]').id);
    // Normally, .filter() returns a new array with whatever objects that match the id we check
    // This time we inversed it. Now returns an array of posts that DO NOT match the id we check.
    // We set the list of posts to be a new list of posts that's missing the post we "deleted"
    postList = postList.filter(post => post.id !== postId);
    // Re-render the posts to the page
    renderPosts(postList);
}

// Initial render of posts on page load for local storage
renderPosts(postList);