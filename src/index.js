console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

let imageId = 5098 //Enter the id from the fetched image here

const imageURL = `https://randopic.herokuapp.com/images/${imageId}`

const likeURL = `https://randopic.herokuapp.com/likes/`

const commentsURL = `https://randopic.herokuapp.com/comments/`

const likes = document.getElementById('likes');

const comments = document.getElementById('comments');

const fetchImage = () => {
  fetch(imageURL)
    .then(resp => resp.json())
    .then(image => renderImageContent(image))

}

const renderImageContent = (image) => {
  const imgElem = document.getElementById('image');
  imgElem.src = image['url'];

  const imgName = document.getElementById('name');
  imgName.innerText = image['name'];

  //likes & comments defined in global scope
  likes.innerText = image['like_count'];

  image['comments'].forEach(c => {
    renderComment(c['content'], c['id'])
  })
}

const renderComment = (comm, id) => {
  comments.innerHTML += `<li>${comm}  <button data-id=${id}>X</button></li>`
}

const commentEventListener = () => {
  const commForm = document.getElementById('comment_form');

  commForm.addEventListener('submit', event => {
    event.preventDefault();
    const commInput = document.getElementById('comment_input').value;

    persistComment(commInput);
    const commId = parseInt(comments.lastElementChild.querySelector('button').dataset.id, 10);
    renderComment(commInput, commId);
    commForm.reset();
  })
}

const removeCommentEventListener = () => {
  comments.addEventListener('click', event => {
    event.preventDefault()
    if(event.target.dataset.id) {
      const commElem = document.querySelector(`[data-id~="${event.target.dataset.id}"]`).parentElement;
      commElem.remove();
    }
  })
}

const persistComment = (comm) => {
  reqObj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_id: imageId,
      content: comm
    })
  }
  fetch(commentsURL, reqObj)
}

const likesEventListener = () => {
  const likeBtn = document.getElementById('like_button');

  likeBtn.addEventListener('click', event => {
    event.preventDefault();
    likes.innerText++
    persistLike();
  })
}

const persistLike = () => {
  reqObj = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image_id: imageId })
  }
  fetch(likeURL, reqObj)
}

function main() {
  fetchImage()
  likesEventListener()
  commentEventListener()
  removeCommentEventListener()
}

main()