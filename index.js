import Model from './model.js';

window.onload = function () {
  // Buttons
  const tButton = document.getElementById("tButton"); // tags
  const qButton = document.getElementById("qButton"); // questions
  const askQBtn = document.getElementById("askQBtn"); // ask question
  const askQuestionBtnInTag = document.getElementById("askQuestionBtnInTag"); // ask question in tags page
 
  const newestButton = document.getElementById("newestButton");
  const activeButton = document.getElementById("activeButton");
  const unansweredButton = document.getElementById("unansweredButton");

  const qCancel = document.getElementById("qCancel"); // cancel (ask question page)
  const qSubmit = document.getElementById("qSubmit"); // submit (ask question page)

  // Pages
  const homePage = document.getElementById("qPage"); // questions page or homepage
  const askQuesPage = document.getElementById("askQuesPage"); // ask ques page
  const tPage = document.getElementById("tPage"); // tags page
  const answerPage = document.getElementById("answerPage");
  //Objects of tags and question.
  const model = new Model();

  // Function to load questions on the "Questions" page
  function loadQuestions(arr) {
    const qPageQuestions = document.getElementById("qPageQuestions");
    
    if(arr.length !== 0) {
        qPageQuestions.innerHTML = ''; // Clear any existing questions

        document.getElementById("numQuestions").innerHTML = arr.length + " questions";
        const tags = model.getAllTags(); // Assuming you have a method to get all tags

        arr.forEach(question => {
            const qPageSection = document.createElement('div');
            qPageSection.classList.add('qPageSection');

            const qCounter = document.createElement('div');
            qCounter.classList.add('qCounter');

            const ansCounter = document.createElement('span');
            ansCounter.classList.add('ansCounter');
            ansCounter.textContent = (question.ansIds.length) + " answers ";

            const viewCounter = document.createElement('span');
            viewCounter.classList.add('viewCounter');
            viewCounter.textContent = question.views + " views";

            const qTitleTags = document.createElement('div');
            qTitleTags.classList.add('qTitleTags');

            const qTitle = document.createElement('a');
            qTitle.classList.add('qTitle');
            qTitle.id = question.qid;
            qTitle.textContent = question.title;

            // Adding your event listener to the title here
            qTitle.addEventListener('click', function (event) {
                event.preventDefault();

                document.getElementsByClassName('aPageHeader')[0].id = event.target.id;

                homePage.classList.add('noDisplay');
                qButton.classList.remove('youarehere');
                answerPage.classList.remove('noDisplay');

                const questionId = event.target.id;
                const question = model.getQuestionById(questionId);
                const ansIds = question.ansIds;

                console.log(question);
                question.views += 1;

                // HEADER
                document.getElementById('numAnswers').textContent =
                    question.ansIds.length + ' answers';
                document.getElementById('qTitle').textContent = question.title;
                document.getElementById('numViews').textContent =
                    question.views + ' views';
                document.getElementById('qText').textContent = question.text;
                document.getElementById('userAnsrPage').innerHTML = question.askedBy;
                document.getElementById('dateAnsrPage').innerHTML =
                    ' asked ' + model.formattedDateOfQstn(question);

                // ANSWERS
                const container = document.getElementById('aPageAnswers');
                while (container.firstChild) { container.removeChild(container.firstChild); }
                for (let j = 0; j < ansIds.length; j++) {
                    const ansId = ansIds[j];
                    const aPageAnswer = document.createElement('div');
                    aPageAnswer.classList.add('aPageAnswer');

                    const aPageText = document.createElement('p');
                    aPageText.classList.add('aPageText');
                    aPageText.textContent = model.getAnswerById(ansId).text;
                    aPageAnswer.appendChild(aPageText);

                    const aPageAskedBy = document.createElement('div');
                    aPageAskedBy.classList.add('aPageAskedBy');

                    const userAnsrPage = document.createElement('span');
                    userAnsrPage.classList.add('userAnsrPage');
                    userAnsrPage.innerHTML = model.getAnswerById(ansId).ansBy;
                    aPageAskedBy.appendChild(userAnsrPage);

                    const dateAnsrPage = document.createElement('span');
                    dateAnsrPage.classList.add('dateAnsrPage');
                    dateAnsrPage.innerHTML =
                        'answered ' +
                        model.formattedDateOfAns(model.getAnswerById(ansId));
                    aPageAskedBy.appendChild(dateAnsrPage);

                    aPageAnswer.appendChild(aPageAskedBy);

                    container.appendChild(aPageAnswer);
                }

                const answerButton = document.createElement('button');
                answerButton.classList.add('askQuestionButton'); // assuming you'll style it in CSS
                answerButton.textContent = 'Answer Question';

                // Add event listener to the button to handle the functionality
                answerButton.addEventListener('click', function() {
                  
                });

                container.appendChild(answerButton);
            });

            qTitleTags.appendChild(qTitle);

            const qTagsContainer = document.createElement('div');
            qTagsContainer.classList.add('qTagsContainer');

            // Extract and sort the tag names
            const sortedTagNames = question.tagIds
                .map(tagId => {
                    const matchingTag = tags.find(tag => tag.tid === tagId);
                    return matchingTag ? matchingTag.name : null;
                })
                .filter(Boolean) // Filter out any nulls
                .sort();

            sortedTagNames.forEach(tagName => {
                const qTag = document.createElement('a'); // 'a' tag as in your old method
                qTag.classList.add('qTag');
                qTag.textContent = tagName;
                qTagsContainer.appendChild(qTag);

                // QUESTION TAG FUNCTIONALITY
                qTag.addEventListener('click', function (event) {
                    const questions = model.data.questions;
                    const results = [];
                    const aTagId = model.getTidByName(event.target.textContent);
                    for (const question of questions) {
                        if (question.tagIds.includes(aTagId)) {
                            results.push(question);
                        }
                    }
                    /*askQPage.classList.add('noDisplay');
                    qPage.classList.remove('noDisplay');
                    tPage.classList.add('noDisplay');
                    qBtn.classList.add('youarehere');
                    tBtn.classList.remove('youarehere');*/
                    document.getElementById('questionOrSearch').innerHTML = 'All Questions';
                    //display(results);
                    loadQuestions(results);
                });
            });

            const qUserData = document.createElement('div');
            qUserData.classList.add('qUserData');

            const qUser = document.createElement('span');
            qUser.classList.add('qUser');
            qUser.textContent = question.askedBy;

            const qDate = document.createElement('span');
            qDate.classList.add('qDate');
            qDate.textContent = question.askDate;

            qCounter.appendChild(ansCounter);
            qCounter.appendChild(viewCounter);

            qTitleTags.appendChild(qTagsContainer);

            qUserData.appendChild(qUser);
            qUserData.appendChild(qDate);

            qPageSection.appendChild(qCounter);
            qPageSection.appendChild(qTitleTags);
            qPageSection.appendChild(qUserData);

            qPageQuestions.appendChild(qPageSection);
        });
    }
  }
  
  // Submit Ask Question Form
  qSubmit.addEventListener("click", function(event){
    event.preventDefault(); // Prevent the form submission

    const qstnTitle = document.getElementById("quesTitle").value;
    const qstnText = document.getElementById("quesBody").value;
    const quesTags = document.getElementById("quesTags").value;
    const username = document.getElementById("QuName").value;
  
    let invalidTags = false;
    let invalidInput = false;
    // Retrieve the latest questions from the model
    const questions = model.getAllQuestions();
  
    // Bad Tags
    console.log(quesTags)
    const tags = quesTags.split(/\s+/)
    if (quesTags === '') {
    } else {
      for (let i = 0; i < tags.length; i++) {
        console.log(tags.length)
        if (tags.length > 5 || tags.length < 0 || tags[i].length > 10) {
          invalidInput = true
          invalidTags = true
          break
        }
      }
    }

    if (qstnTitle.length > 100 || qstnTitle.length === 0) {
      invalidInput = true
      const titleNode = document.getElementById('quesTitle')

      // Check if error message already exists
      const existingError = titleNode.querySelector('.qstnTitle-error')
      if (!existingError) {
        const errorTextNode = document.createElement('p')
        titleNode.appendChild(errorTextNode)
        errorTextNode.appendChild(
          document.createTextNode('Title is either too long or empty')
        )
        errorTextNode.setAttribute('style', 'color: red;')
        errorTextNode.classList.add('qstnTitle-error')
      }
    } else {
      const elements = document.getElementsByClassName('qstnTitle-error')
      while (elements.length > 0) { elements[0].parentNode.removeChild(elements[0]) }
    }
    if (qstnText.length === 0) {
      invalidInput = true
      const textNode = document.getElementById('questionText')

      // Check if error message already exists
      const existingError = textNode.querySelector('.qstnText-error')
      if (!existingError) {
        const errorTextNode = document.createElement('p')
        textNode.appendChild(errorTextNode)
        errorTextNode.appendChild(
          document.createTextNode('Text cannot be empty')
        )
        errorTextNode.setAttribute('style', 'color: red;')
        errorTextNode.classList.add('qstnText-error')
      }
    } else {
      const elements = document.getElementsByClassName('qstnText-error')
      while (elements.length > 0) { elements[0].parentNode.removeChild(elements[0]) }
    }
    if (username.length === 0) {
      invalidInput = true
      const usernameNode = document.getElementById('questionUsername')

      // Check if error message already exists
      const existingError = usernameNode.querySelector('.username-error')
      if (!existingError) {
        const errorTextNode = document.createElement('p')
        usernameNode.appendChild(errorTextNode)
        errorTextNode.appendChild(
          document.createTextNode('Enter a username')
        )
        errorTextNode.setAttribute('style', 'color: red;')
        errorTextNode.classList.add('username-error')
      }
    } else {
      const elements = document.getElementsByClassName('username-error')
      while (elements.length > 0) { elements[0].parentNode.removeChild(elements[0]) }
    }
    if (invalidTags) {
      invalidInput = true
      tagsInputError()
    } else {
      const elements = document.getElementsByClassName('tags-error')
      while (elements.length > 0) { elements[0].parentNode.removeChild(elements[0]) }
    }

    if (!invalidInput) {
      const qid = 'q' + (model.questionCount() + 1)
      for (let g = 0; g < tags.length; g++) {
        if (model.getTidByName(tags[g]) !== -1) {
          tags[g] = model.getTidByName(tags[g])
        } else {
          const newTagId = 't' + (model.data.tags.length + 1)
          const newTagName = tags[g]
          const newTag = { tid: newTagId, name: newTagName }
          model.insertTag(newTag)
          tags[g] = model.getTidByName(tags[g])
        }
      }
      // var tagClone = tags.splice(); //for now until I have actual tag list to input into qstn object
      const emptyAnsArr = []
      const date = new Date()
      model.data.questions.push({
        qid,
        title: qstnTitle,
        text: qstnText,
        tagIds: tags,
        askedBy: username,
        askDate: date,
        ansIds: emptyAnsArr,
        views: 0
      })
      //document.getElementById('questionsBtn').click()

      restoreHomePage(model.getAllQuestions());
      console.log(model.getAllQuestions());
      console.log(model.getAllTags());

      document.getElementById('quesTitle').value = ''
      document.getElementById('quesBody').value = ''
      document.getElementById('quesTags').value = ''
      document.getElementById('QuName').value = ''
    }
    /*const newQuestion = 
      {
      qid: 'q' + (questions.length + 1),
      title: qstnTitle,
      text: quesBody,
      tagIds: [],
      askedBy: username,
      askDate: new Date(),
      ansIds: [],
      views: 0,
    };
    console.log(qstnTitle)
    console.log(newQuestion)

    model.data.questions.push(newQuestion);
    loadQuestions(questions);
    console.log(model.getAllQuestions())
    restoreHomePage();*/
  });


  // Function to switch to the "Ask a Question" page
  function goToAskQuestionPage() {
    homePage.classList.add("noDisplay");
    tPage.classList.add("noDisplay");
    askQuesPage.classList.remove("noDisplay");
    answerPage.classList.add("noDisplay");
  }
  
  // Function to switch to the "Tags" page
  function goToTagsPage() {
    makeTagsFunction();
    homePage.classList.add("noDisplay");
    askQuesPage.classList.add("noDisplay");
    tPage.classList.remove("noDisplay");
    answerPage.classList.add("noDisplay");
  }
  
  // Function to switch back to the "Questions" page
  function restoreHomePage(arr) {
    loadQuestions(arr);
    homePage.classList.remove("noDisplay");
    askQuesPage.classList.add("noDisplay");
    tPage.classList.add("noDisplay");
    answerPage.classList.add("noDisplay");
    // quesForm.reset(); //  reset the form if needed
  }

  function goToAnswerPage() {
    homePage.classList.add("noDisplay");
    qButton.classList.remove("youAreHere");
    answerPage.classList.remove("noDisplay");
  }
  
  // Event listeners
  askQBtn.addEventListener("click", goToAskQuestionPage);
  document.getElementById("askQuestionBtnAnsrPage").addEventListener("click", goToAskQuestionPage);
  qCancel.addEventListener("click", function () {
    restoreHomePage(model.getAllQuestions());
  });
  qButton.addEventListener("click", function () {
    restoreHomePage(model.getAllQuestions());
  });
  tButton.addEventListener("click", goToTagsPage);
  askQuestionBtnInTag.addEventListener("click", goToAskQuestionPage); 

  // Search Bar
  const searchBar = document.getElementById('realSearchBar')
  document
  .getElementsByClassName("searchBar")[1]
  .addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
      const searchString = searchBar.value
      const questions = model.data.questions
      const words = searchString.trim().toLowerCase().split(/\s+/)
      const results = []

      for (const question of questions) {
        let matchFound = false
        for (const word of words) {
          if (
            !word.startsWith('[') &&
            !word.endsWith(']') &&
            (question.title.toLowerCase().includes(word) ||
              question.text.toLowerCase().includes(word))
          ) {
            matchFound = true
            break
          }
        }
        for (const word of words) {
          if (word.startsWith('[') && word.endsWith(']')) {
            const tagName = word.slice(1, -1)
            if (
              question.tagIds.some(
                (tagId) =>
                  model.data.tags
                    .find((tag) => tag.tid === tagId)
                    .name.toLowerCase() === tagName.toLowerCase()
              )
            ) {
              matchFound = true
              break
            }
          }
        }
        if (matchFound) {
          results.push(question)
        }
      }
      results.map((question) => model.data.questions.indexOf(question))

      document.getElementById('questionOrSearch').innerHTML = 'Search Results'
      document.getElementById('numQuestions').innerHTML = results.length + ' questions'
      console.log(results)
      loadQuestions(results)
    }
  });
  
  // make tags page div
  function makeTagsFunction() {
    const tags = model.getAllTags();
    const qs = model.getAllQuestions();

    // set it to show # Tags
    document.getElementById('tagNum').innerHTML = tags.length;

    const tagContainerRow = document.querySelector('.tagContainerRow');
    // Clear previous tags
    while (tagContainerRow.firstChild) {
      tagContainerRow.removeChild(tagContainerRow.firstChild);
    }

    for (let i = 0; i < tags.length; i++) {
        const tagId = tags[i].tid;
        const tagName = tags[i].name;
        let count = 0;
        for (let j = 0; j < qs.length; j++) {
            if (qs[j].tagIds.includes(tagId)) {
                count++;
            }
        }

        const tagContainer = document.createElement('div');
        tagContainer.className = 'tagContainer';
        tagContainerRow.appendChild(tagContainer);

        const tagTextDiv = document.createElement('div');
        tagTextDiv.className = 'tagText';
        tagContainer.appendChild(tagTextDiv);

        const tagLink = document.createElement('a');
        tagLink.className = 'tagLink';
        tagLink.innerHTML = tagName;
        tagTextDiv.appendChild(tagLink);

        const tagText = document.createElement('p');
        tagText.className = 'tagText';
        const span = document.createElement('span');
        span.className = 'questionNum';
        span.innerText = count;

        tagContainer.addEventListener('click', function () {
          const questions = model.data.questions
          const results = []
          const aTagId = model.getTidByName(tagName)
          for (const question of questions) {
            if (question.tagIds.includes(aTagId)) {
              results.push(question)
            }
          }
          restoreHomePage(results)
          document.getElementById('questionOrSearch').innerHTML = 'All Questions'
        })

        tagText.appendChild(span);
        tagText.append(' question');
        tagTextDiv.appendChild(tagText);
    }
  }

  // Method to run
  loadQuestions(model.getAllQuestions());
};
