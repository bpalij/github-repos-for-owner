const user = sessionStorage.getItem('githubNameSearch');
if (!user) {
  window.location.href = 'index.html';  // redirecting back on error
} else {
  console.log('start');
  function convertItemObjectToHtmlString(item){
    const html = 
      (`
        <article class="item">
          <section><b>${item.name}</b></section>
          <br/>
          <section>${item.language}</section>
          <section>${item.stargazers_count} stars</section>
          <section>Updated ${item.updated_at}</section>
          <section>${item.fork ? 'Fork' : 'Not fork'}</section>
          <br/>
          <section>${item.description}</section>
        </article>
      `);
      return html;
  };
  let page = 1;
  let allReposLoaded = [];
  fetch(`https://api.github.com/search/repositories?q=user:${user}&per_page=100&page=${page}`) // 100 - maximum on page
  .then((res) => {
    // console.log(res);
    if(res.ok){
      return res.json()
    } else {
      throw new Error(`Fetch error! ${res.status} ${res.statusText}`);
    }
  })
  .then((data) => {
    // console.log(data);
    if(data.items.length===0){
      alert ('No repos found for owner! Go back and try again!');
    } else {
      let lastPage=false;
      if(data.items.length<100) { lastPage=true }
      allReposLoaded = allReposLoaded.concat(data.items);
      // console.log(convertItemObjectToHtmlString(allReposLoaded[0]));
      const show = allReposLoaded.map((x) => convertItemObjectToHtmlString(x)).join('');
      // console.log(show);
      document.getElementById('search-items').innerHTML = show;
      if(lastPage){
        document.getElementById('nextPageLoad').text = 'End reached'
      }  else {
        document.getElementById('nextPageLoad').removeAttribute('disabled');
      }
    }
  })
  .catch(() => alert("Error happened! Go back and try again!"));
}