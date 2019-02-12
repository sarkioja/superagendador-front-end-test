const userID = 'sarkioja';
getUser(userID);
getRepos(userID);
getStarredRepos(userID);


// Get data from user
function getUser(user) {
  const xhr = new XMLHttpRequest(),
        api = 'https://api.github.com/users/';

  xhr.open('GET', api+user, true);

  xhr.onload = function() {
    let data = JSON.parse(this.response);

    if (xhr.status >= 200 && xhr.status < 400) {

      // Build a new user
      buildUser(data.name, data.bio, data.avatar_url, data.public_repos);
    } else {
      console.log(xhr.responseText);
    }
  };
  xhr.send();
}


function getRepos(user) {

  const xhr = new XMLHttpRequest(),
        api = `https://api.github.com/users/${user}/repos?sort=updated`;

  xhr.open('GET', api, true);

  xhr.onload = function() {
    let data = JSON.parse(this.response);

    if (xhr.status >= 200 && xhr.status < 400) {

      for (let repos in data) {

        listRepos(data[repos].name, data[repos].description, data[repos].html_url, data[repos].language, data[repos].forks_count);
      }
    } else {
      console.log(xhr.responseText);
    }
  };

  xhr.send();
}

function getStarredRepos(user) {
  const tabStarredCounter = document.querySelector('.tab__counter--starred');
  let starsCounter= 0;

  const xhr = new XMLHttpRequest(),
        api = `https://api.github.com/users/${user}/starred`;

  xhr.open('GET', api, true);

  xhr.onload = function() {
    let data = JSON.parse(this.response);

    if (xhr.status >= 200 && xhr.status < 400) {

      for (let starredRepos in data) {

        listStarredRepos(data[starredRepos].owner.login, data[starredRepos].name, data[starredRepos].description, data[starredRepos].html_url, data[starredRepos].stargazers_count, data[starredRepos].forks_count);
        starsCounter++;
      }

      tabStarredCounter.innerText = starsCounter;

    } else {
      console.log(xhr.responseText);
    }
  };

  xhr.send();
}


// Build User, Repositories and Starred repos

function buildUser(user, bio, avatar, repoCounter) {

  const elName = document.querySelector('.profile-panel__username'),
        elBio = document.querySelector('.profile-panel__bio'),
        elAvatar = document.querySelector('.profile-panel__user-img'),
        elRepoCounter = document.querySelector('.tab__counter--repos');

  elName.innerText = user;
  elBio.innerText = bio;
  elAvatar.src = avatar;
  elRepoCounter.innerText = repoCounter;
}



function listRepos(rName, rDescription, rUrl, rLanguage, rForks_count) {

  let list = document.querySelector('#repos');

  let li = document.createElement('li');
  li.setAttribute('class', 'list-item');

  let h3 = document.createElement('h3');
  h3.setAttribute('class', 'list-item__heading');

  let a = document.createElement('a');
  a.setAttribute('class', 'list-item__title');
  a.href = rUrl;
  a.textContent = rName;

  let p = document.createElement('p');
  p.setAttribute('class', 'list-item__description');
  p.textContent = rDescription;


  h3.appendChild(a);
  li.appendChild(h3);
  li.appendChild(p);


  let span1 = document.createElement('span');
  span1.setAttribute('class', 'list-item__text');
  let spanIconCode = document.createElement('span');
  spanIconCode.setAttribute('class', 'list-item__icon--code');

  if (rLanguage) {
    let languageName = document.createTextNode(rLanguage);
    span1.appendChild(spanIconCode);
    span1.appendChild(languageName);
  } else {
    let languageName = document.createTextNode('text');
    span1.appendChild(spanIconCode);
    span1.appendChild(languageName);
  }

  li.appendChild(span1);


  let span2 = document.createElement('span');
  span2.setAttribute('class', 'list-item__text');
  let spanIconFork = document.createElement('span');
  spanIconFork.setAttribute('class', 'list-item__icon--fork');

  if (rForks_count) {
    let counter = document.createTextNode(rForks_count);
    span2.appendChild(spanIconFork);
    span2.appendChild(counter);
  } else {
    let counter = document.createTextNode('0');
    span2.appendChild(spanIconFork);
    span2.appendChild(counter);
  }

  li.appendChild(span2);

  list.appendChild(li);
}


function listStarredRepos(sOwner, sName, sDescription, sUrl, sStars_count, sForks_count) {

  let list = document.querySelector('#starred');

  let li = document.createElement('li');
  li.setAttribute('class', 'list-item');

  let h3 = document.createElement('h3');
  h3.setAttribute('class', 'list-item__heading');

  let a = document.createElement('a');
  a.setAttribute('class', 'list-item__title');
  a.href = sUrl;
  let textName = document.createTextNode(sName);

  let spanTitle = document.createElement('span');
  spanTitle.setAttribute('class', 'list-item__title--user');
  spanTitle.textContent = sOwner + ' / ';
  a.appendChild(spanTitle);
  a.appendChild(textName);

  let p = document.createElement('p');
  p.setAttribute('class', 'list-item__description--starred');
  p.textContent = sDescription;


  h3.appendChild(a);
  li.appendChild(h3);
  li.appendChild(p);

  if (sStars_count) {
    let span1 = document.createElement('span');
    span1.setAttribute('class', 'list-item__text');
    let spanIconStar = document.createElement('span');
    spanIconStar.setAttribute('class', 'list-item__icon--star');
    let stars = document.createTextNode(sStars_count);
    span1.appendChild(spanIconStar);
    span1.appendChild(stars);
    li.appendChild(span1);
  }

  if (sForks_count) {
    let span2 = document.createElement('span');
    span2.setAttribute('class', 'list-item__text');
    let spanIconFork = document.createElement('span');
    spanIconFork.setAttribute('class', 'list-item__icon--fork');
    let counter = document.createTextNode(sForks_count);
    span2.appendChild(spanIconFork);
    span2.appendChild(counter);
    li.appendChild(span2);
  }

  list.appendChild(li);
}


function tabs(e) {
  const tabRepos = document.querySelector('#tab-repos'),
        tabStarred = document.querySelector('#tab-starred'),
        ulRepos = document.querySelector('#repos'),
        ulStarred = document.querySelector('#starred');

  if (e.target.id == 'link-starred') {

    tabRepos.classList.remove('tab--selected');
    tabStarred.classList.add('tab--selected');
    ulRepos.classList.add('hide');
    ulStarred.classList.remove('hide');
  } else {

    tabStarred.classList.remove('tab--selected');
    tabRepos.classList.add('tab--selected');
    ulStarred.classList.add('hide');
    ulRepos.classList.remove('hide');
  }
}

function search() {

  const ulRepos = document.querySelector('#repos'),
        ulStarred = document.querySelector('#starred'),
        search = document.querySelector('#search'),
        filter = search.value.toUpperCase();
  let ul;

  if (ulRepos.classList.contains('hide')) {
    ul = ulStarred;
  } else {
    ul = ulRepos;
  }

  let li = ul.querySelectorAll('.list-item');

  [...li].forEach(item => {
    let h3 = item.childNodes[0],
        searchText = h3.textContent || h3.innerText;

    if (searchText.toUpperCase().indexOf(filter) > -1) {
      item.classList.remove('hide');
    } else {
      item.classList.add('hide');
    }
  });
}
