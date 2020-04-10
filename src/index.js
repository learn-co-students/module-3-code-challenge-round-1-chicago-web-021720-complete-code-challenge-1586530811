document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 5103;

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

  const likeURL = `https://randopic.herokuapp.com/likes/`

  const commentsURL = `https://randopic.herokuapp.com/comments/`

  getPicture(imageURL, likeURL, commentsURL);
})

const getPicture = (imageURL, likeURL, commentsURL) => {
  fetch(imageURL)
  .then(response => {
    return response.json();
  })
  .then(json => {
    let image = json;
    loadImage(image);
    handleLikes(image, likeURL);
    initializeCommentsForm(image, commentsURL);
  })
}


// image
const loadImage = (image) => {
  let img = document.getElementById('image')
  let name = document.getElementById('name')
  
  img.src = image.url
  name.innerHTML = image.name
}


// likes
const handleLikes = (image, url) => {
  let likeCount = image.like_count;
  let likeButton = document.getElementById('like_button')
  let likes = document.getElementById('likes')

  likes.innerHTML = image.like_count

  likeButton.addEventListener('click', () => {
    likeCount++;
    likes.innerHTML = likeCount

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        image_id: 5103
      })
    })
  })
}


// comments
const initializeCommentsForm = (image, url) => {
  let commentForm = document.getElementById('comment_form')
  let commentList = document.getElementById('comments')

  for (const comment of image.comments) {
    let commentItem = document.createElement('li')
    commentItem.innerHTML = comment.content
    commentList.append(commentItem)
  }

  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let newComment = event.target.comment_input.value;
    let newCommentLi = document.createElement('li');
    newCommentLi.innerHTML = newComment;
    commentList.append(newCommentLi);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({
        image_id: 5103,
        content: newComment
      })
    })
    commentForm.reset();
  })
}