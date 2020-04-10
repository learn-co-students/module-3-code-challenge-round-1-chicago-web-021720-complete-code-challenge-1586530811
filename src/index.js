document.addEventListener('DOMContentLoaded', () => {
  console.log('%c DOM Content Loaded and Parsed!', 'color: magenta')

  let imageId = 5102 //Enter the id from the fetched image here

  const imageURL = `https://randopic.herokuapp.com/images/${imageId}`
  const likeURL = `https://randopic.herokuapp.com/likes/`
  const commentsURL = `https://randopic.herokuapp.com/comments/`
  const form = document.getElementById('comment_form');
  const commentList = document.getElementById('comments');

  const getPic= () => {
    fetch(imageURL)
      .then(response => response.json())
      .then(data => {
        document.getElementById('name').innerHTML = data.name;
        document.getElementById('image').src = data.url;
        document.getElementById('likes').innerHTML = data.like_count;
        data.comments.forEach(comment => renderComment(comment.content, comment.id));
      });
  }

  const renderComment = (comment,id) => {
    commentList.innerHTML += `<li>${comment}<button data-id=${id}>X</button></li>`;
  };
  getPic();

  document.getElementById('image_card').addEventListener('click', function(event){
    if(event.target.id === 'like_button'){
      let currentLikes = parseInt(document.getElementById('likes').innerHTML);
      document.getElementById('likes').innerHTML = currentLikes + 1;
      //const URL = 'https://randopic.herokuapp.com/likes';
      const configObj = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                  image_id: imageId,
                  like_count: currentLikes + 1
                  })
      };
      fetch(likeURL, configObj)
        .then(response => console.log(response.json()));
    }
  });

  form.addEventListener('submit',function(event){
    event.preventDefault();
    const newcomment = form.comment.value;
    const configObj = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          image_id: imageId,
          content: newcomment
      })
    };
    fetch(commentsURL,configObj)
      .then(response=>response.json())
      .then(data => {
        console.log(data);
        renderComment(newcomment, data.id);
      });
  });

  commentList.addEventListener('click',function(event){
    if(event.target.tagName === 'BUTTON'){
    const target = event.target;
    const id = target.dataset.id;
    fetch(`${commentsURL}/${id}`,{method: 'DELETE'})
      .then(response => response.json())
      .then(data => target.parentNode.remove());
  }
  });

})
