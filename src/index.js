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
      image_id: imageId
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
      json.like_count = parseInt(json.like_count) + 1
    })

    likeCount.innerText = parseInt(likeCount.innerText) + 1
  })

  commentForm.addEventListener('submit', (e) => {

    e.preventDefault()

    const data = {
      image_id: imageId,
      content: commentForm.querySelector('#comment_input').value
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
      commentsSection.innerHTML += `<li>${json.content}</li>`
    })
  })

})