const runApp = () => {
  displayImageAndInfo()
  likeButtonAddsLikes()
  commentFormAddsComments()
  // i tried to continue the trend of optimistic rendering, but can't get an id til it 
  // goes thru back end so delete button appears upon refresh
  deleteButtonWorks() 

}

//this deletes comment from front end
const deleteButtonWorks = () => {
  const ul = document.getElementById('comments')
  ul.addEventListener('click', handleDeleteClick)
}

//delete from front and back end
const handleDeleteClick = () => {
  if (event.target.tagName === 'BUTTON') {
    event.target.parentElement.remove()
    const commentId = event.target.id
    fetch(`https://randopic.herokuapp.com/comments/${commentId}`, {method: 'DELETE'}).then(r => r.json()).then(comment  => console.log(comment))
  }
}


// comment form adds comments to the front end
commentFormAddsComments = () => {
  const form = document.getElementById('comment_form')
  form.addEventListener('submit', handleSubmit)
}

const handleSubmit = (event) => {
  event.preventDefault()
  const comment = `<li>${event.target[0].value} </li>`
  const ul = document.getElementById('comments')
  ul.innerHTML += comment
  updateCommentsBackEnd(event.target[0].value)
  event.target.reset()
}

// comment form adds comments to the back end
const updateCommentsBackEnd = (submitComment) => {
  reqObj = {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: 5100,
      content: submitComment
    })
  }
  fetch('https://randopic.herokuapp.com/comments', reqObj).then(r => r.json()).then(comment  => console.log('success', comment))
}


// like button adds likes to front end
const likeButtonAddsLikes = () => {
  const likeButton = document.getElementById('like_button')
  likeButton.addEventListener('click', handleButtonClick)
}

const handleButtonClick = () => {
  const likes = document.getElementById('likes')
  likes.innerHTML = parseInt(likes.innerHTML) + 1
  updateLikesBackEnd()
}

// like button adds likes to back end
const updateLikesBackEnd = () => {
  reqObj = {
    method: 'POST',
    body: JSON.stringify({ 
      image_id: 5100
    }),
    headers: { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  fetch('https://randopic.herokuapp.com/likes/', reqObj).then(r => r.json()).then(like => console.log('success', like))
}

// fetch and display image and image info
const displayImageAndInfo = () => {
  const imgTag = document.getElementById('image')
  const nameTag = document.getElementById('name')
  const likeNameTag = document.getElementById('likes')
  const commentTag = document.getElementById('comments')

  fetch('https://randopic.herokuapp.com/images/5100').then(r => r.json())
  .then(image => {
    imgTag.src = image.url
    nameTag.innerText = image.name
    likeNameTag.innerText = image.like_count
    image.comments.forEach(comment => {
      const li = `<li>${comment.content}  -   <button id=${comment.id}>Delete</button></li>`
      commentTag.innerHTML += li
    })
  })
}
runApp()






