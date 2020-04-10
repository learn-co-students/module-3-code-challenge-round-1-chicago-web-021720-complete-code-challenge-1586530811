// Global constants
const imageId = 5099  //Enter the id from the fetched image here
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
const likeURL = `https://randopic.herokuapp.com/likes/`
const commentsURL = `https://randopic.herokuapp.com/comments/`

// Fetch helper functions
const parseRespJSON = response => response.json() 
const logError = error => console.log(error) 

// Make a <li> node for a comment
const makeCommentLi = comment => {
  const li = document.createElement('li')
  li.innerText = comment.content
  li.dataset.id = comment.id
  return li
}

// Display an image on the page using the fetched data
const displayImage = (image) => {
  
  const img = document.querySelector('#image')
  img.src = image.url

  const h4 = document.querySelector('#name')
  h4.innerText = image.name
  
  const likesSpan = document.querySelector('#likes')
  likesSpan.innerText = image.like_count

  const ul = document.querySelector('#comments')
  image.comments.forEach(comment => {
    const li = makeCommentLi(comment)
    ul.appendChild(li)
  })
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
}

// Listen for clicks on the like button
const addLikeButtonListener = () => {
  const likeButton = document.querySelector('#like_button')
  likeButton.addEventListener('click', handleLikeButtonClick)
}

// Collect everything in a main function
const main = () => {
  fetchAndDisplayImage()
  addLikeButtonListener()
}

// Execute main function
main()
