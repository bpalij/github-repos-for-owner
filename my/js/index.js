function button() {
  const user = document.getElementById('name').value;
  if (!user) {
    alert("Please input name");
  } else {
    sessionStorage.setItem('githubNameSearch', user); // prepare to go to next page
    window.location.href = 'search.html';
  }
}