var trash = document.getElementsByClassName("trash");
var titleToUpdate = ''

// delete shows
Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function() {
        // grab show data
        const email = document.querySelector('#addShow input[name="email"]').value;
        const title = this.parentNode.parentNode.childNodes[1].innerText  

        // send show data to api for deletion
        fetch('delete', {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'email': email,
              'title': title,
            })
          }).then(function (response) {
            window.location.reload()
          })
    })
})

// listen for watched button clicks
const watchedButton = document.querySelectorAll('.watchedBtn')

Array.from(watchedButton).forEach(function(element) {
    element.addEventListener('click', function() {
        // grab show title data
        titleToUpdate = this.parentNode.parentNode.childNodes[1].childNodes[1].innerText 
    })
})

// update shows
const editButton = document.querySelector('#editShowButton');
    
editButton.addEventListener('click', function() {
  // Get updated values from the modal inputs
  const email = document.querySelector('#addShow input[name="email"]').value;
  const rating = document.querySelector('#editShow input[name="rating"]').value;
  const review = document.querySelector('#editShow textarea[name="review"]').value;
  
   // Send updated show data to the server for updates
  fetch('/update', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'email': email,
      'title': titleToUpdate,
      'rating': rating,
      'review': review,
    }),        
    }).then(function(response) {
      window.location.reload();
    });
  });