document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 5097 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`
  
  fetchImage(imageURL)
  addImageCardListener(likeURL, commentsURL)
  addNewCommentListener(commentsURL)
})

function fetchImage(imageURL) {
  fetch(imageURL)
    .then(resp => resp.json())
    .then(image => {
      populateImageCard(image)
    })
}

function populateImageCard(image) {
  const imageTag = document.querySelector("#image")
  imageTag.src = image.url
  imageTag.dataset.id = image.id
  const imageNameTag = document.querySelector("#name")
  imageNameTag.innerText = image.name
  const likesTag = document.querySelector("#likes")
  likesTag.dataset.imageId = image.id
  likesTag.innerText = image.like_count
  let commentLis = ""
  image.comments.forEach(comment => {
    commentLis += renderExistingCommmentLi(comment)
  })
  const commentsTag = document.querySelector("#comments")
  commentsTag.innerHTML = commentLis
  commentsTag.dataset.imageId = image.id
}



function addImageCardListener(likeURL, commentsURL) {
  const imageCard = document.querySelector("#image_card")
  imageCard.addEventListener("click", event => {
    if(event.target.id === "like_button") {
      const likesNode = event.target.previousSibling.previousSibling.children[0]
      const numLikes = parseInt(likesNode.innerText)
      likesNode.innerText = numLikes + 1
      
      const likeObj = {image_id: likesNode.dataset.imageId}
      fetchPostRequest(likeURL, likeObj)
        .then(newLike => console.log(newLike))

    } else if(event.target.className === "delete_comment") {
      const commentLi = event.target.parentNode
      const deleteURL = commentsURL + commentLi.dataset.id
      const configObj = createDeleteConfigObj()
      fetch(deleteURL, configObj)
        .then(resp => resp.json())
        .then(data => {
          console.log(data.message)
          commentLi.remove()
        })
    }
  })
}

function addNewCommentListener(commentsURL) {
  const form = document.querySelector("#comment_form")
  form.addEventListener("submit", event => {
    event.preventDefault()
    const content = event.target.comment.value
    const commentLi = document.createElement("li")
    commentLi.innerHTML = content + "<br><button class='delete_comment'>Delete</button>"
    const commentsTag = document.querySelector("#comments")
    commentsTag.appendChild(commentLi)
    form.reset()

    const commentObj = {
      image_id: commentsTag.dataset.imageId,
      content: content
    }

    fetchPostRequest(commentsURL, commentObj)
      .then(newComment => {
        commentLi.dataset.id = newComment.id
      })
  })
}


// helper functions

function fetchPostRequest(url, newObj) {
  const configObj = createPostConfigObj(newObj)
  return fetch(url, configObj)
    .then(resp => resp.json())
}

function createPostConfigObj(newObj) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newObj)
  }
}

function createDeleteConfigObj() {
  return {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  }
}

function renderExistingCommmentLi(comment) {
  return `<li data-id=${comment.id}>${comment.content}<br><button class='delete_comment'>Delete</button></li>`
}