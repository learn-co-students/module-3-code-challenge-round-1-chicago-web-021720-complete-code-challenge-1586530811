// Global constants
const imageId = 5099  //Enter the id from the fetched image here
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`

// Global constant nodes
const commentsList = document.querySelector('#comments')

// Fetch helper functions
const parseRespJSON = response => response.json() 
const logError = error => console.log(error) 

// Make a delete <button> node for deleting a comment
const makeCommentDeleteButton = () => {
  const button = document.createElement('button')
  button.innerText = 'Delete'
  return button
}

// Make a <li> node for a comment that exists on the backend, and add it to the comments <ul>
const addExistingCommentLi = comment => {
  const li = document.createElement('li')
  li.innerText = comment.content
  li.dataset.id = comment.id
  li.appendChild(makeCommentDeleteButton())
  commentsList.appendChild(li)
}

// Make a <li> node for a comment (text), and add it to the comments <ul>
const addNewCommentLi = commentText => {
  const li = document.createElement('li')
  li.innerText = commentText
  li.appendChild(makeCommentDeleteButton())
  commentsList.appendChild(li)
  return li  // Return the <li> node so we can add a `data-id` attribute to it later
}

// Display an image on the page using the fetched data
const displayImage = (image) => {
  
  const img = document.querySelector('#image')
  img.src = image.url

  const h4 = document.querySelector('#name')
  h4.innerText = image.name
  
  const likesSpan = document.querySelector('#likes')
  likesSpan.innerText = image.like_count

  image.comments.forEach(addExistingCommentLi)
}

// Make a fetch request to get image data
const fetchAndDisplayImage = () => {  
  fetch(imageURL)
    .then(parseRespJSON)
    .then(displayImage)
    .catch(logError)
}

// Handle clicks on the like button
const handleLikeButtonClick = (event) => {
  
  // Update the frontend first (optimistic)
  const likesSpan = document.querySelector('#likes')
  const currentLikes = parseInt(likesSpan.innerText)
  likesSpan.innerText = currentLikes + 1

  // Update the backend second
  const reqObj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId
    })
  }
  
  fetch(likeURL, reqObj).catch(logError)
}

// Listen for clicks on the like button
const addLikeButtonListener = () => {
  const likeButton = document.querySelector('#like_button')
  likeButton.addEventListener('click', handleLikeButtonClick)
}

// Handle clicks on the comment form submit button
const handleFormSubmitButtonClick = (event) => {
  // Prevent form from submitting, scrape the data off the form
  event.preventDefault()
  const commentInput = event.target.previousElementSibling
  const inputText = commentInput.value

  // Update the frontent first (optimistic)
  const li = addNewCommentLi(inputText)  // Create the comment <li> and add it to the comments <ul>
  commentInput.value = ''  // Clear the input field

  // Update the backend second
  const reqObj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId,
      content: inputText
    })
  }
  
  fetch(commentsURL, reqObj)
    .then(parseRespJSON)
    .then(comment => {
      li.dataset.id = comment.id  // Add the `data-id` attribute to the already created <li> node
    })
    .catch(logError)
}

// Listen for clicks on the comment form submit button
const addFormSubmitButtonListener = () => {
  const submitButton = document.querySelector('#comment_form').querySelector('input[type=submit]')
  submitButton.addEventListener('click', handleFormSubmitButtonClick)
}

const handleCommentsListClick = (event) => {
  // Only act on clicks on delete buttons
  if (event.target.matches('button')) {
    const commentLi = event.target.parentElement

    // Delete the comment from the backend first (pessimistic)
    const reqObj = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    
    // Make the delete request and conditionally update the frontend
    fetch(`${commentsURL}${commentLi.dataset.id}`, reqObj)
      .then(parseRespJSON)
      .then(resp => {
        if (resp.message === 'Comment Successfully Destroyed') {
          commentLi.remove()  
        } else {
          console.log('ERROR:', resp)
        }
      })
      .catch(logError)
  }
}

// Listen for clicks on the comments list
const addCommentsListListener = () => {
  commentsList.addEventListener('click', handleCommentsListClick)
}

// Collect everything in a main function
const main = () => {
  fetchAndDisplayImage()
  addLikeButtonListener()
  addFormSubmitButtonListener()
  addCommentsListListener()
}

// Execute main function
main()
