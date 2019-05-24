const user = sessionStorage.getItem('githubNameSearch');
if (!user) {
  window.location.href = 'index.html';  // redirecting back on error
} else {
  // console.log('start');
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
  let minStars = '0';
  let repoType = '';
  let sort = '';
  let allReposLoaded = [];
  function filterStarsCallback(val) {
    return val.stargazers_count >= minStars;
  }
  function filterTypeCallback(val) {
    switch (repoType){
      case 'fork':
        return val.fork;
      case 'source':
        return !(val.fork);
      default:
        return true;
    }
  }
  function sortCallback(a, b) {
    switch (sort){
      case 'name-asc':
        if(a.name>b.name) {return 1}
        if(a.name<b.name) {return -1}
        return 0;
      case 'name-desc':
        if(a.name>b.name) {return -1}
        if(a.name<b.name) {return 1}
        return 0;
      case 'stars-desc':
        return -a.stargazers_count+b.stargazers_count;          
      case 'stars-asc':
        return a.stargazers_count-b.stargazers_count;          
    }
  }
  function filterSort(){
    function checkNumber(val){
      return /^\d+$/.test(val);
    }
    const disabledNextPage=document.getElementById('nextPageLoad').disabled;
    document.getElementById('nextPageLoad').setAttribute("disabled","disabled");
    document.getElementById('filter-sort-button').setAttribute("disabled","disabled");
    let minStarsTemp=document.getElementById('star-field').value;
    if (minStarsTemp==='') {minStarsTemp='0'}
    if (!checkNumber(minStarsTemp)){
      alert('Min stars must contain only digits! Try again!');
      document.getElementById('filter-sort-button').removeAttribute('disabled');
      if (!disabledNextPage) {document.getElementById('nextPageLoad').removeAttribute('disabled')}
      return;
    } else {
      minStars = minStarsTemp;
      repoType = document.getElementById('type-select').value;
      // console.log(repoType);
      sort = document.getElementById('sort-select').value;
      const show = 
        allReposLoaded
          .filter(filterStarsCallback)
          .filter(filterTypeCallback)
          .sort(sortCallback)
          .map(convertItemObjectToHtmlString)
          .join('');
      // console.log(show);
      document.getElementById('search-items').innerHTML = show;
      document.getElementById('filter-sort-button').removeAttribute('disabled');
      if (!disabledNextPage) {document.getElementById('nextPageLoad').removeAttribute('disabled')}
    }
  }
  function addPage(){
    // const disabledNextPage=document.getElementById('nextPageLoad').disabled;
    document.getElementById('nextPageLoad').setAttribute("disabled","disabled");
    document.getElementById('filter-sort-button').setAttribute("disabled","disabled");
    fetch(`https://api.github.com/search/repositories?q=user:${user}&per_page=100&page=${++page}`)
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
          document.getElementById('nextPageLoad').text = 'End reached';
        } else {
          let lastPage=false;
          if(data.items.length<100) { lastPage=true }
          allReposLoaded = allReposLoaded.concat(data.items); //concat is faster than [ ...arr ] and is more semantical for code understanding
          // console.log(convertItemObjectToHtmlString(allReposLoaded[0]));
          const show = 
            allReposLoaded
              .filter(filterStarsCallback)
              .filter(filterTypeCallback)
              .sort(sortCallback)
              .map(convertItemObjectToHtmlString)
              .join('');
          // console.log(show);
          document.getElementById('search-items').innerHTML = show;
          document.getElementById('filter-sort-button').removeAttribute('disabled');
          if(lastPage){
            document.getElementById('nextPageLoad').text = 'End reached';
          }  else {
            document.getElementById('nextPageLoad').removeAttribute('disabled');
          }

          // if (!disabledNextPage) {document.getElementById('nextPageLoad').removeAttribute('disabled')}

          // const show = allReposLoaded.map(convertItemObjectToHtmlString).join('');
          // // console.log(show);
          // document.getElementById('search-items').innerHTML = show;
          // document.getElementById('filter-sort-button').removeAttribute('disabled');
          // if(lastPage){
          //   document.getElementById('nextPageLoad').text = 'End reached'
          // }  else {
          //   document.getElementById('nextPageLoad').removeAttribute('disabled');
          // }
        }
      })
      .catch(() => document.getElementById('nextPageLoad').text = 'Can not get more repos');
  }
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
        allReposLoaded = allReposLoaded.concat(data.items); //concat is faster than [ ...arr ] and is more semantical for code understanding
        // console.log(convertItemObjectToHtmlString(allReposLoaded[0]));
        const show = allReposLoaded.map(convertItemObjectToHtmlString).join('');
        // console.log(show);
        document.getElementById('search-items').innerHTML = show;
        document.getElementById('filter-sort-button').removeAttribute('disabled');
        if(lastPage){
          document.getElementById('nextPageLoad').text = 'End reached';
        }  else {
          document.getElementById('nextPageLoad').removeAttribute('disabled');
        }
      }
    })
    .catch(() => alert('Error happened! Go back and try again!'));
}