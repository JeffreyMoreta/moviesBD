const trash = document.getElementsByClassName("fa-trash");

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const id = this.parentNode.parentNode.childNodes[13].dataset.id
    fetch('/messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': id
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
