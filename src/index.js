document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  const imageId = 5101 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`

  const commentForm = document.querySelector('#comment_form')
  const commentsSection = document.querySelector('#comments')
  const likeButton = document.querySelector('#like_button')
  const likeCount = document.querySelector('#likes')

  fetch(imageURL)
  .then(resp => resp.json())
  .then(data => {
    console.log(data)
    document.querySelector('h4').innerText = data.name
    likeCount.innerText = data.like_count
    document.getElementById('image').src = data.url
    data.comments.forEach(comment => {
      const commentLi = `<li dataset-comment-id=${comment.id}>${comment.content}</li>`;
      commentsSection.innerHTML += commentLi;
    })
  })

  likeButton.addEventListener('click', (e) => {

    const data = {
      id: imageId
    }

    e.preventDefault()

    fetch(likeURL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }
    )
    .then(resp => resp.json())
    .then(json => {
      console.log(e.target.id)
      json.like_count = parseInt(json.like_count) + 1 })
  })

  commentForm.addEventListener('submit', (e) => {

    e.preventDefault()

    const data = {
      'id': imageId
    }

    fetch(commentsURL,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }
    )
    .then(resp => resp.json())
    .then(json => {
      const comment = commentForm.querySelector('#comment_input').value
      data.comments.push(comment)
      commentsSection.innerHTML += `<li>${comment}</li><button id="delete_button>Delete Comment</button>`
    })
  })

})