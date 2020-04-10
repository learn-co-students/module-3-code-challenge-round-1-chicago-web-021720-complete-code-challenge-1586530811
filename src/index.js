document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 5096

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const main = () => {
    getImageData();
  }

  const imageCard = document.getElementById("image_card")
  const imageTag = imageCard.querySelector("img") 
  const imageTitle = imageCard.querySelector("h4")
  const likesSpan = document.getElementById("likes")
  const ulComments = document.getElementById("comments")
  const likeButton = document.getElementById("like_button")
  const commentForm = document.getElementById("comment_form")
  

  const getImageData = () => {
    fetch(imageURL)
    .then(resp => resp.json())
    .then(response => {
      console.log(response)
      
      imageTag.src = response.url
      imageTag.dataset.id = imageId
      imageTitle.innerHTML = response.name
      likesSpan.innerHTML = response.like_count

      response.comments.forEach(comment =>{
        ulComments.innerHTML = ulComments.innerHTML + `<li data-user-id=${comment.id}>${comment.content}<button data-comment-id=${comment.id}>Delete</button></li>`
      })
    })
  }

  const addLike = () => {
    likesSpan.innerHTML = parseInt(likesSpan.innerHTML) + 1
  }

  likeButton.addEventListener('click', (event) => {
    addLike();

    configObj = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId
      })
    }

    fetch(likeURL, configObj)
    .then(resp => resp.json())
    .then(response => {
      console.log(response)
    })

  })

  const addDeleteButton = (commentNode) => {

  }

  commentForm.addEventListener('submit', (event) => {
    let commentInput = document.getElementById("comment_input")
    let newLi = document.createElement("li")
    newLi.innerHTML = commentInput.value
    //Using the node method here because I want to add a dataset value to this node without having
    //to requery the document 


    ulComments.append(newLi)

    let configObj = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_id: imageId,
        content: commentInput.value
      })
      
    }

    fetch(commentsURL, configObj)
    .then(resp => resp.json())
    .then(response => {
      let deleteButton = document.createElement("button")
      deleteButton.innerHTML = "Delete"
      deleteButton.dataset.commentId = response.id
      newLi.dataset.userId = response.id
      newLi.append(deleteButton)
    })


    commentInput.value = ""
    event.preventDefault();
  })

  ulComments.addEventListener("click", (event) => {
    if (event.target.tagName == "BUTTON") {
      let commentId = event.target.dataset.commentId
      let liNode = event.target.parentNode

      let configObj = {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment_id: commentId,
        })
      }
    

      fetch(`https://randopic.herokuapp.com/comments/${commentId}`, configObj)
      .then(resp => resp.json())
      .then(response => {
        liNode.remove()
      })
    }
  })


  main()



})
