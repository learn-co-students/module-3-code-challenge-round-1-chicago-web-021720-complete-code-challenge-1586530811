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

// Make a <li> node for a comment that exists on the backend, and add it to the comments <ul>
const addExistingCommentLi = comment => {
  const li = document.createElement('li')
  li.innerText = comment.content
  li.dataset.id = comment.id
  commentsList.appendChild(li)
}

// Make a <li> node for a comment (text), and add it to the comments <ul>
const addNewCommentLi = commentText => {
  const li = document.createElement('li')
  li.innerText = commentText
  commentsList.appendChild(li)
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
  reqObj = {
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


const handleFormSubmitButtonClick = (event) => {
  event.preventDefault()
  const commentInput = event.target.previousElementSibling
  const inputText = commentInput.value

  // Update the frontent first (optimistic)
  addNewCommentLi(inputText)  // Create the comment <li> and add it to the comments <ul>
  commentInput.value = ''     // Clear the input field

}

// Listen for clicks on the comment form submit button
const addFormSubmitButtonListener = () => {
  const submitButton = document.querySelector('#comment_form').querySelector('input[type=submit]')
  submitButton.addEventListener('click', handleFormSubmitButtonClick)
}


// Collect everything in a main function
const main = () => {
  fetchAndDisplayImage()
  addLikeButtonListener()
  addFormSubmitButtonListener()
}

// Execute main function
main()
